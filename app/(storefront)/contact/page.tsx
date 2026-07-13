import { Mail, MessageCircle, Phone } from "lucide-react";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { getSiteContactInfo } from "@/lib/services/settings";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "Reach FeboColour via WhatsApp, Facebook Messenger, phone, or email.",
  path: "/contact",
});

export const revalidate = 300;

export default async function ContactPage() {
  const contact = await getSiteContactInfo();

  return (
    <StaticPageLayout title="Contact Us">
      <p>
        The fastest way to reach us is WhatsApp or Facebook Messenger — we usually reply within
        minutes during business hours.
      </p>
      <ul className="!list-none space-y-3 !pl-0">
        <li>
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-brand-700 hover:text-brand-800"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </li>
        <li>
          <a
            href={contact.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-brand-700 hover:text-brand-800"
          >
            <MessageCircle className="h-4 w-4" /> Facebook Messenger
          </a>
        </li>
        <li>
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 font-medium text-brand-700 hover:text-brand-800">
            <Phone className="h-4 w-4" /> {contact.phone}
          </a>
        </li>
        <li>
          <a href="mailto:hello@febocolour.com" className="flex items-center gap-2 font-medium text-brand-700 hover:text-brand-800">
            <Mail className="h-4 w-4" /> hello@febocolour.com
          </a>
        </li>
      </ul>
    </StaticPageLayout>
  );
}
