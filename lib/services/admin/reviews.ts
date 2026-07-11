import { and, avg, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products, reviews } from "@/lib/db/schema";

export async function listReviewsForAdmin() {
  return db.query.reviews.findMany({
    orderBy: desc(reviews.createdAt),
    with: { product: { columns: { name: true, slug: true } }, customer: { columns: { fullName: true } } },
  });
}

async function recomputeProductRating(productId: number) {
  const [stats] = await db
    .select({ avgRating: avg(reviews.rating), reviewCount: count(reviews.id) })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));

  await db
    .update(products)
    .set({
      ratingAvg: stats.avgRating ? Number(stats.avgRating).toFixed(1) : "0",
      ratingCount: stats.reviewCount,
    })
    .where(eq(products.id, productId));
}

export async function setReviewApproval(id: number, isApproved: boolean) {
  const [review] = await db
    .update(reviews)
    .set({ isApproved, updatedAt: new Date() })
    .where(eq(reviews.id, id))
    .returning();
  if (review) await recomputeProductRating(review.productId);
}

export async function deleteReview(id: number) {
  const [review] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
  if (review) await recomputeProductRating(review.productId);
}
