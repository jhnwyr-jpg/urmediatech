// JSON-LD Structured Data Helpers

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UR Media",
  url: "https://urmedia.tech",
  logo: "https://urmedia.tech/og-image.png",
  description: "Professional video editing agency delivering high-quality content for brands and creators.",
  sameAs: ["https://twitter.com/urmedia"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@urmedia.tech",
    availableLanguage: ["English", "Bengali"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UR Media",
  url: "https://urmedia.tech",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://urmedia.tech/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "UR Media",
  image: "https://urmedia.tech/og-image.png",
  url: "https://urmedia.tech",
  description: "Professional video editing and content creation agency",
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "150",
  },
  serviceType: ["Video Editing", "Motion Graphics", "Social Media Content", "Brand Videos"],
};

export const createServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  url: service.url,
  provider: {
    "@type": "Organization",
    name: "UR Media",
    url: "https://urmedia.tech",
  },
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  url: article.url,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  image: article.image || "https://urmedia.tech/og-image.png",
  author: {
    "@type": "Organization",
    name: "UR Media",
  },
  publisher: {
    "@type": "Organization",
    name: "UR Media",
    logo: {
      "@type": "ImageObject",
      url: "https://urmedia.tech/og-image.png",
    },
  },
});

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
