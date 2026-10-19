import React from "react";
import {
  type CalloutKind,
  type MarkdownBlock,
  parseMarkdownBlocks,
} from "@/utils/markdown";

export type ReaderFontMode = "serif" | "sans";
export type ReaderSizeMode = "sm" | "md" | "lg";

interface MarkdownRendererProps {
  content: string;
  fontMode?: ReaderFontMode;
  sizeMode?: ReaderSizeMode;
  idPrefix?: string;
}

const CALLOUT_STYLES: Record<
  CalloutKind,
  { border: string; bg: string; badgeBg: string; badgeText: string; defaultLabel: string }
> = {
  NOTE: {
    border: "border-primary",
    bg: "bg-cream/60",
    badgeBg: "bg-primary",
    badgeText: "text-cream",
    defaultLabel: "Editorial Note",
  },
  IMPORTANT: {
    border: "border-secondary",
    bg: "bg-secondary-container/25",
    badgeBg: "bg-secondary",
    badgeText: "text-on-secondary",
    defaultLabel: "Key Finding",
  },
  TIP: {
    border: "border-gold",
    bg: "bg-cream/80",
    badgeBg: "bg-gold",
    badgeText: "text-primary",
    defaultLabel: "MethodologicalPraxis",
  },
  WARNING: {
    border: "border-red-700",
    bg: "bg-red-50/80",
    badgeBg: "bg-red-700",
    badgeText: "text-white",
    defaultLabel: "Clinical Caution",
  },
  INSIGHT: {
    border: "border-primary-container",
    bg: "bg-surface-container",
    badgeBg: "bg-primary-container",
    badgeText: "text-cream",
    defaultLabel: "Empirical Insight",
  },
};

const INLINE_TOKEN_REGEX =
  /(`[^`]+`|\*\*\*[\s\S]+?\*\*\*|___[\s\S]+?___|\*\*[\s\S]+?\*\*|__[\s\S]+?__|<u>[\s\S]+?<\/u>|<ins>[\s\S]+?<\/ins>|\+\+[\s\S]+?\+\+|~~[\s\S]+?~~|<del>[\s\S]+?<\/del>|==[\s\S]+?==|<mark>[\s\S]+?<\/mark>|<sup>[\s\S]+?<\/sup>|<sub>[\s\S]+?<\/sub>|\^[^^\s][^^]*?\^|~[^~\s][^~]*?~|\[(?:serif|display|mono):[\s\S]+?\]|\*[^\s*][\s\S]*?\*|\*[^\s*]\*|(?<![a-zA-Z0-9])_[^\s_][\s\S]*?_(?![a-zA-Z0-9])|\[[^\]]+\]\([^)]+\))/g;

/**
 * Recursively tokenizes inline Markdown and character/font tags into React nodes.
 * Completely XSS-safe: never uses dangerouslySetInnerHTML.
 */
export function renderInlineMarkdown(text: string, keyPrefix = "inl"): React.ReactNode[] {
  if (!text) return [];

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = new RegExp(INLINE_TOKEN_REGEX.source, "g");
  let match: RegExpExecArray | null;
  let tokenIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${tokenIdx++}`;

    // 1. Inline Code: `code`
    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-xs border border-primary/15 bg-cream px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-primary"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    // 2. Bold + Italic: ***text*** or ___text___
    else if (
      (token.startsWith("***") && token.endsWith("***")) ||
      (token.startsWith("___") && token.endsWith("___"))
    ) {
      nodes.push(
        <strong key={key} className="font-bold italic text-primary">
          {renderInlineMarkdown(token.slice(3, -3), key)}
        </strong>
      );
    }
    // 3. Bold: **text** or __text__
    else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      nodes.push(
        <strong key={key} className="font-bold text-primary">
          {renderInlineMarkdown(token.slice(2, -2), key)}
        </strong>
      );
    }
    // 4. Underline: <u>text</u>, <ins>text</ins>, or ++text++
    else if (
      (token.startsWith("<u>") && token.endsWith("</u>")) ||
      (token.startsWith("<ins>") && token.endsWith("</ins>")) ||
      (token.startsWith("++") && token.endsWith("++"))
    ) {
      const inner = token.startsWith("<u>")
        ? token.slice(3, -4)
        : token.startsWith("<ins>")
          ? token.slice(5, -6)
          : token.slice(2, -2);
      nodes.push(
        <u
          key={key}
          className="decoration-secondary decoration-2 underline-offset-4"
        >
          {renderInlineMarkdown(inner, key)}
        </u>
      );
    }
    // 5. Strikethrough: ~~text~~ or <del>text</del>
    else if (
      (token.startsWith("~~") && token.endsWith("~~")) ||
      (token.startsWith("<del>") && token.endsWith("</del>"))
    ) {
      const inner = token.startsWith("~~") ? token.slice(2, -2) : token.slice(5, -6);
      nodes.push(
        <del key={key} className="text-on-surface-variant/75 line-through">
          {renderInlineMarkdown(inner, key)}
        </del>
      );
    }
    // 6. Highlight / Mark: ==text== or <mark>text</mark>
    else if (
      (token.startsWith("==") && token.endsWith("==")) ||
      (token.startsWith("<mark>") && token.endsWith("</mark>"))
    ) {
      const inner = token.startsWith("==") ? token.slice(2, -2) : token.slice(6, -7);
      nodes.push(
        <mark
          key={key}
          className="rounded-xs bg-secondary-container/55 px-1 py-0.5 text-primary"
        >
          {renderInlineMarkdown(inner, key)}
        </mark>
      );
    }
    // 7. Superscript: <sup>text</sup> or ^text^
    else if (
      (token.startsWith("<sup>") && token.endsWith("</sup>")) ||
      (token.startsWith("^") && token.endsWith("^"))
    ) {
      const inner = token.startsWith("<sup>") ? token.slice(5, -6) : token.slice(1, -1);
      nodes.push(
        <sup key={key} className="ml-0.5 font-mono text-[0.72em] font-semibold text-secondary">
          {renderInlineMarkdown(inner, key)}
        </sup>
      );
    }
    // 8. Subscript: <sub>text</sub> or ~text~
    else if (
      (token.startsWith("<sub>") && token.endsWith("</sub>")) ||
      (token.startsWith("~") && token.endsWith("~"))
    ) {
      const inner = token.startsWith("<sub>") ? token.slice(5, -6) : token.slice(1, -1);
      nodes.push(
        <sub key={key} className="font-mono text-[0.72em] text-on-surface-variant">
          {renderInlineMarkdown(inner, key)}
        </sub>
      );
    }
    // 9. Font Family Spans: [serif:text], [display:text], [mono:text]
    else if (/^\[(?:serif|display|mono):[\s\S]+\]$/i.test(token)) {
      const colonIdx = token.indexOf(":");
      const fontType = token.slice(1, colonIdx).toLowerCase();
      const inner = token.slice(colonIdx + 1, -1);
      const fontClass =
        fontType === "serif"
          ? "font-serif italic text-[1.08em] text-primary"
          : fontType === "display"
            ? "font-display uppercase tracking-[0.12em] text-[0.9em] font-semibold text-primary"
            : "font-mono text-[0.9em] text-primary";
      nodes.push(
        <span key={key} className={fontClass}>
          {renderInlineMarkdown(inner, key)}
        </span>
      );
    }
    // 10. Links: [label](url)
    else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const splitIdx = token.indexOf("](");
      const label = token.slice(1, splitIdx);
      const url = token.slice(splitIdx + 2, -1).trim();
      const isSafeUrl = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url);
      if (isSafeUrl) {
        const isExternal = /^https?:\/\//i.test(url);
        nodes.push(
          <a
            key={key}
            className="font-medium text-secondary underline decoration-secondary/50 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            href={url}
            rel={isExternal ? "noopener noreferrer" : undefined}
            target={isExternal ? "_blank" : undefined}
          >
            {renderInlineMarkdown(label, key)}
          </a>
        );
      } else {
        nodes.push(label);
      }
    }
    // 11. Italic: *text* or _text_
    else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      nodes.push(
        <em key={key} className="font-serif italic text-[1.04em] text-primary/95">
          {renderInlineMarkdown(token.slice(1, -1), key)}
        </em>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/** Renders a multi-line paragraph preserving single line breaks cleanly. */
function renderLinesWithBreaks(text: string, keyPrefix: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, idx) => (
    <React.Fragment key={`${keyPrefix}-ln-${idx}`}>
      {renderInlineMarkdown(line, `${keyPrefix}-ln-${idx}`)}
      {idx < lines.length - 1 ? <br /> : null}
    </React.Fragment>
  ));
}

export default function MarkdownRenderer({
  content,
  fontMode = "sans",
  sizeMode = "md",
  idPrefix = "",
}: MarkdownRendererProps) {
  const blocks: MarkdownBlock[] = parseMarkdownBlocks(content);

  const bodySizeClass =
    sizeMode === "lg"
      ? "text-[1.15rem] leading-[1.85]"
      : sizeMode === "sm"
        ? "text-[0.95rem] leading-[1.7]"
        : "text-[1.05rem] leading-[1.8]";

  const bodyFontClass = fontMode === "serif" ? "font-serif" : "font-sans";

  if (blocks.length === 0) {
    return (
      <p className="font-serif italic text-on-surface-variant">
        No monograph content provided yet.
      </p>
    );
  }

  return (
    <div className={`space-y-6 text-on-surface ${bodyFontClass} ${bodySizeClass}`}>
      {blocks.map((block, idx) => {
        const key = `md-block-${idx}`;

        switch (block.type) {
          case "heading": {
            const anchorId = idPrefix ? `${idPrefix}-${block.id}` : block.id;
            if (block.level === 1) {
              return (
                <h2
                  key={key}
                  className="mt-8 border-b border-primary/15 pb-3 font-display text-headline-md uppercase tracking-tight text-primary first:mt-0"
                  id={anchorId}
                >
                  {renderInlineMarkdown(block.text, key)}
                </h2>
              );
            }
            if (block.level === 2) {
              return (
                <h3
                  key={key}
                  className="mt-8 flex items-center gap-2.5 border-b border-primary/10 pb-2.5 font-display text-headline-sm uppercase tracking-tight text-primary first:mt-0"
                  id={anchorId}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 shrink-0 rounded-full bg-gold"
                  />
                  <span>{renderInlineMarkdown(block.text, key)}</span>
                </h3>
              );
            }
            if (block.level === 3) {
              return (
                <h4
                  key={key}
                  className="mt-6 font-display text-title-md font-semibold uppercase tracking-wide text-secondary first:mt-0"
                  id={anchorId}
                >
                  {renderInlineMarkdown(block.text, key)}
                </h4>
              );
            }
            return (
              <h5
                key={key}
                className="mt-4 font-display text-label-lg uppercase tracking-[0.16em] text-primary/85 first:mt-0"
                id={anchorId}
              >
                {renderInlineMarkdown(block.text, key)}
              </h5>
            );
          }

          case "paragraph":
            return (
              <p key={key} className="max-w-[74ch] text-on-surface/95">
                {renderLinesWithBreaks(block.text, key)}
              </p>
            );

          case "unordered-list":
            return (
              <ul
                key={key}
                className="my-4 max-w-[72ch] space-y-2.5 rounded-xs border-l-2 border-secondary/45 bg-cream/45 py-4 pl-5 pr-5"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={`${key}-li-${itemIdx}`} className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-3">
                      {typeof item.checked === "boolean" ? (
                        <span
                          aria-hidden="true"
                          className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border text-[10px] font-bold ${
                            item.checked
                              ? "border-primary bg-primary text-gold"
                              : "border-primary/35 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                        />
                      )}
                      <span
                        className={
                          item.checked ? "text-on-surface-variant line-through" : "text-primary"
                        }
                      >
                        {renderInlineMarkdown(item.text, `${key}-li-${itemIdx}`)}
                      </span>
                    </div>
                    {item.subItems && item.subItems.length > 0 ? (
                      <ul className="ml-6 space-y-1 border-l border-primary/15 pl-3 text-[0.94em] text-on-surface-variant">
                        {item.subItems.map((sub, subIdx) => (
                          <li key={`${key}-li-${itemIdx}-sub-${subIdx}`}>
                            {renderInlineMarkdown(sub, `${key}-li-${itemIdx}-sub-${subIdx}`)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            );

          case "ordered-list": {
            const startNum = block.start ?? 1;
            return (
              <ol
                key={key}
                className="my-4 max-w-[72ch] space-y-3 rounded-xs border border-primary/10 bg-cream/40 p-5"
                start={startNum}
              >
                {block.items.map((item, itemIdx) => {
                  const num = startNum + itemIdx;
                  const formattedNum = num < 10 ? `0${num}` : `${num}`;
                  return (
                    <li key={`${key}-oli-${itemIdx}`} className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-3.5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-bold text-gold"
                        >
                          {formattedNum}
                        </span>
                        <span className="flex-1 text-primary">
                          {renderInlineMarkdown(item.text, `${key}-oli-${itemIdx}`)}
                        </span>
                      </div>
                      {item.subItems && item.subItems.length > 0 ? (
                        <ul className="ml-9 space-y-1 border-l border-primary/15 pl-3 text-[0.94em] text-on-surface-variant">
                          {item.subItems.map((sub, subIdx) => (
                            <li key={`${key}-oli-${itemIdx}-sub-${subIdx}`}>
                              {renderInlineMarkdown(sub, `${key}-oli-${itemIdx}-sub-${subIdx}`)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            );
          }

          case "blockquote":
            return (
              <figure
                key={key}
                className="my-6 max-w-[70ch] border-l-4 border-gold bg-cream/65 px-6 py-5 shadow-2xs"
              >
                <blockquote className="space-y-2 font-serif text-[1.18em] italic leading-relaxed text-primary">
                  {block.lines.map((line, lIdx) => (
                    <p key={`${key}-bq-${lIdx}`}>
                      {renderInlineMarkdown(line, `${key}-bq-${lIdx}`)}
                    </p>
                  ))}
                </blockquote>
                {block.attribution ? (
                  <figcaption className="mt-3 font-display text-label-xs uppercase tracking-[0.18em] text-secondary">
                    — {renderInlineMarkdown(block.attribution, `${key}-attr`)}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "callout": {
            const style = CALLOUT_STYLES[block.kind] || CALLOUT_STYLES.NOTE;
            return (
              <aside
                key={key}
                className={`my-5 max-w-[72ch] border-l-4 ${style.border} ${style.bg} p-5`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-xs px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.18em] ${style.badgeBg} ${style.badgeText}`}
                  >
                    {block.kind}
                  </span>
                  <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                    {block.title
                      ? renderInlineMarkdown(block.title, `${key}-ctitle`)
                      : style.defaultLabel}
                  </span>
                </div>
                <div className="space-y-1.5 text-[0.96em] text-primary/90">
                  {block.lines.map((line, lIdx) => (
                    <p key={`${key}-cl-${lIdx}`}>
                      {renderInlineMarkdown(line, `${key}-cl-${lIdx}`)}
                    </p>
                  ))}
                </div>
              </aside>
            );
          }

          case "code-block":
            return (
              <div
                key={key}
                className="my-5 overflow-hidden rounded-xs border border-primary/20 bg-primary text-cream shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-cream/15 bg-primary-container px-4 py-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gold">
                    {block.language || "snippet"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/50">
                    Monograph Specification
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-cream">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          case "table":
            return (
              <div
                key={key}
                className="my-6 overflow-x-auto rounded-xs border border-primary/15 bg-surface-container-lowest shadow-2xs"
              >
                <table className="w-full border-collapse text-left text-body-sm">
                  <thead>
                    <tr className="border-b border-primary/15 bg-cream/80">
                      {block.headers.map((header, hIdx) => (
                        <th
                          key={`${key}-th-${hIdx}`}
                          className="px-4 py-3 font-display text-label-xs font-bold uppercase tracking-wider text-primary"
                          style={{ textAlign: block.alignments[hIdx] || "left" }}
                        >
                          {renderInlineMarkdown(header, `${key}-th-${hIdx}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={`${key}-tr-${rIdx}`}
                        className="transition-colors hover:bg-cream/35"
                      >
                        {block.headers.map((_, cIdx) => (
                          <td
                            key={`${key}-td-${rIdx}-${cIdx}`}
                            className="px-4 py-2.5 text-on-surface"
                            style={{ textAlign: block.alignments[cIdx] || "left" }}
                          >
                            {renderInlineMarkdown(row[cIdx] || "", `${key}-td-${rIdx}-${cIdx}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "hr":
            return (
              <div key={key} aria-hidden="true" className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-primary/15" />
                <span className="font-serif text-sm italic text-secondary">§</span>
                <div className="h-px flex-1 bg-primary/15" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
