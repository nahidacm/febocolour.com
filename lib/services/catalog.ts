import { and, asc, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories, homepageBanners, products } from "@/lib/db/schema";

export type ProductBadge = "Sale" | "Best Seller" | "Featured" | "New";

export type ProductListItem = {
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  badge?: ProductBadge;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
};

function isOnSale(product: {
  salePrice: string | null;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
}): boolean {
  if (!product.salePrice) return false;
  const now = new Date();
  if (product.saleStartsAt && now < product.saleStartsAt) return false;
  if (product.saleEndsAt && now > product.saleEndsAt) return false;
  return true;
}

function computeBadge(product: {
  salePrice: string | null;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
  isBestSeller: boolean;
  isFeatured: boolean;
}): ProductBadge | undefined {
  if (isOnSale(product)) return "Sale";
  if (product.isBestSeller) return "Best Seller";
  if (product.isFeatured) return "Featured";
  return undefined;
}

export function toListItem(product: {
  slug: string;
  name: string;
  regularPrice: string;
  salePrice: string | null;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
  isBestSeller: boolean;
  isFeatured: boolean;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
}): ProductListItem {
  return {
    slug: product.slug,
    name: product.name,
    price: Number(product.regularPrice),
    salePrice: isOnSale(product) ? Number(product.salePrice) : undefined,
    badge: computeBadge(product),
    stockStatus: product.stockStatus,
  };
}

const activeProduct = eq(products.isActive, true);

export async function getTopLevelCategories() {
  return db.query.categories.findMany({
    where: and(isNull(categories.parentId), eq(categories.isActive, true)),
    orderBy: asc(categories.sortOrder),
  });
}

export async function getPrimaryBanner() {
  return db.query.homepageBanners.findFirst({
    where: eq(homepageBanners.isActive, true),
    orderBy: asc(homepageBanners.sortOrder),
  });
}

export async function getHomepageData() {
  const [banner, topCategories, bestSellerRows, newArrivalRows, featuredRows] = await Promise.all([
    getPrimaryBanner(),
    getTopLevelCategories(),
    db.query.products.findMany({
      where: and(activeProduct, eq(products.isBestSeller, true)),
      orderBy: desc(products.createdAt),
      limit: 8,
    }),
    db.query.products.findMany({
      where: activeProduct,
      orderBy: desc(products.createdAt),
      limit: 8,
    }),
    db.query.products.findMany({
      where: and(activeProduct, eq(products.isFeatured, true)),
      orderBy: desc(products.createdAt),
      limit: 8,
    }),
  ]);

  return {
    banner,
    categories: topCategories,
    bestSellers: bestSellerRows.map(toListItem),
    newArrivals: newArrivalRows.map((p) => ({ ...toListItem(p), badge: "New" as const })),
    featured: featuredRows.map(toListItem),
  };
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
    with: {
      parent: true,
      children: { where: eq(categories.isActive, true), orderBy: asc(categories.sortOrder) },
    },
  });
}

export async function getProductsForCategory(categoryId: number, childIds: number[] = []) {
  const categoryIds = [categoryId, ...childIds];
  const rows = await db.query.products.findMany({
    where: and(
      activeProduct,
      or(...categoryIds.map((id) => eq(products.categoryId, id))),
    ),
    orderBy: desc(products.createdAt),
  });
  return rows.map(toListItem);
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), activeProduct),
    with: {
      category: { with: { parent: true } },
      images: { orderBy: (image, { asc }) => asc(image.sortOrder) },
      videos: { orderBy: (video, { asc }) => asc(video.sortOrder) },
      productAttributes: {
        orderBy: (pa, { asc }) => asc(pa.sortOrder),
        with: { attribute: true },
      },
      variants: {
        where: (variant, { eq }) => eq(variant.isActive, true),
        with: { variantValues: { with: { attributeValue: true } } },
      },
    },
  });
}

export type ProductFilter = "best-sellers" | "new" | "featured";

export async function browseProducts({
  q,
  filter,
}: {
  q?: string;
  filter?: ProductFilter;
}): Promise<ProductListItem[]> {
  const trimmed = q?.trim();
  const conditions = [activeProduct];
  if (trimmed) conditions.push(ilike(products.name, `%${trimmed}%`));
  if (filter === "best-sellers") conditions.push(eq(products.isBestSeller, true));
  if (filter === "featured") conditions.push(eq(products.isFeatured, true));

  const rows = await db.query.products.findMany({
    where: and(...conditions),
    orderBy: desc(products.createdAt),
    limit: 48,
  });

  const badgeOverride = filter === "new" ? ("New" as const) : undefined;
  return rows.map((p) => {
    const item = toListItem(p);
    return badgeOverride ? { ...item, badge: badgeOverride } : item;
  });
}
