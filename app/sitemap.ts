import type { MetadataRoute } from "next";
import { db } from "@/lib/db/client";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/shipping-policy",
  "/return-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activeCategories, activeProducts] = await Promise.all([
    db.query.categories.findMany({
      where: eq(categories.isActive, true),
      columns: { slug: true, updatedAt: true },
    }),
    db.query.products.findMany({
      where: eq(products.isActive, true),
      columns: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...activeCategories.map((category) => ({
      url: `${siteUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
    })),
    ...activeProducts.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
