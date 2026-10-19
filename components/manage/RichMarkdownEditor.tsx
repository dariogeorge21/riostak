"use client";

import React, { useId, useRef, useState } from "react";
import MarkdownRenderer, {
  type ReaderFontMode,
} from "@/components/blogs/MarkdownRenderer";
import {
  convertHtmlToMarkdown,
  getMarkdownStats,
  looksLikeMarkdown,
  normalizeMarkdown,
} from "@/utils/markdown";

type EditorViewMode = "write" | "split" | "preview";

interface RichMarkdownEditorProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  onReadingTimeSuggestion?: (readingTime: string) => void;
}

const SPECIAL_CHARACTER_GROUPS = [
  {
    group: "Editorial",
    chars: [
      { char: "—", label: "Em Dash" },
      { char: "–", label: "En Dash" },
      { char: "§", label: "Section Sign" },
      { char: "¶", label: "Pilcrow" },
      { char: "“”", label: "Smart Double Quotes", cursorOffset: -1 },
      { char: "‘’", label: "Smart Single Quotes", cursorOffset: -1 },
      { char: "†", label: "Dagger Footnote" },
      { char: "‡", label: "Double Dagger" },
      { char: "•", label: "Bullet" },
      { char: "…", label: "Ellipsis" },
    ],
  },
  {
    group: "Arrows & Math",
    chars: [
      { char: "→", label: "Right Arrow" },
      { char: "←", label: "Left Arrow" },
      { char: "↔", label: "Bidirectional Arrow" },
      { char: "⇒", label: "Implies" },
      { char: "±", label: "Plus-Minus" },
      { char: "≈", label: "Approximately" },
      { char: "≠", label: "Not Equal" },
      { char: "≤", label: "Less or Equal" },
      { char: "≥", label: "Greater or Equal" },
      { char: "∞", label: "Infinity" },
    ],
  },
  {
    group: "Greek & Science",
    chars: [
      { char: "α", label: "Alpha" },
      { char: "β", label: "Beta" },
      { char: "γ", label: "Gamma" },
      { char: "Δ", label: "Delta" },
      { char: "λ", label: "Lambda" },
      { char: "μ", label: "Mu" },
      { char: "π", label: "Pi" },
      { char: "σ", label: "Sigma" },
      { char: "Σ", label: "Summation" },
      { char: "Ω", label: "Omega" },
    ],
  },
] as const;

export default function RichMarkdownEditor({
  name,
  defaultValue = "",
  required = false,
  placeholder = "## Abstract\n\nWrite or paste your monograph in Markdown or Rich Text...",
  onReadingTimeSuggestion,
}: RichMarkdownEditorProps) {
  const editorId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [content, setContent] = useState<string>(() => normalizeMarkdown(defaultValue));
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [previewFont, setPreviewFont] = useState<ReaderFontMode>("sans");
  const [showCharPalette, setShowCharPalette] = useState(false);
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);
  const [isTall, setIsTall] = useState(false);
  const [smartPasteEnabled, setSmartPasteEnabled] = useState(true);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(() => [normalizeMarkdown(defaultValue)]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const stats = getMarkdownStats(content);

  const triggerPasteNotice = (msg: string) => {
    setPasteNotice(msg);
    window.setTimeout(() => {
      setPasteNotice((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const updateContent = (
    nextValue: string,
    selectionStart?: number,
    selectionEnd?: number,
    recordHistory = true
  ) => {
    const normalized = normalizeMarkdown(nextValue);
    setContent(normalized);

    if (onReadingTimeSuggestion) {
      const nextStats = getMarkdownStats(normalized);
      onReadingTimeSuggestion(nextStats.readingTime);
    }

    if (recordHistory) {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const updated = [...sliced, normalized].slice(-40);
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    }

    if (typeof selectionStart === "number") {
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
      });
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setContent(history[nextIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setContent(history[nextIdx]);
    }
  };

  /** Wraps the current selection with prefix/suffix markers (e.g. **bold**, *italic*, <u>underline</u>). */
  const applyInlineWrap = (prefix: string, suffix: string, fallbackText: string) => {
    const el = textareaRef.current;
    if (!el) {
      updateContent(`${content}${prefix}${fallbackText}${suffix}`);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);

    // Toggle off if already wrapped
    if (
      selected.startsWith(prefix) &&
      selected.endsWith(suffix) &&
      selected.length >= prefix.length + suffix.length
    ) {
      const unwrapped = selected.slice(prefix.length, selected.length - suffix.length);
      const next = content.slice(0, start) + unwrapped + content.slice(end);
      updateContent(next, start, start + unwrapped.length);
      return;
    }

    if (
      start >= prefix.length &&
      content.slice(start - prefix.length, start) === prefix &&
      content.slice(end, end + suffix.length) === suffix
    ) {
      const next =
        content.slice(0, start - prefix.length) +
        selected +
        content.slice(end + suffix.length);
      updateContent(next, start - prefix.length, end - prefix.length);
      return;
    }

    const inner = selected || fallbackText;
    const replacement = `${prefix}${inner}${suffix}`;
    const next = content.slice(0, start) + replacement + content.slice(end);
    updateContent(next, start + prefix.length, start + prefix.length + inner.length);
  };

  /** Prefixes selected line(s) with heading, list, or quote syntax. */
  const applyLinePrefix = (prefix: string, numbered = false) => {
    const el = textareaRef.current;
    if (!el) {
      updateContent(`${content}\n\n${prefix}Heading`);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const nextNewline = content.indexOf("\n", end);
    const lineEnd = nextNewline === -1 ? content.length : nextNewline;

    const blockText = content.slice(lineStart, lineEnd);
    const lines = blockText.split("\n");

    const transformedLines = lines.map((line, idx) => {
      const actualPrefix = numbered ? `${idx + 1}. ` : prefix;
      // If heading prefix, replace existing heading level
      if (/^#{1,4}\s+$/.test(prefix)) {
        const strippedHeading = line.replace(/^#{1,4}\s+/, "");
        if (line.startsWith(prefix)) {
          return strippedHeading;
        }
        return `${prefix}${strippedHeading || "Section Heading"}`;
      }
      if (line.startsWith(actualPrefix)) {
        return line.slice(actualPrefix.length);
      }
      return `${actualPrefix}${line || "List item"}`;
    });

    const joined = transformedLines.join("\n");
    const next = content.slice(0, lineStart) + joined + content.slice(lineEnd);
    updateContent(next, lineStart, lineStart + joined.length);
  };

  /** Inserts a multi-line block snippet (callout, table, code block, divider). */
  const insertBlockSnippet = (snippet: string, selectOffsetStart?: number, selectLength?: number) => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : content.length;
    const end = el ? el.selectionEnd : content.length;

    const before = content.slice(0, start);
    const after = content.slice(end);
    const needsLeadingBreak = before.length > 0 && !before.endsWith("\n\n");
    const leading = !before.length ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const trailing = !after.length ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const fullInsert = `${ needsLeadingBreak ? leading : "" }${snippet}${trailing}`;
    const next = before + fullInsert + after;
    const basePos = before.length + (needsLeadingBreak ? leading.length : 0);

    if (typeof selectOffsetStart === "number" && typeof selectLength === "number") {
      updateContent(next, basePos + selectOffsetStart, basePos + selectOffsetStart + selectLength);
    } else {
      updateContent(next, basePos + snippet.length, basePos + snippet.length);
    }
  };

  /** Inserts a special character at cursor position. */
  const insertCharacter = (chars: string, cursorOffset = 0) => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : content.length;
    const end = el ? el.selectionEnd : content.length;
    const selected = content.slice(start, end);

    if (chars.length === 2 && cursorOffset === -1 && selected) {
      const wrapped = `${chars[0]}${selected}${chars[1]}`;
      const next = content.slice(0, start) + wrapped + content.slice(end);
      updateContent(next, start + 1, start + 1 + selected.length);
      return;
    }

    const next = content.slice(0, start) + chars + content.slice(end);
    const newCursor = start + chars.length + cursorOffset;
    updateContent(next, newCursor, newCursor);
  };

  /** Keyboard shortcuts for power editing (Ctrl/Cmd + B, I, U, E, K, Z, Y). */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey;
    if (!isMod) {
      if (e.key === "Tab") {
        e.preventDefault();
        insertCharacter("  ");
      }
      return;
    }

    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      applyInlineWrap("**", "**", "bold text");
    } else if (key === "i") {
      e.preventDefault();
      applyInlineWrap("*", "*", "italic text");
    } else if (key === "u") {
      e.preventDefault();
      applyInlineWrap("<u>", "</u>", "underlined text");
    } else if (key === "e") {
      e.preventDefault();
      applyInlineWrap("`", "`", "code");
    } else if (key === "k") {
      e.preventDefault();
      applyInlineWrap("[", "](https://)", "link title");
    } else if (e.shiftKey && key === "x") {
      e.preventDefault();
      applyInlineWrap("~~", "~~", "strikethrough");
    } else if (e.shiftKey && key === "h") {
      e.preventDefault();
      applyInlineWrap("==", "==", "highlighted phrase");
    } else if (key === "z" && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if ((key === "z" && e.shiftKey) || key === "y") {
      e.preventDefault();
      handleRedo();
    }
  };

  /**
   * Smart Paste Handler:
   * 1. Pasting a URL over selected text creates a Markdown link `[selected](url)`.
   * 2. Pasting rich HTML (Google Docs, Word, Notion, web articles) converts headings,
   *    bold, italic, underline, lists, tables, and blockquotes into clean Markdown.
   * 3. Pasting raw Markdown normalizes CRLF line endings cleanly.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (!el) return;

    const plainText = e.clipboardData.getData("text/plain");
    const htmlText = e.clipboardData.getData("text/html");
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);

    // 1. Smart URL link wrap when text is selected
    if (selected && /^https?:\/\/\S+$/i.test(plainText.trim())) {
      e.preventDefault();
      const linked = `[${selected}](${plainText.trim()})`;
      const next = content.slice(0, start) + linked + content.slice(end);
      updateContent(next, start, start + linked.length);
      triggerPasteNotice("Linked selected text to URL");
      return;
    }

    // 2. Smart HTML-to-Markdown conversion when rich HTML is pasted and plain text isn't already Markdown
    if (smartPasteEnabled && htmlText && !looksLikeMarkdown(plainText)) {
      const converted = convertHtmlToMarkdown(htmlText);
      if (converted && converted !== plainText.trim()) {
        e.preventDefault();
        const next = content.slice(0, start) + converted + content.slice(end);
        updateContent(next, start + converted.length, start + converted.length);
        triggerPasteNotice("Rich text pasted & auto-formatted to Markdown");
        return;
      }
    }

    // 3. Clean Markdown paste normalization
    if (plainText) {
      e.preventDefault();
      const normalized = normalizeMarkdown(plainText);
      const next = content.slice(0, start) + normalized + content.slice(end);
      updateContent(next, start + normalized.length, start + normalized.length);
      if (looksLikeMarkdown(normalized)) {
        triggerPasteNotice("Markdown pasted & ready for client view");
      }
    }
  };

  /** Cleans up excess blank lines and normalizes spacing in the document. */
  const handleFormatDocument = () => {
    const cleaned = normalizeMarkdown(content)
      .replace(/[ \t]+$/gm, "")
      .replace(/^(#{1,4})([^\s#])/gm, "$1 $2")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    updateContent(cleaned);
    triggerPasteNotice("Monograph formatting normalized");
  };

  const minHeightClass = isTall ? "min-h-[520px]" : "min-h-[300px]";

  return (
    <div className="flex flex-col rounded-xs border border-primary/20 bg-surface-container-lowest shadow-xs">
      {/* Hidden input/textarea value is bound directly via the main textarea below */}
      {/* Top Studio Header Bar: View Mode Tabs + Smart Paste + Expand */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/12 bg-cream/60 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Editor view mode">
          {(
            [
              { id: "write", label: "Write" },
              { id: "split", label: "Split Studio (Live)" },
              { id: "preview", label: "Client Preview" },
            ] as const
          ).map((tab) => {
            const active = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                aria-selected={active}
                className={`rounded-full px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary text-cream shadow-2xs"
                    : "text-on-surface-variant hover:bg-cream-deep hover:text-primary"
                }`}
                onClick={() => setViewMode(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pasteNotice ? (
            <span className="rounded-full bg-secondary-container/70 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
              ✓ {pasteNotice}
            </span>
          ) : null}

          <label className="inline-flex cursor-pointer items-center gap-1.5 font-display text-[10px] uppercase tracking-wider text-on-surface-variant">
            <input
              checked={smartPasteEnabled}
              className="h-3.5 w-3.5 accent-primary"
              onChange={(e) => setSmartPasteEnabled(e.target.checked)}
              type="checkbox"
            />
            <span>Smart Paste (Markdown + Rich Text)</span>
          </label>

          <button
            className="rounded-xs border border-primary/15 bg-white px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-cream"
            onClick={handleFormatDocument}
            title="Clean up spacing and normalize Markdown syntax"
            type="button"
          >
            Format
          </button>

          <button
            className="rounded-xs border border-primary/15 bg-white px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-cream"
            onClick={() => setIsTall((prev) => !prev)}
            title="Toggle editor height"
            type="button"
          >
            {isTall ? "Compact" : "Expand"}
          </button>
        </div>
      </div>

      {/* Primary Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-primary/10 bg-cream/30 px-2.5 py-1.5">
        {/* Heading & Typography Group */}
        <div className="flex items-center gap-0.5 pr-1.5">
          <button
            className="rounded-xs px-2 py-1 font-display text-[11px] font-bold text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("# ")}
            title="Heading 1 (# Title)"
            type="button"
          >
            H1
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[11px] font-bold text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("## ")}
            title="Heading 2 (## Section)"
            type="button"
          >
            H2
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[11px] font-bold text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("### ")}
            title="Heading 3 (### Subsection)"
            type="button"
          >
            H3
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[11px] font-bold text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("#### ")}
            title="Heading 4 (#### Eyebrow Heading)"
            type="button"
          >
            H4
          </button>
        </div>

        <div aria-hidden="true" className="h-4 w-px bg-primary/15" />

        {/* Character Styling Group: Bold, Italic, Underline, Strikethrough, Highlight, Sup, Sub */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            className="rounded-xs px-2 py-1 font-sans text-[12px] font-bold text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("**", "**", "bold text")}
            title="Bold (Ctrl+B)"
            type="button"
          >
            B
          </button>
          <button
            className="rounded-xs px-2 py-1 font-serif text-[13px] italic text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("*", "*", "italic text")}
            title="Italic (Ctrl+I)"
            type="button"
          >
            I
          </button>
          <button
            className="rounded-xs px-2 py-1 font-sans text-[12px] underline decoration-secondary decoration-2 underline-offset-2 text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("<u>", "</u>", "underlined text")}
            title="Underline (Ctrl+U)"
            type="button"
          >
            U
          </button>
          <button
            className="rounded-xs px-2 py-1 font-sans text-[12px] line-through text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("~~", "~~", "strikethrough")}
            title="Strikethrough (Ctrl+Shift+X)"
            type="button"
          >
            S
          </button>
          <button
            className="rounded-xs bg-secondary-container/40 px-2 py-1 font-display text-[10px] font-bold text-primary hover:bg-secondary-container"
            onClick={() => applyInlineWrap("==", "==", "highlighted phrase")}
            title="Highlight / Mark (Ctrl+Shift+H)"
            type="button"
          >
            Mark
          </button>
          <button
            className="rounded-xs px-1.5 py-1 font-mono text-[11px] text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("<sup>", "</sup>", "1")}
            title="Superscript / Footnote (<sup>1</sup>)"
            type="button"
          >
            X<sup>2</sup>
          </button>
          <button
            className="rounded-xs px-1.5 py-1 font-mono text-[11px] text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("<sub>", "</sub>", "2")}
            title="Subscript (<sub>2</sub>)"
            type="button"
          >
            X<sub>2</sub>
          </button>
        </div>

        <div aria-hidden="true" className="h-4 w-px bg-primary/15" />

        {/* Font Family / Typographic Voice Spans */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            className="rounded-xs px-2 py-1 font-serif text-[12px] italic text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("[serif:", "]", "editorial serif phrase")}
            title="Editorial Serif Font Style ([serif:text])"
            type="button"
          >
            Serif
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("[display:", "]", "SMALL CAPS LABEL")}
            title="Display Uppercase Font Style ([display:text])"
            type="button"
          >
            Display
          </button>
          <button
            className="rounded-xs px-2 py-1 font-mono text-[11px] text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("`", "`", "code")}
            title="Inline Monospace / Code (Ctrl+E)"
            type="button"
          >
            {"</>"}
          </button>
        </div>

        <div aria-hidden="true" className="h-4 w-px bg-primary/15" />

        {/* Lists, Quotes, Callouts, Tables, Links */}
        <div className="flex flex-wrap items-center gap-0.5 px-1">
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("- ")}
            title="Bullet List (- item)"
            type="button"
          >
            • List
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("1. ", true)}
            title="Numbered List (1. item)"
            type="button"
          >
            1. List
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() => applyLinePrefix("- [ ] ")}
            title="Checklist Item (- [ ] task)"
            type="button"
          >
            ☑ Task
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() =>
              insertBlockSnippet(
                "> “Enter a scholarly quotation or thesis reflection here.”\n> — Author / Fellow",
                3,
                54
              )
            }
            title="Blockquote with Attribution"
            type="button"
          >
            ❝ Quote
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-secondary hover:bg-cream-deep"
            onClick={() =>
              insertBlockSnippet(
                "> [!IMPORTANT] Empirical Key Finding\n> Summarize the primary clinical or methodological takeaway here.",
                15,
                21
              )
            }
            title="Insert Editorial Callout Box ([!NOTE], [!IMPORTANT], [!TIP])"
            type="button"
          >
            ✦ Callout
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() =>
              insertBlockSnippet(
                "| Dimension | Baseline | Cohort Outcome |\n| --- | --- | --- |\n| Somatic Regulation | 42.1 | +31.4% |\n| Attentional Stability | 58.0 | +28.9% |"
              )
            }
            title="Insert Markdown Data Table"
            type="button"
          >
            ⊞ Table
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() => applyInlineWrap("[", "](https://)", "citation link")}
            title="Insert Hyperlink (Ctrl+K)"
            type="button"
          >
            🔗 Link
          </button>
          <button
            className="rounded-xs px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-cream-deep"
            onClick={() => insertBlockSnippet("---")}
            title="Insert Section Divider (---)"
            type="button"
          >
            ― Rule
          </button>
        </div>

        <div aria-hidden="true" className="h-4 w-px bg-primary/15" />

        {/* Special Characters & Help Toggles */}
        <div className="ml-auto flex items-center gap-1">
          <button
            aria-expanded={showCharPalette}
            className={`rounded-xs px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider transition-colors ${
              showCharPalette
                ? "bg-primary text-cream"
                : "bg-cream-deep/70 text-primary hover:bg-cream-deep"
            }`}
            onClick={() => setShowCharPalette((prev) => !prev)}
            title="Open Special Characters & Academic Symbols Palette"
            type="button"
          >
            Ω Symbols
          </button>
          <button
            aria-expanded={showSyntaxGuide}
            className={`rounded-xs px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
              showSyntaxGuide
                ? "bg-secondary text-on-secondary"
                : "text-on-surface-variant hover:bg-cream-deep hover:text-primary"
            }`}
            onClick={() => setShowSyntaxGuide((prev) => !prev)}
            title="Toggle Markdown & Styling Quick Reference"
            type="button"
          >
            ? Guide
          </button>
        </div>
      </div>

      {/* Expandable Special Characters & Symbols Bar */}
      {showCharPalette ? (
        <div className="flex flex-wrap items-center gap-4 border-b border-primary/10 bg-cream/55 px-3 py-2">
          {SPECIAL_CHARACTER_GROUPS.map((grp) => (
            <div key={grp.group} className="flex flex-wrap items-center gap-1">
              <span className="mr-1 font-display text-[10px] font-bold uppercase tracking-wider text-secondary">
                {grp.group}:
              </span>
              {grp.chars.map((item) => (
                <button
                  key={item.label}
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded-xs border border-primary/15 bg-white px-1.5 font-serif text-xs font-medium text-primary shadow-2xs transition-colors hover:border-primary hover:bg-primary hover:text-cream"
                  onClick={() =>
                    insertCharacter(
                      item.char,
                      "cursorOffset" in item ? item.cursorOffset : 0
                    )
                  }
                  title={item.label}
                  type="button"
                >
                  {item.char}
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {/* Expandable Syntax Cheat Sheet */}
      {showSyntaxGuide ? (
        <div className="grid grid-cols-2 gap-2 border-b border-primary/10 bg-cream/40 px-3.5 py-2.5 font-mono text-[11px] text-primary sm:grid-cols-4">
          <div>
            <strong className="font-display uppercase text-secondary">Headings:</strong>{" "}
            <code># H1</code>, <code>## H2</code>, <code>### H3</code>
          </div>
          <div>
            <strong className="font-display uppercase text-secondary">Emphasis:</strong>{" "}
            <code>**bold**</code>, <code>*italic*</code>, <code>&lt;u&gt;underline&lt;/u&gt;</code>
          </div>
          <div>
            <strong className="font-display uppercase text-secondary">Fonts:</strong>{" "}
            <code>[serif:text]</code>, <code>[display:text]</code>, <code>==highlight==</code>
          </div>
          <div>
            <strong className="font-display uppercase text-secondary">Callouts:</strong>{" "}
            <code>&gt; [!IMPORTANT] Title</code>
          </div>
        </div>
      ) : null}

      {/* Main Workspace: Write / Split Studio / Client Preview */}
      <div
        className={`grid grid-cols-1 ${
          viewMode === "split" ? "lg:grid-cols-2 lg:divide-x lg:divide-primary/12" : ""
        }`}
      >
        {/* Left Pane: Markdown / Rich-Paste Editor */}
        <div className={viewMode === "preview" ? "hidden" : "flex flex-col"}>
          <div className="flex items-center justify-between border-b border-primary/8 bg-cream/15 px-3 py-1">
            <label
              className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant"
              htmlFor={editorId}
            >
              Markdown Source // Paste Markdown or Rich Text directly
            </label>
            <div className="flex items-center gap-2">
              <button
                className="font-mono text-[10px] text-on-surface-variant hover:text-primary disabled:opacity-40"
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                type="button"
              >
                Undo
              </button>
              <button
                className="font-mono text-[10px] text-on-surface-variant hover:text-primary disabled:opacity-40"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                type="button"
              >
                Redo
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            className={`w-full flex-1 resize-y bg-white p-4 font-mono text-[13.5px] leading-[1.7] text-primary placeholder:text-on-surface-variant/45 focus:outline-none ${minHeightClass}`}
            id={editorId}
            name={name}
            onChange={(e) => updateContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            required={required}
            value={content}
          />
        </div>

        {/* Right Pane: Live Client-Side Monograph Preview */}
        {viewMode !== "write" ? (
          <div className="flex flex-col bg-surface-container-lowest">
            <div className="flex items-center justify-between border-b border-primary/8 bg-cream/25 px-3 py-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-secondary">
                Live Client View // Exact Reader Rendering
              </span>
              <div className="flex items-center gap-1">
                <button
                  className={`rounded-xs px-2 py-0.5 font-display text-[10px] uppercase ${
                    previewFont === "sans"
                      ? "bg-primary text-cream"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                  onClick={() => setPreviewFont("sans")}
                  type="button"
                >
                  Sans
                </button>
                <button
                  className={`rounded-xs px-2 py-0.5 font-serif text-[11px] italic ${
                    previewFont === "serif"
                      ? "bg-primary text-cream"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                  onClick={() => setPreviewFont("serif")}
                  type="button"
                >
                  Serif
                </button>
              </div>
            </div>

            <div className={`max-h-[600px] flex-1 overflow-y-auto p-5 ${minHeightClass}`}>
              <MarkdownRenderer content={content} fontMode={previewFont} sizeMode="md" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 bg-cream/40 px-3 py-1.5 font-mono text-[11px] text-on-surface-variant">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            <strong className="text-primary">{stats.words}</strong> words
          </span>
          <span>•</span>
          <span>
            <strong className="text-primary">{stats.characters}</strong> chars
          </span>
          <span>•</span>
          <span>
            <strong className="text-primary">{stats.paragraphs}</strong> blocks
          </span>
          <span>•</span>
          <span className="text-secondary font-semibold">Est. {stats.readingTime}</span>
        </div>

        <span className="text-[10px] text-on-surface-variant/80">
          Shortcuts: Ctrl+B (Bold) • Ctrl+I (Italic) • Ctrl+U (Underline) • Ctrl+K (Link)
        </span>
      </div>
    </div>
  );
}
