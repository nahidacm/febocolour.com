import Link from "next/link";
import { Star } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { ReviewActions } from "@/components/admin/reviews/ReviewActions";
import { listReviewsForAdmin } from "@/lib/services/admin/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const items = await listReviewsForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Reviews ({items.length})</h1>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Author</Th>
              <Th>Rating</Th>
              <Th>Review</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((review) => (
              <tr key={review.id}>
                <Td>
                  <Link href={`/product/${review.product.slug}`} className="hover:text-brand-700">
                    {review.product.name}
                  </Link>
                </Td>
                <Td>{review.customer?.fullName ?? review.guestName ?? "Guest"}</Td>
                <Td>
                  <span className="flex items-center gap-0.5 text-brand-600">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                </Td>
                <Td className="max-w-xs">
                  {review.title ? <p className="font-medium text-foreground/90">{review.title}</p> : null}
                  <p className="text-foreground/60">{review.body}</p>
                </Td>
                <Td>
                  <span
                    className={
                      review.isApproved
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                    }
                  >
                    {review.isApproved ? "Approved" : "Pending"}
                  </span>
                </Td>
                <Td>
                  <ReviewActions id={review.id} isApproved={review.isApproved} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {items.length === 0 ? <p className="mt-4 text-sm text-foreground/60">No reviews yet.</p> : null}
      </div>
    </div>
  );
}
