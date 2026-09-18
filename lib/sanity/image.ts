import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a Sanity CDN image URL. Callers set width/height/format as needed.
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
