import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import {
  ProductVariantSelector,
  type VariantAttribute,
  type VariantOption,
} from "@/components/storefront/ProductVariantSelector";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getProductBySlug } from "@/lib/services/catalog";
import { getSiteContactInfo } from "@/lib/services/settings";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return pageMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || undefined,
    path: `/product/${product.slug}`,
    // null (not undefined) — lets the route's opengraph-image.tsx file convention
    // supply the image, unless the admin explicitly set one.
    image: product.ogImage || null,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, contact] = await Promise.all([getProductBySlug(slug), getSiteContactInfo()]);
  if (!product) notFound();

  // Attribute values are global (shared across products), but only a subset applies to
  // any given product — the actual subset is whatever the product's variants use, not
  // every value the attribute has ever had across the whole catalog.
  const usedValuesByAttribute = new Map<number, Map<number, (typeof product.variants)[number]["variantValues"][number]["attributeValue"]>>();
  for (const variant of product.variants) {
    for (const vv of variant.variantValues) {
      const attrId = vv.attributeValue.attributeId;
      if (!usedValuesByAttribute.has(attrId)) usedValuesByAttribute.set(attrId, new Map());
      usedValuesByAttribute.get(attrId)!.set(vv.attributeValue.id, vv.attributeValue);
    }
  }

  const attributes: VariantAttribute[] = product.productAttributes
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((pa) => ({
      id: pa.attribute.id,
      name: pa.attribute.name,
      inputType: pa.attribute.inputType,
      values: [...(usedValuesByAttribute.get(pa.attribute.id)?.values() ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((v) => ({ id: v.id, value: v.value, slug: v.slug, swatchHex: v.swatchHex })),
    }));

  const variants: VariantOption[] = product.variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    priceOverride: variant.priceOverride ? Number(variant.priceOverride) : null,
    stockQuantity: variant.stockQuantity,
    stockStatus: variant.stockStatus,
    valueIds: variant.variantValues.map((vv) => vv.attributeValueId),
  }));

  const now = new Date();
  const onSale =
    !!product.salePrice &&
    (!product.saleStartsAt || now >= product.saleStartsAt) &&
    (!product.saleEndsAt || now <= product.saleEndsAt);

  const imageCount = Math.max(product.images.length, 1);
  const specEntries = product.specifications ? Object.entries(product.specifications) : [];
  const sizeChartEntries = product.sizeChart ? Object.entries(product.sizeChart) : [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(product.category?.parent
      ? [{ label: product.category.parent.name, href: `/category/${product.category.parent.slug}` }]
      : []),
    ...(product.category
      ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          sku: product.sku,
          regularPrice: product.regularPrice,
          salePrice: onSale ? product.salePrice : undefined,
          stockStatus: product.stockStatus,
          ratingAvg: product.ratingAvg,
          ratingCount: product.ratingCount,
        })}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-brand-xl">
              {product.images[0] ? (
                <Image
                  src={`/uploads/${product.images[0].storageKey}`}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage className="h-full w-full" iconClassName="h-12 w-12" />
              )}
            </div>
            {imageCount > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="relative aspect-square w-full overflow-hidden rounded-brand-md">
                    <Image
                      src={`/uploads/${image.storageKey}`}
                      alt={product.name}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {product.category ? (
              <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">
                {product.category.name}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2">
              {onSale ? (
                <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                  Sale
                </span>
              ) : null}
              {product.isBestSeller ? (
                <span className="rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                  Best Seller
                </span>
              ) : null}
              {product.isFeatured ? (
                <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                  Featured
                </span>
              ) : null}
            </div>

            {product.shortDescription ? (
              <p className="mt-4 text-sm text-foreground/70">{product.shortDescription}</p>
            ) : null}

            <div className="mt-6">
              <ProductVariantSelector
                productId={product.id}
                productName={product.name}
                attributes={attributes}
                variants={variants}
                basePrice={Number(product.regularPrice)}
                baseSalePrice={onSale && product.salePrice ? Number(product.salePrice) : undefined}
                baseSku={product.sku}
                baseStockStatus={product.stockStatus}
                whatsappUrl={contact.whatsappUrl}
                messengerUrl={contact.messengerUrl}
              />
            </div>

            <p className="mt-6 text-xs text-foreground/65">SKU: {product.sku}</p>
          </div>
        </div>

        {(product.description || specEntries.length > 0 || sizeChartEntries.length > 0) && (
          <div className="mt-14 grid gap-10 border-t border-brand-100 pt-10 lg:grid-cols-3">
            {product.description ? (
              <div className="lg:col-span-2">
                <h2 className="font-display text-lg font-semibold text-foreground">Description</h2>
                {/* product.description is sanitized (sanitize-html) at admin write time, never at render time */}
                <div
                  className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/70"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            ) : null}

            <div className="space-y-8">
              {specEntries.length > 0 ? (
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Specifications</h2>
                  <dl className="mt-3 divide-y divide-brand-100 text-sm">
                    {specEntries.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4 py-2">
                        <dt className="text-foreground/65">{key}</dt>
                        <dd className="text-right font-medium text-foreground/80">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {sizeChartEntries.length > 0 ? (
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Size Chart</h2>
                  <dl className="mt-3 divide-y divide-brand-100 text-sm">
                    {sizeChartEntries.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4 py-2">
                        <dt className="font-medium text-foreground/80">{key}</dt>
                        <dd className="text-right text-foreground/65">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
