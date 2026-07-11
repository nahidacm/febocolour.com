import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Return Policy",
  description: "FeboColour's return and exchange policy for damaged, defective, or incorrect orders.",
  path: "/return-policy",
});

const faqs = [
  {
    question: "What if my item arrives damaged or different from what I ordered?",
    answer:
      "Message us on WhatsApp or Messenger within 3 days of delivery and we'll arrange an exchange or refund.",
  },
  {
    question: "Can I return an item because I changed my mind?",
    answer:
      "Unworn, unwashed items in original packaging can be returned within 3 days. Items that have been used or washed are not eligible.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <StaticPageLayout title="Return & Exchange Policy">
      <JsonLd data={faqJsonLd(faqs)} />
      <p>
        Your satisfaction matters to us. If there&apos;s an issue with your order, please reach
        out via WhatsApp or Messenger within 3 days of delivery.
      </p>
      <h2>Eligible for Return or Exchange</h2>
      <ul>
        <li>Item arrived damaged, defective, or different from what was ordered</li>
        <li>Item is unused, unwashed, and in its original packaging</li>
      </ul>
      <h2>Not Eligible</h2>
      <ul>
        <li>Change of mind after the item has been used or washed</li>
        <li>Items without proof of purchase (order number or receipt)</li>
      </ul>
      <p>
        Once your return is approved, we&apos;ll arrange an exchange or refund based on your
        original payment method.
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
