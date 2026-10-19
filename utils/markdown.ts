/**
 * Comprehensive Markdown & Rich-Text utilities for RIOSTAK Monographs.
 * - Normalizes CRLF (\r\n) line endings from HTML FormData submissions.
 * - Parses block-level Markdown into a structured AST (headings, paragraphs,
 *   ordered/unordered/task lists, blockquotes, callouts, code blocks, tables, dividers).
 * - Converts pasted rich HTML (Google Docs, Word, Notion, web pages) into clean Markdown.
 * - Computes word counts, character counts, and estimated reading time.
 */

export type CalloutKind = "NOTE" | "IMPORTANT" | "TIP" | "WARNING" | "INSIGHT";

export type ListItemNode = {
  text: string;
  checked?: boolean;
  subItems?: string[];
};

export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: ListItemNode[] }
  | { type: "ordered-list"; items: ListItemNode[]; start?: number }
  | { type: "blockquote"; lines: string[]; attribution?: string }
  | { type: "callout"; kind: CalloutKind; title?: string; lines: string[] }
  | { type: "code-block"; language: string; code: string }
  | { type: "table"; headers: string[]; alignments: ("left" | "center" | "right")[]; rows: string[][] }
  | { type: "hr" };

export type TocHeading = {
  id: string;
  level: 1 | 2 | 3 | 4;
  text: string;
};

/** Normalizes line endings and cleans up invisible zero-width characters. */
export function normalizeMarkdown(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ");
}

/** Generates a URL-safe anchor slug from heading text. */
export function slugifyHeading(text: string): string {
  const plain = stripInlineMarkdown(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return plain || "section";
}

/** Strips inline markdown markers for plain-text previews, TOC labels, and word counting. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/<\/?(?:u|ins|b|strong|i|em|s|del|mark|sup|sub|code|span)[^>]*>/gi, "")
    .replace(/\[(?:serif|display|mono):([\s\S]*?)\]/gi, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*\*|___)(.*?)\1/g, "$2")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\+\+)(.*?)\1/g, "$2")
    .replace(/(==)(.*?)\1/g, "$2")
    .replace(/(~~)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/** Computes reading telemetry for a markdown document. */
export function getMarkdownStats(raw: string): {
  words: number;
  characters: number;
  paragraphs: number;
  readingTime: string;
} {
  const normalized = normalizeMarkdown(raw).trim();
  if (!normalized) {
    return { words: 0, characters: 0, paragraphs: 0, readingTime: "1 min read" };
  }
  const plain = stripInlineMarkdown(normalized);
  const words = plain
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const characters = plain.length;
  const paragraphs = normalized
    .split(/\n{2,}/)
    .filter((p) => p.trim().length > 0).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return {
    words,
    characters,
    paragraphs,
    readingTime: `${minutes} min read`,
  };
}

/** Extracts a Table of Contents list from parsed blocks. */
export function extractToc(blocks: readonly MarkdownBlock[]): TocHeading[] {
  return blocks
    .filter((b): b is Extract<MarkdownBlock, { type: "heading" }> => b.type === "heading")
    .map((h) => ({
      id: h.id,
      level: h.level,
      text: stripInlineMarkdown(h.text),
    }));
}

/** Parses a Markdown string into structured block nodes. */
export function parseMarkdownBlocks(raw: string): MarkdownBlock[] {
  const source = normalizeMarkdown(raw);
  const lines = source.split("\n");
  const blocks: MarkdownBlock[] = [];
  const usedIds = new Map<string, number>();

  const getUniqueHeadingId = (text: string): string => {
    const base = slugifyHeading(text);
    const count = usedIds.get(base) ?? 0;
    usedIds.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Skip blank lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Fenced code block: ```lang ... ```
    const fenceMatch = trimmed.match(/^```([\w-]*)\s*$/);
    if (fenceMatch) {
      const language = fenceMatch[1] || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing ```
      blocks.push({
        type: "code-block",
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // 3. Horizontal rule: ---, ***, ___
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 4. Headings: # H1, ## H2, ### H3, #### H4
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+?)\s*#*$/);
    if (headingMatch) {
      const level = Math.min(4, Math.max(1, headingMatch[1].length)) as 1 | 2 | 3 | 4;
      const text = headingMatch[2].trim();
      blocks.push({
        type: "heading",
        level,
        text,
        id: getUniqueHeadingId(text),
      });
      i++;
      continue;
    }

    // 5. GitHub-Flavored Markdown Table
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1])
    ) {
      const parseTableRow = (rowLine: string): string[] => {
        const cleaned = rowLine.trim().replace(/^\|/, "").replace(/\|$/, "");
        return cleaned.split("|").map((cell) => cell.trim());
      };

      const headers = parseTableRow(trimmed);
      const separatorCells = parseTableRow(lines[i + 1]);
      const alignments: ("left" | "center" | "right")[] = separatorCells.map((cell) => {
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.endsWith(":")) return "right";
        return "left";
      });

      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes("|") && lines[i].trim() !== "") {
        rows.push(parseTableRow(lines[i]));
        i++;
      }

      blocks.push({
        type: "table",
        headers,
        alignments,
        rows,
      });
      continue;
    }

    // 6. Blockquote or Callout: > ...
    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }

      const firstLine = quoteLines[0] || "";
      const calloutMatch = firstLine.match(/^\[!(NOTE|IMPORTANT|TIP|WARNING|INSIGHT)\]\s*(.*)$/i);
      if (calloutMatch) {
        const kind = calloutMatch[1].toUpperCase() as CalloutKind;
        const title = calloutMatch[2]?.trim() || undefined;
        const bodyLines = quoteLines.slice(1).filter((l, idx, arr) => !(idx === 0 && !l.trim() && arr.length > 1));
        blocks.push({
          type: "callout",
          kind,
          title,
          lines: bodyLines.length > 0 ? bodyLines : title ? [title] : [],
        });
      } else {
        // Check if last line is an attribution like "— Author" or "-- Author"
        let attribution: string | undefined;
        let contentLines = quoteLines;
        if (quoteLines.length > 1) {
          const last = quoteLines[quoteLines.length - 1].trim();
          const attrMatch = last.match(/^(?:—|--|―)\s*(.+)$/);
          if (attrMatch) {
            attribution = attrMatch[1].trim();
            contentLines = quoteLines.slice(0, -1);
          }
        }
        blocks.push({
          type: "blockquote",
          lines: contentLines,
          attribution,
        });
      }
      continue;
    }

    // 7. Unordered list (including task lists): - item, * item, + item, • item
    if (/^(?:[-*+•])\s+/.test(trimmed)) {
      const items: ListItemNode[] = [];
      while (i < lines.length) {
        const currentRaw = lines[i];
        const currentTrim = currentRaw.trim();
        if (!currentTrim) break;

        // Indented sub-item
        if (/^\s{2,}(?:[-*+•]|\d+\.)\s+/.test(currentRaw) && items.length > 0) {
          const subText = currentTrim.replace(/^(?:[-*+•]|\d+\.)\s+/, "").trim();
          const parent = items[items.length - 1];
          parent.subItems = parent.subItems ? [...parent.subItems, subText] : [subText];
          i++;
          continue;
        }

        const ulMatch = currentTrim.match(/^(?:[-*+•])\s+(.*)$/);
        if (!ulMatch) break;

        const itemContent = ulMatch[1].trim();
        const taskMatch = itemContent.match(/^\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
          items.push({
            checked: taskMatch[1].toLowerCase() === "x",
            text: taskMatch[2].trim(),
          });
        } else {
          items.push({ text: itemContent });
        }
        i++;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    // 8. Ordered list: 1. item, 2) item
    const olStartMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (olStartMatch) {
      const start = parseInt(olStartMatch[1], 10) || 1;
      const items: ListItemNode[] = [];
      while (i < lines.length) {
        const currentRaw = lines[i];
        const currentTrim = currentRaw.trim();
        if (!currentTrim) break;

        if (/^\s{2,}(?:[-*+•]|\d+[.)])\s+/.test(currentRaw) && items.length > 0) {
          const subText = currentTrim.replace(/^(?:[-*+•]|\d+[.)])\s+/, "").trim();
          const parent = items[items.length - 1];
          parent.subItems = parent.subItems ? [...parent.subItems, subText] : [subText];
          i++;
          continue;
        }

        const olMatch = currentTrim.match(/^\d+[.)]\s+(.*)$/);
        if (!olMatch) break;
        items.push({ text: olMatch[1].trim() });
        i++;
      }
      blocks.push({ type: "ordered-list", items, start });
      continue;
    }

    // 9. Standard paragraph: collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length) {
      const pTrim = lines[i].trim();
      if (!pTrim) break;
      if (
        /^```/.test(pTrim) ||
        /^(?:-{3,}|\*{3,}|_{3,})$/.test(pTrim) ||
        /^(#{1,4})\s+/.test(pTrim) ||
        /^>\s?/.test(pTrim) ||
        /^(?:[-*+•])\s+/.test(pTrim) ||
        /^\d+[.)]\s+/.test(pTrim) ||
        (pTrim.includes("|") &&
          i + 1 < lines.length &&
          /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1]))
      ) {
        break;
      }
      paraLines.push(pTrim);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paraLines.join("\n"),
      });
    } else {
      i++;
    }
  }

  return blocks;
}

/**
 * Checks whether a plain-text string already contains explicit Markdown syntax.
 */
export function looksLikeMarkdown(text: string): boolean {
  const sample = text.trim();
  if (!sample) return false;
  return (
    /(?:^|\n)#{1,6}\s+\S/.test(sample) ||
    /\*\*[^*]+\*\*/.test(sample) ||
    /(?:^|\n)(?:[-*+]\s+|\d+\.\s+)/.test(sample) ||
    /(?:^|\n)>\s+/.test(sample) ||
    /```[\s\S]*```/.test(sample) ||
    /\[[^\]]+\]\([^)]+\)/.test(sample)
  );
}

/**
 * Converts pasted rich HTML (from Google Docs, Word, Notion, or web pages) into clean Markdown.
 * Safe to call in browser environments using DOMParser.
 */
export function convertHtmlToMarkdown(html: string): string {
  if (typeof window === "undefined" || !html.trim()) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove non-content elements
  doc.querySelectorAll("script, style, meta, link, head, svg, noscript").forEach((el) => el.remove());

  const serializeInline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || "").replace(/\s+/g, " ");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const style = el.getAttribute("style") || "";
    const childrenText = Array.from(el.childNodes).map(serializeInline).join("");

    if (!childrenText.trim() && tag !== "br" && tag !== "hr") return childrenText;

    if (tag === "br") return "\n";
    if (tag === "code" && el.parentElement?.tagName.toLowerCase() !== "pre") {
      return `\`${childrenText.trim()}\``;
    }

    const result = childrenText;
    const isBold =
      tag === "strong" ||
      tag === "b" ||
      /font-weight:\s*(bold|[6-9]00)/i.test(style);
    const isItalic =
      tag === "em" ||
      tag === "i" ||
      /font-style:\s*italic/i.test(style);
    const isUnderline =
      tag === "u" ||
      tag === "ins" ||
      /text-decoration(?:-line)?:\s*[^;]*underline/i.test(style);
    const isStrike =
      tag === "s" ||
      tag === "del" ||
      tag === "strike" ||
      /text-decoration(?:-line)?:\s*[^;]*line-through/i.test(style);
    const isMark = tag === "mark";
    const isSup = tag === "sup";
    const isSub = tag === "sub";

    if (tag === "a") {
      const href = el.getAttribute("href");
      if (href && !href.startsWith("javascript:")) {
        return `[${result.trim()}](${href})`;
      }
    }

    const leadingSpace = result.match(/^\s*/)?.[0] || "";
    const trailingSpace = result.match(/\s*$/)?.[0] || "";
    let core = result.trim();
    if (!core) return result;

    if (isSup) core = `<sup>${core}</sup>`;
    if (isSub) core = `<sub>${core}</sub>`;
    if (isMark) core = `==${core}==`;
    if (isStrike) core = `~~${core}~~`;
    if (isUnderline) core = `<u>${core}</u>`;
    if (isBold && isItalic) {
      core = `***${core}***`;
    } else if (isBold) {
      core = `**${core}**`;
    } else if (isItalic) {
      core = `*${core}*`;
    }

    return `${leadingSpace}${core}${trailingSpace}`;
  };

  const serializeBlock = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      return text;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case "h1":
        return `\n\n# ${serializeInline(el).trim()}\n\n`;
      case "h2":
        return `\n\n## ${serializeInline(el).trim()}\n\n`;
      case "h3":
        return `\n\n### ${serializeInline(el).trim()}\n\n`;
      case "h4":
      case "h5":
      case "h6":
        return `\n\n#### ${serializeInline(el).trim()}\n\n`;
      case "p": {
        const text = serializeInline(el).trim();
        return text ? `\n\n${text}\n\n` : "";
      }
      case "blockquote": {
        const inner = serializeInline(el)
          .trim()
          .split("\n")
          .map((l) => `> ${l.trim()}`)
          .join("\n");
        return inner ? `\n\n${inner}\n\n` : "";
      }
      case "pre": {
        const codeEl = el.querySelector("code");
        const rawCode = (codeEl ? codeEl.textContent : el.textContent) || "";
        return `\n\n\`\`\`\n${rawCode.replace(/\r\n/g, "\n").trim()}\n\`\`\`\n\n`;
      }
      case "ul": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li) => `- ${serializeInline(li).trim()}`)
          .filter((line) => line !== "-");
        return items.length ? `\n\n${items.join("\n")}\n\n` : "";
      }
      case "ol": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li, idx) => `${idx + 1}. ${serializeInline(li).trim()}`)
          .filter((line) => !/^\d+\.\s*$/.test(line));
        return items.length ? `\n\n${items.join("\n")}\n\n` : "";
      }
      case "hr":
        return `\n\n---\n\n`;
      case "table": {
        const rows = Array.from(el.querySelectorAll("tr")).map((tr) =>
          Array.from(tr.querySelectorAll("th, td")).map((cell) =>
            serializeInline(cell).trim().replace(/\|/g, "\\|")
          )
        );
        if (rows.length === 0) return "";
        const colCount = Math.max(...rows.map((r) => r.length));
        const padRow = (r: string[]) => {
          const copy = [...r];
          while (copy.length < colCount) copy.push("");
          return `| ${copy.join(" | ")} |`;
        };
        const headerLine = padRow(rows[0]);
        const dividerLine = `| ${Array(colCount).fill("---").join(" | ")} |`;
        const bodyLines = rows.slice(1).map(padRow);
        return `\n\n${[headerLine, dividerLine, ...bodyLines].join("\n")}\n\n`;
      }
      case "div":
      case "section":
      case "article":
      case "main":
      case "body": {
        const hasBlockChild = Array.from(el.children).some((c) =>
          /^(p|div|h[1-6]|ul|ol|blockquote|pre|table|hr|section|article)$/i.test(c.tagName)
        );
        if (hasBlockChild) {
          return Array.from(el.childNodes).map(serializeBlock).join("");
        }
        const inlineText = serializeInline(el).trim();
        return inlineText ? `\n\n${inlineText}\n\n` : "";
      }
      default:
        return serializeInline(el);
    }
  };

  const rawMarkdown = serializeBlock(doc.body);
  return normalizeMarkdown(rawMarkdown)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
