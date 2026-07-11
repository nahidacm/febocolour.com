import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Shipping Policy",
  description: "Delivery options and timelines for FeboColour orders — inside city, outside city, and store pickup.",
  path: "/shipping-policy",
});

const faqs = [
  {
    question: "How long does delivery take inside the city?",
    answer: "Orders within the city are typically delivered within 1–3 business days of dispatch.",
  },
  {
    question: "How long does delivery take outside the city?",
    answer: "Nationwide delivery outside the city usually takes 3–5 business days of dispatch.",
  },
  {
    question: "Can I pick up my order instead of having it delivered?",
    answer: "Yes — choose Store Pickup at checkout and we'll confirm a pickup time with you after you order.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <StaticPageLayout title="Shipping Policy">
      <JsonLd data={faqJsonLd(faqs)} />
      <p>We currently offer the following delivery options:</p>
      <h2>Inside City</h2>
      <p>Orders within the city are typically delivered within 1–3 business days of dispatch.</p>
      <h2>Outside City</h2>
      <p>Nationwide delivery outside the city usually takes 3–5 business days of dispatch.</p>
      <h2>Store Pickup</h2>
      <p>You may also choose to collect your order in person — we&apos;ll confirm a pickup time with you after you order.</p>
      <p>
        Delivery timelines are estimates and may vary based on courier availability and your
        location. You&apos;ll receive order updates via phone, WhatsApp or Messenger.
      </p>

      <h2>Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <p className="font-medium text-foreground">{faq.question}</p>
            <p className="mt-1">{faq.answer}</p>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}
