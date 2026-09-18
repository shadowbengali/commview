import { CV_LOGO_SPRITE } from "./logoSpriteData";

// Injects the logo sprite once per document so <use href="#cv-logo"/> resolves
// everywhere. The sprite is a 0×0, position:absolute, aria-hidden SVG — no
// layout impact and nothing for assistive tech to read.
export function LogoSprite() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: CV_LOGO_SPRITE }}
    />
  );
}
