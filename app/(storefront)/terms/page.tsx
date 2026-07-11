import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms and conditions for ordering from FeboColour.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms & Conditions">
      <p>By ordering from FeboColour, you agree to the following terms.</p>
      <h2>Orders</h2>
      <p>
        Orders are confirmed once we&apos;ve verified your details with you via phone, WhatsApp,
        or Messenger. Product availability and pricing are subject to change without notice.
      </p>
      <h2>Payment</h2>
      <p>
        We currently accept Cash on Delivery, bKash, Nagad, Rocket, and direct bank transfer.
        Payment instructions will be shared at checkout or by our team.
      </p>
      <h2>Product Accuracy</h2>
      <p>
        We do our best to display product colors and details accurately, but slight variations
        may occur due to screen settings and fabric dye lots.
      </p>
    </StaticPageLayout>
  );
}
