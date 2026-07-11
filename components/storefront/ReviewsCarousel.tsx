import { Star } from "lucide-react";
import { SectionHeading } from "@/components/storefront/SectionHeading";

const reviews = [
  {
    name: "Sumaiya R.",
    rating: 5,
    quote: "The baby girl hijab set is adorable and so soft. Fast delivery too!",
  },
  {
    name: "Nusrat J.",
    rating: 5,
    quote: "Beautiful fabric quality, exactly like the pictures on Facebook.",
  },
  {
    name: "Farzana A.",
    rating: 5,
    quote: "Ordered via WhatsApp, they replied instantly and the abaya fits perfectly.",
  },
];

export function ReviewsCarousel() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />
      <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {reviews.map((review) => (
          <figure
            key={review.name}
            className="w-72 shrink-0 snap-start rounded-brand-lg border border-brand-100 bg-white p-6 shadow-sm"
          >
            <div className="flex gap-0.5 text-brand-500">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm text-foreground/70">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-foreground">
              {review.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
