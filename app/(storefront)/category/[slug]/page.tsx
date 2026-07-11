import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { ProductCard } from "@/components/storefront/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getCategoryBySlug, getProductsForCategory } from "@/lib/services/catalog";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return pageMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || undefined,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsForCategory(
    category.id,
    category.children.map((child) => child.id),
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(category.parent ? [{ label: category.parent.name, href: `/category/${category.parent.slug}` }] : []),
    { label: category.name },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 max-w-2xl text-sm text-foreground/60">{category.description}</p>
        ) : null}

        {category.children.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.slug}
                href={`/category/${child.slug}`}
                className="rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
              >
                {child.name}
              </Link>
            ))}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-foreground/60">
            No products in this category yet — check back soon.
          </p>
        )}
      </div>
    </>
  );
}
