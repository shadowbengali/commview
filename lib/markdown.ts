// Tiny, dependency-free Markdown -> HTML renderer. Scope is deliberately narrow:
// just what the Brightfield practice files use (headings, paragraphs, bold,
// italic, inline code, links, unordered/ordered lists and GFM tables). It is not
// a general CommonMark engine; it renders our own trusted files for the inline
// "Preview" on the course resources page.
//
// All text is HTML-escaped before any inline formatting is applied, so file
// content can never inject markup.

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Inline: code first (so its content isn't re-parsed), then links, bold, italic.
function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, href) => {
    const safe = /^(https?:|mailto:|\/)/.test(href) ? href : "#";
    return `<a href="${safe}" rel="noopener">${t}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return out;
}

function renderTable(rows: string[]): string {
  const cells = (line: string) =>
    line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  const head = cells(rows[0]);
  const bodyRows = rows.slice(2); // row 1 is the --- separator
  const thead = `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${bodyRows
    .map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}

// headingOffset demotes every heading by N levels (capped at h6). The inline
// previews live under an <h3> step, so they pass 3 to keep the page to one <h1>
// and avoid heading-level jumps.
export function renderMarkdown(md: string, { headingOffset = 0 }: { headingOffset?: number } = {}): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  const isTableSep = (s: string) => /^\s*\|?[\s:-]*-[\s:|-]*$/.test(s) && s.includes("-");

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // blank
    if (!trimmed) { i++; continue; }

    // heading
    const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = Math.min(h[1].length + headingOffset, 6);
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // table: a | row immediately followed by a --- separator row
    if (trimmed.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const block: string[] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        block.push(lines[i]);
        i++;
      }
      html.push(renderTable(block));
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(inline(lines[i].replace(/^\s*>\s?/, "")));
        i++;
      }
      html.push(`<blockquote>${quote.join("<br/>")}</blockquote>`);
      continue;
    }

    // paragraph (gather consecutive non-blank, non-structural lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s/.test(lines[i].trim()) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) {
      para.push(inline(lines[i].trim()));
      i++;
    }
    html.push(`<p>${para.join(" ")}</p>`);
  }

  return html.join("\n");
}
