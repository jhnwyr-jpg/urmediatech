import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
}

const SEOHead = ({
  title,
  description,
  keywords,
  canonical = "https://urmedia.tech",
  ogImage = "https://urmedia.tech/og-image.png",
  ogType = "website",
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title.includes("UR Media") ? title : `${title} | UR Media`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content="UR Media - Innovating Your Digital Presence" />
      <meta property="og:description" content="Explore our creative services and projects at urmedia.tech" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="UR Media - Digital Solutions and Creative Services" />
      <meta property="og:site_name" content="UR Media" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content="UR Media | Digital Solutions" />
      <meta name="twitter:description" content="Explore our creative services and projects at urmedia.tech" />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="UR Media - Digital Solutions and Creative Services" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
