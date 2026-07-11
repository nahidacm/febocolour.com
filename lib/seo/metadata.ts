import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Next.js does NOT deep-merge `openGraph`/`twitter` between a layout and a page —
 * a page-level `openGraph` object fully replaces the layout's (dropping siteName,
 * locale, fallback image, etc.). Every page should build its metadata through this
 * helper instead of writing its own `openGraph`/`twitter` object by hand.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const images = [image ?? "/febo-logo.png"];

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
