import type { Metadata } from "next";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoriesSlider } from "@/components/storefront/CategoriesSlider";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { WhyChooseUs } from "@/components/storefront/WhyChooseUs";
import { PartnerSection } from "@/components/storefront/PartnerSection";
import { ReviewsCarousel } from "@/components/storefront/ReviewsCarousel";
import { InstagramGallery } from "@/components/storefront/InstagramGallery";
import { getHomepageData } from "@/lib/services/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function HomePage() {
  const { banner, categories, bestSellers, newArrivals, featured } = await getHomepageData();

  return (
    <>
      <HeroBanner banner={banner ?? undefined} />
      <CategoriesSlider categories={categories} />
      <ProductGridSection
        eyebrow="Loved By Customers"
        title="Best Selling Products"
        viewAllHref="/search?filter=best-sellers"
        products={bestSellers}
      />
      <ProductGridSection
        eyebrow="Just In"
        title="New Arrivals"
        viewAllHref="/search?filter=new"
        products={newArrivals}
        tinted
      />
      <ProductGridSection
        eyebrow="Curated For You"
        title="Featured Collection"
        viewAllHref="/search?filter=featured"
        products={featured}
      />
      <WhyChooseUs />
      <PartnerSection />
      <ReviewsCarousel />
      <InstagramGallery />
    </>
  );
}
