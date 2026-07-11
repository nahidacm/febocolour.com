import { Search } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { browseProducts, type ProductFilter } from "@/lib/services/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Search Products",
  path: "/search",
  noIndex: true,
});

const filterLabels: Record<ProductFilter, string> = {
  "best-sellers": "Best Selling Products",
  new: "New Arrivals",
  featured: "Featured Collection",
};

type PageProps = {
  searchParams: Promise<{ q?: string; filter?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, filter } = await searchParams;
  const validFilter = filter && filter in filterLabels ? (filter as ProductFilter) : undefined;

  const products = await browseProducts({ q, filter: validFilter });

  const heading = q
    ? `Search results for "${q}"`
    : validFilter
      ? filterLabels[validFilter]
      : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <form action="/search" method="GET" className="mx-auto max-w-xl">
        <div className="flex items-center gap-2 rounded-brand-lg border border-brand-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-400">
          <Search className="h-4 w-4 shrink-0 text-foreground/40" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search for hijabs, abayas..."
            className="w-full text-sm outline-none placeholder:text-foreground/40"
          />
        </div>
      </form>

      <h1 className="mt-8 font-display text-2xl font-semibold text-foreground sm:text-3xl">
        {heading}
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        {products.length} {products.length === 1 ? "product" : "products"} found
      </p>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-foreground/60">
          No products found. Try a different search term.
        </p>
      )}
    </div>
  );
}
