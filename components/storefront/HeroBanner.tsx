import Link from "next/link";
import Image from "next/image";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";

export type HeroBannerData = {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
};

const fallback: HeroBannerData = {
  title: "Elegant Hijabs & Abayas, for Every Age",
  subtitle:
    "Premium, comfortable and beautifully soft — including a dedicated collection for baby girls. Order easily, we deliver across Bangladesh.",
  ctaLabel: "Shop Now",
  ctaUrl: "/category/hijab",
  secondaryCtaLabel: "Baby Girl Collection",
  secondaryCtaUrl: "/category/baby-girl-hijab",
};

export function HeroBanner({ banner = fallback }: { banner?: HeroBannerData }) {
  return (
    <section className="bg-brand-50/50">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">
            New Season Collection
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {banner.title}
          </h1>
          {banner.subtitle ? (
            <p className="mt-4 text-base text-foreground/70 sm:text-lg">{banner.subtitle}</p>
          ) : null}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            {banner.ctaLabel && banner.ctaUrl ? (
              <Link
                href={banner.ctaUrl}
                className="rounded-brand-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
              >
                {banner.ctaLabel}
              </Link>
            ) : null}
            {banner.secondaryCtaLabel && banner.secondaryCtaUrl ? (
              <Link
                href={banner.secondaryCtaUrl}
                className="rounded-brand-lg border border-brand-200 bg-white px-8 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {banner.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
        {banner.image ? (
          <div className="relative order-1 aspect-4/3 w-full overflow-hidden rounded-brand-xl lg:order-2">
            <Image
              src={`/uploads/${banner.image}`}
              alt={banner.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderImage
            className="order-1 aspect-4/3 w-full rounded-brand-xl lg:order-2"
            iconClassName="h-12 w-12"
          />
        )}
      </div>
    </section>
  );
}
