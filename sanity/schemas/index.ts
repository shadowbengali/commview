import type { SchemaTypeDefinition } from "sanity";

import { post } from "./documents/post";
import { category, tag } from "./documents/taxonomy";
import { author } from "./documents/author";
import { page } from "./documents/page";
import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import { figure, callout, codeBlock, postReference } from "./objects/figure";
import { seo, faq } from "./objects/shared";
import { contentSection } from "./objects/sections";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  post,
  category,
  tag,
  author,
  page,
  siteSettings,
  // Objects
  blockContent,
  figure,
  callout,
  codeBlock,
  postReference,
  seo,
  faq,
  contentSection,
];
