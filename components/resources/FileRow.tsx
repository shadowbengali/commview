"use client";

import { useId, useState } from "react";

// One compact file row: type chip, name, one-line description, Download link,
// and — for Markdown files — a Preview toggle that expands the rendered content
// inline below the row. previewHtml is produced server-side by lib/markdown.ts
// from our own trusted practice files.
export function FileRow({
  chip,
  name,
  desc,
  href,
  previewHtml,
}: {
  chip: string;
  name: string;
  desc: string;
  href: string;
  previewHtml?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="file-row">
      <div className="file-row__main">
        <span className="file-row__chip" aria-hidden="true">{chip}</span>
        <span className="file-row__meta">
          <span className="file-row__name">{name}</span>
          <span className="file-row__desc">{desc}</span>
        </span>
        <span className="file-row__actions">
          {previewHtml ? (
            <button
              type="button"
              className="file-row__preview"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Hide preview" : "Preview"}
            </button>
          ) : null}
          <a className="file-row__dl" href={href} download>
            Download<span className="sr"> {name}</span>
          </a>
        </span>
      </div>
      {previewHtml ? (
        <div
          id={panelId}
          className="file-row__panel md"
          hidden={!open}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : null}
    </li>
  );
}
