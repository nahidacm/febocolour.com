import { siteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organizationJsonLd(phone: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/febo-logo.png`,
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.youtube],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
    },
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  shortDescription?: string | null;
  sku: string;
  regularPrice: string;
  salePrice?: string | null;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  ratingAvg: string;
  ratingCount: number;
}) {
  const availability =
    product.stockStatus === "in_stock"
      ? "https://schema.org/InStock"
      : product.stockStatus === "backorder"
        ? "https://schema.org/BackOrder"
        : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    sku: product.sku,
    url: `${siteUrl}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.salePrice ?? product.regularPrice,
      availability,
      url: `${siteUrl}/product/${product.slug}`,
    },
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
