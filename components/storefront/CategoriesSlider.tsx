import Link from "next/link";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";

export function CategoriesSlider({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Shop by" title="Categories" />
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group flex w-36 shrink-0 snap-start flex-col items-center gap-3 sm:w-44"
          >
            <PlaceholderImage className="aspect-square w-full rounded-full transition-transform group-hover:scale-105" />
            <span className="text-sm font-medium text-foreground/80 group-hover:text-brand-700">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
