import { SectionHeading } from "@/components/storefront/SectionHeading";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";

export function PartnerSection() {
  return (
    <section className="bg-brand-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Trusted Partner" title="Our Official Hijab Partner" />
        <div className="mx-auto mt-8 max-w-xs">
          <PlaceholderImage className="aspect-video w-full rounded-brand-lg" />
        </div>
      </div>
    </section>
  );
}
