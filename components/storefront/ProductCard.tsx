import Link from "next/link";
import Image from "next/image";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import type { ProductListItem } from "@/lib/services/catalog";

export function ProductCard({
  product,
  headingLevel: Heading = "h3",
}: {
  product: ProductListItem;
  /** Homepage sections nest cards under an h2 section title, so h3 is correct there.
   *  Category/search pages have no intermediate heading, so pass "h2" to avoid skipping a level. */
  headingLevel?: "h2" | "h3";
}) {
  const displayPrice = product.salePrice ?? product.price;
  const outOfStock = product.stockStatus === "out_of_stock";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block w-full shrink-0 sm:w-auto"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-brand-lg">
        {product.image ? (
          <Image
            src={`/uploads/${product.image}`}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <PlaceholderImage className="h-full w-full transition-transform group-hover:scale-[1.02]" />
        )}
        {product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
            {product.badge}
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute top-3 right-3 rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
            Out of Stock
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <Heading className="text-sm font-medium text-foreground/90 group-hover:text-brand-700">
          {product.name}
        </Heading>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-700">
            &#2547;{displayPrice}
          </span>
          {product.salePrice ? (
            <span className="text-xs text-foreground/65 line-through">
              &#2547;{product.price}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
