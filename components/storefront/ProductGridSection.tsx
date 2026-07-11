import Link from "next/link";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { ProductListItem } from "@/lib/services/catalog";

export function ProductGridSection({
  eyebrow,
  title,
  description,
  viewAllHref,
  products,
  tinted = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref: string;
  products: ProductListItem[];
  tinted?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section className={tinted ? "bg-brand-50/50" : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} className="text-left mx-0" />
          <Link
            href={viewAllHref}
            className="hidden shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:block"
          >
            View All &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
