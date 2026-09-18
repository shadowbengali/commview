// Homepage JSON-LD (@graph), extracted verbatim from reference/index.html.
export const HOME_JSON_LD = String.raw`
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "Organization",
        "ProfessionalService"
      ],
      "@id": "https://commview.co.uk/#organisation",
      "name": "COMMVIEW",
      "url": "https://commview.co.uk/",
      "email": "hello@commview.co.uk",
      "slogan": "From Insight to Impact.",
      "description": "Operator-led B2B consultancy for scale-ups: GTM leadership, growth, product and operational AI.",
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Manchester",
        "addressCountry": "GB"
      },
      "knowsAbout": [
        "B2B go-to-market strategy",
        "Demand generation",
        "Product management",
        "Operational AI",
        "SEO and AEO",
        "Pipeline and sales hand-off",
        "Positioning and ICP"
      ],
      "makesOffer": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "GTM Leadership",
            "@id": "https://commview.co.uk/#gtm-leadership"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Growth",
            "@id": "https://commview.co.uk/#growth"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Product",
            "@id": "https://commview.co.uk/#product"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Operational AI",
            "@id": "https://commview.co.uk/#operational-ai"
          }
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://commview.co.uk/#website",
      "url": "https://commview.co.uk/",
      "name": "COMMVIEW",
      "publisher": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "inLanguage": "en-GB"
    },
    {
      "@type": "WebPage",
      "@id": "https://commview.co.uk/#webpage",
      "url": "https://commview.co.uk/",
      "name": "B2B specialists for scale-ups",
      "isPartOf": {
        "@id": "https://commview.co.uk/#website"
      },
      "about": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "description": "You bring the question. We find the answer. Then we help you do something about it.",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [
          ".hero__h1",
          ".tp__q[data-live='true']",
          ".pivot"
        ]
      },
      "significantLink": [
        "https://commview.co.uk/#diagnostic",
        "https://commview.co.uk/#what-we-do"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://commview.co.uk/#gtm-leadership",
      "serviceType": "GTM Leadership",
      "provider": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "description": "Positioning. ICP. Routes to market. Demand generation. Pipeline. Sales hand-off. Operating rhythm."
    },
    {
      "@type": "Service",
      "@id": "https://commview.co.uk/#growth",
      "serviceType": "Growth",
      "provider": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "description": "SEO. AEO/GEO. Paid. Content. Websites. Conversion. Email. CRM. Automation. Analytics."
    },
    {
      "@type": "Service",
      "@id": "https://commview.co.uk/#product",
      "serviceType": "Product",
      "provider": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "description": "Customer problem. Product strategy. Prioritisation. Requirements. User journeys. Launch."
    },
    {
      "@type": "Service",
      "@id": "https://commview.co.uk/#operational-ai",
      "serviceType": "Operational AI",
      "provider": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "description": "Content. Translation. Reporting. Lead scoring. Sales intelligence. Workflow automation."
    },
    {
      "@type": "Quiz",
      "@id": "https://commview.co.uk/#diagnostic",
      "name": "Commview Business Diagnostic",
      "about": {
        "@id": "https://commview.co.uk/#organisation"
      },
      "educationalLevel": "professional",
      "description": "A five-minute assessment that looks for patterns across GTM Leadership, Growth, Product and Operational AI, and returns strengths, weaknesses, blind spots and first moves.",
      "timeRequired": "PT5M",
      "isAccessibleForFree": true
    }
  ]
}
`;
