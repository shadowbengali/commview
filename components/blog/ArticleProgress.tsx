"use client";

import { useEffect } from "react";

// Ported from reference/article.html: drives the two reading-progress bars,
// highlights the active TOC entry, and wires the copy-link button. Added
// listener teardown so it is React-mount safe.
export function ArticleProgress() {
  useEffect(() => {
    const bars = [
      document.getElementById("prog"),
      document.getElementById("prog2"),
    ].filter(Boolean) as HTMLElement[];
    const article = document.querySelector(".prose");
    const links = Array.prototype.slice.call(
      document.querySelectorAll("#toc a")
    ) as HTMLAnchorElement[];
    const heads = links.map((a) =>
      document.getElementById((a.getAttribute("href") || "#").slice(1))
    );

    const tick = () => {
      if (article) {
        const box = article.getBoundingClientRect();
        const total = box.height - window.innerHeight;
        const done =
          total > 0
            ? Math.min(1, Math.max(0, -box.top / total))
            : box.top < 0
              ? 1
              : 0;
        bars.forEach((b) => (b.style.width = (done * 100).toFixed(2) + "%"));
      }
      let active = -1;
      heads.forEach((h, i) => {
        if (h && h.getBoundingClientRect().top < 140) active = i;
      });
      links.forEach((a, i) => {
        if (i === active) a.setAttribute("data-on", "");
        else a.removeAttribute("data-on");
      });
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);

    const copyHandlers: Array<[HTMLElement, () => void]> = [];
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      const el = btn as HTMLElement;
      const handler = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
        const old = el.getAttribute("aria-label");
        el.setAttribute("aria-label", "Link copied");
        setTimeout(() => old && el.setAttribute("aria-label", old), 1600);
      };
      el.addEventListener("click", handler);
      copyHandlers.push([el, handler]);
    });

    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      copyHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
    };
  }, []);

  return null;
}
