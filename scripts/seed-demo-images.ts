/**
 * One-off dev/demo script — downloads free-license stock photos (Unsplash) and wires
 * them into the local catalog exactly like an admin upload would (same storage key
 * convention, same product_images/categories/homepage_banners rows). NOT part of the
 * regular seed.ts flow and NOT meant for production content — these are placeholders
 * to make the storefront look realistic during local development, not real product
 * photography FeboColour has the rights to sell with.
 *
 * Run: npx tsx scripts/seed-demo-images.ts
 */
import "@/scripts/load-env";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories, homepageBanners, productImages, products } from "@/lib/db/schema";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

async function downloadAndSave(url: string, folder: string, square: boolean): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  const raw = Buffer.from(await res.arrayBuffer());

  const processed = square
    ? await sharp(raw).resize(1200, 1200, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer()
    : await sharp(raw).resize(1920, 800, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();

  const key = `${folder}/${randomBytes(16).toString("hex")}.jpg`;
  const destPath = path.join(UPLOADS_ROOT, key);
  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, processed);
  return key;
}

function unsplashUrl(photoId: string, w: number, h: number): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

// productSlug -> unsplash photo id (as returned by their search API, e.g. "photo-xxxx" or "premium_photo-xxxx")
const PRODUCT_PHOTOS: Record<string, string> = {
  "premium-chiffon-hijab": "photo-1585728748176-455ac5eed962",
  "jersey-hijab": "photo-1613611927458-3ddd4b0afdb9",
  "instant-hijab-2pc": "photo-1640154852340-9de73a0643a8",
  "classic-abaya": "photo-1760083545495-b297b1690672",
  "embroidered-abaya": "photo-1772474500365-c2c520545f44",
  "baby-instant-hijab-set": "photo-1623743360501-ff21ea5e30d7",
  "baby-girl-hijab-gift-set": "photo-1770273329575-a3787c550881",
  "kids-hijab-cap-combo": "photo-1770273329614-b05d62838b62",
  "satin-hijab-pearl": "photo-1552874869-5c39ec9288dc",
  "cotton-hijab-set-3pack": "photo-1574297500578-afae55026ff3",
  "hijab-magnet-pins": "photo-1553380155-4edde5ff4576",
};

// categorySlug -> unsplash photo id (reuses the closest matching product photo's theme)
const CATEGORY_PHOTOS: Record<string, string> = {
  hijab: "photo-1585728748176-455ac5eed962",
  abaya: "photo-1760083545495-b297b1690672",
  "baby-girl-hijab": "photo-1623743360501-ff21ea5e30d7",
  accessories: "photo-1553380155-4edde5ff4576",
  "instant-hijab": "photo-1640154852340-9de73a0643a8",
  "chiffon-hijab": "photo-1585728748176-455ac5eed962",
  "jersey-hijab": "photo-1613611927458-3ddd4b0afdb9",
  "classic-abaya": "photo-1760083545495-b297b1690672",
  "embroidered-abaya": "photo-1772474500365-c2c520545f44",
  "baby-instant-hijab": "photo-1623743360501-ff21ea5e30d7",
  "baby-hijab-sets": "photo-1770273329575-a3787c550881",
};

const BANNER_PHOTO = "photo-1736342182213-6c037467cb38";

async function main() {
  console.log("Seeding demo images (Unsplash, free-license placeholders)...\n");

  for (const [slug, photoId] of Object.entries(PRODUCT_PHOTOS)) {
    const product = await db.query.products.findFirst({ where: eq(products.slug, slug) });
    if (!product) {
      console.log(`  skip (no product): ${slug}`);
      continue;
    }
    const existing = await db.query.productImages.findFirst({ where: eq(productImages.productId, product.id) });
    if (existing) {
      console.log(`  skip (already has images): ${slug}`);
      continue;
    }

    const key = await downloadAndSave(
      unsplashUrl(photoId, 1200, 1200),
      `products/${product.id}`,
      true,
    );
    await db.insert(productImages).values({
      productId: product.id,
      storageKey: key,
      isPrimary: true,
      sortOrder: 0,
    });
    console.log(`  product: ${slug} -> ${key}`);
  }

  for (const [slug, photoId] of Object.entries(CATEGORY_PHOTOS)) {
    const category = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
    if (!category) {
      console.log(`  skip (no category): ${slug}`);
      continue;
    }
    if (category.image) {
      console.log(`  skip (already has image): ${slug}`);
      continue;
    }

    const key = await downloadAndSave(unsplashUrl(photoId, 800, 800), "categories", true);
    await db.update(categories).set({ image: key }).where(eq(categories.id, category.id));
    console.log(`  category: ${slug} -> ${key}`);
  }

  const banner = await db.query.homepageBanners.findFirst();
  if (banner && !banner.image) {
    const key = await downloadAndSave(unsplashUrl(BANNER_PHOTO, 1920, 800), "banners", false);
    await db.update(homepageBanners).set({ image: key }).where(eq(homepageBanners.id, banner.id));
    console.log(`  banner -> ${key}`);
  } else {
    console.log("  skip banner (none found or already has image)");
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
