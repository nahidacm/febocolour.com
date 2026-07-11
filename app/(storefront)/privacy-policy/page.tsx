import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How FeboColour collects, uses, and protects your information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>
        This Privacy Policy explains how FeboColour collects, uses, and protects your
        information when you shop with us.
      </p>
      <h2>Information We Collect</h2>
      <p>
        When you place an order, we collect your name, phone number, delivery address, and
        payment details necessary to fulfil that order. We never sell your information to third
        parties.
      </p>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your order</li>
        <li>To contact you about your order via phone, WhatsApp, or Messenger</li>
        <li>To improve our products and customer experience</li>
      </ul>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this policy, please reach out via our{" "}
        <a href="/contact" className="text-brand-700 underline">
          contact page
        </a>
        .
      </p>
    </StaticPageLayout>
  );
}
