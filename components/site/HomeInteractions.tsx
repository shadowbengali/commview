"use client";

import { useEffect } from "react";

// Ports the homepage's proven vanilla JS: the questions are already in the
// server-rendered HTML (crawlable); this only accents, animates and wires them.
// Behaviour is unchanged from reference/index.html; the additions are teardown
// so React's mount/unmount (and StrictMode's double-mount) stay idempotent.
export function HomeInteractions() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ---- Teleprompter -----------------------------------------------------
    const track = document.getElementById("tp-track");
    const live = document.getElementById("tp-live");
    const rail = document.getElementById("tp-rail");
    const counter = document.getElementById("tp-n");

    if (track && live && rail && counter) {
      const rows = Array.prototype.slice.call(track.children) as HTMLElement[];
      const originals = rows.map((r) => r.firstElementChild!.textContent || "");

      rows.forEach((row) => {
        const span = row.firstElementChild as HTMLElement;
        const parts = (span.textContent || "").split(" ");
        const tail = parts.pop();
        span.innerHTML = parts.join(" ") + " <em>" + tail + "</em>";
      });

      const clone = rows[0].cloneNode(true) as HTMLElement;
      track.appendChild(clone);
      const all = track.children;

      for (let t = 0; t < rows.length; t++) rail.appendChild(document.createElement("i"));
      const ticks = rail.children;

      let i = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const viewport = track.parentElement as HTMLElement;

      const place = (animate: boolean) => {
        const liveRow = all[i] as HTMLElement;
        const nextRow = (all[i + 1] || all[0]) as HTMLElement;
        track.style.transition = animate && !reduced.matches ? "" : "none";
        viewport.style.transition = animate && !reduced.matches ? "" : "none";
        track.style.transform = "translateY(" + -liveRow.offsetTop + "px)";
        const peek = Math.round(nextRow.offsetHeight * 0.52);
        viewport.style.height = liveRow.offsetHeight + peek + "px";
        viewport.style.setProperty("--fade-start", liveRow.offsetHeight + "px");
        for (let n = 0; n < all.length; n++) {
          all[n].setAttribute("data-live", n === i ? "true" : "false");
        }
        const idx = i % rows.length;
        for (let k = 0; k < ticks.length; k++) {
          if (k === idx) ticks[k].setAttribute("data-on", "");
          else ticks[k].removeAttribute("data-on");
        }
        counter.textContent = ("0" + (idx + 1)).slice(-2);
        live.textContent = rows[idx].textContent;
      };

      place(false);
      const onResize = () => place(false);
      window.addEventListener("resize", onResize);

      let pending: ReturnType<typeof setTimeout> | undefined;
      const timer = setInterval(() => {
        i += 1;
        place(true);
        if (i >= rows.length) {
          pending = setTimeout(() => {
            i = 0;
            place(false);
          }, 1250);
        }
      }, 5200);

      cleanups.push(() => {
        clearInterval(timer);
        if (pending) clearTimeout(pending);
        window.removeEventListener("resize", onResize);
        clone.remove();
        rail.innerHTML = "";
        rows.forEach((row, n) => {
          (row.firstElementChild as HTMLElement).textContent = originals[n];
          row.setAttribute("data-live", n === 0 ? "true" : "false");
        });
        track.style.transform = "";
        track.style.transition = "";
        viewport.style.height = "";
        viewport.style.transition = "";
      });
    }

    // ---- Capability panels: one open at a time ----------------------------
    const openers = Array.prototype.slice.call(
      document.querySelectorAll(".cap__open")
    ) as HTMLElement[];
    openers.forEach((btn) => {
      const handler = () => {
        const slug = btn.getAttribute("data-target");
        openers.forEach((other) => {
          const isMe = other === btn;
          other.setAttribute("aria-expanded", String(isMe));
          const p = document.getElementById("panel-" + other.getAttribute("data-target"));
          if (p) (p as HTMLElement).hidden = !isMe;
        });
        const panel = document.getElementById("panel-" + slug);
        if (panel && panel.getBoundingClientRect().top < 0) {
          panel.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    // ---- Connector wires: each symptom curves into the overlap ------------
    const wires = document.getElementById("wires");
    const core = document.getElementById("venn-core");
    if (wires && core) {
      const cards = Array.prototype.slice.call(
        document.querySelectorAll(".symptom")
      ) as HTMLElement[];
      const host = wires.parentElement as HTMLElement;

      const drawWires = () => {
        if (window.innerWidth < 1020) {
          wires.innerHTML = "";
          return;
        }
        const box = host.getBoundingClientRect();
        const target = core.getBoundingClientRect();
        const tx = target.left - box.left + target.width / 2;
        const ty = target.top - box.top;
        wires.setAttribute(
          "viewBox",
          "0 0 " + Math.round(box.width) + " " + Math.round(box.height)
        );
        let out = "";
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const x = r.left - box.left + r.width / 2;
          const y = r.bottom - box.top;
          const colour = getComputedStyle(card).getPropertyValue("--c").trim();
          const midY = y + (ty - y) * 0.55;
          out +=
            '<path d="M ' + x + " " + y + " C " + x + " " + midY + ", " + tx + " " + midY + ", " + tx + " " + (ty - 4) +
            '" fill="none" stroke="' + colour + '" stroke-width="1.5" stroke-opacity=".8" stroke-linecap="round"/>' +
            '<circle cx="' + x + '" cy="' + y + '" r="2.5" fill="' + colour + '"/>';
        });
        wires.innerHTML = out;
      };

      drawWires();
      window.addEventListener("resize", drawWires);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWires);
      cleanups.push(() => {
        window.removeEventListener("resize", drawWires);
        wires.innerHTML = "";
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
