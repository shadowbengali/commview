import "../../styles/not-found.css";

// 404 for everything under the site group. Because it lives inside (site), it
// renders within that layout — so the header and footer come for free. The four
// capabilities give a lost visitor an obvious next step.

const CAPABILITIES = [
  { label: "GTM Leadership", href: "/gtm-leadership", c: "var(--brand-cyan)" },
  { label: "Growth", href: "/growth", c: "var(--accent-green)" },
  { label: "Product", href: "/product-strategy", c: "var(--accent-blue)" },
  { label: "Operational AI", href: "/ai-consulting", c: "var(--accent-pink)" },
];

export default function NotFound() {
  return (
    <main id="main" className="nf">
      <div className="wrap nf__wrap">
        <p className="nf__eyebrow">Error 404</p>
        <h1 className="nf__h1">We can&rsquo;t find that page.</h1>
        <p className="nf__p">
          It may have moved, or the link may be wrong. Here&rsquo;s where most people are headed:
        </p>

        <ul className="nf__caps">
          {CAPABILITIES.map((c) => (
            <li key={c.href} style={{ ["--c" as string]: c.c }}>
              <a className="nf__cap" href={c.href}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>

        <a className="btn btn--cyan btn--lg" href="/">
          Back to homepage
        </a>
      </div>
    </main>
  );
}
