import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description: "Learn about FeboColour — hijabs and abayas for women and girls of all ages, with a dedicated baby girl collection.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPageLayout title="About FeboColour">
      <p>
        FeboColour is an online hijab & abaya store for women and girls of all ages, with a
        special collection designed just for baby girls. We believe modest wear should feel
        soft, comfortable and beautifully made — without being difficult to find or expensive.
      </p>
      <p>
        Every piece in our collection is chosen for quality fabric, careful stitching and a
        premium look at an honest price. We ship across Bangladesh and love hearing from our
        customers on Facebook and WhatsApp.
      </p>
    </StaticPageLayout>
  );
}
