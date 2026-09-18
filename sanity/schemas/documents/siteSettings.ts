import { defineType } from "sanity";

// Singleton. Anything that would otherwise be hardcoded in two places lives
// here: nav, footer, social, default OG image, contact email, subscribe copy.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      initialValue: "COMMVIEW",
      readOnly: true,
      hidden: true,
    },
    {
      name: "navItems",
      title: "Navigation",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    },
    {
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
          ],
        },
      ],
    },
    {
      name: "socialUrls",
      title: "Social URLs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    },
    { name: "defaultOgImage", type: "image", title: "Default social image" },
    { name: "contactEmail", type: "string", title: "Contact email" },
    { name: "subscribeCopy", type: "text", title: "Subscribe copy" },
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
