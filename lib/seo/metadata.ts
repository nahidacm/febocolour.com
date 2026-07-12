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
  /** Omit entirely (leave undefined) when the route has its own opengraph-image.tsx —
   *  explicit `openGraph.images` here would take precedence over and hide that file
   *  convention. Pass a URL to override with a specific image, or nothing for the
   *  sitewide logo fallback. */
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const usesFileConventionImage = image === null;
  const images = usesFileConventionImage ? undefined : [image ?? "/febo-logo.png"];

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
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
