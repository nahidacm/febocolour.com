import { SectionHeading } from "@/components/storefront/SectionHeading";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { siteConfig } from "@/lib/site-config";

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Follow Along"
        title="@febocolour on Instagram"
      />
      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderImage key={i} className="aspect-square w-full rounded-brand-md" />
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <InstagramIcon className="h-4 w-4" />
          Follow @febocolour
        </a>
      </div>
    </section>
  );
}
