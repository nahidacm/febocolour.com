import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { FloatingContactButtons } from "@/components/storefront/FloatingContactButtons";
import { CartProvider } from "@/components/storefront/CartProvider";
import { getSiteContactInfo } from "@/lib/services/settings";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getSiteContactInfo();

  return (
    <CartProvider>
      <Header phone={contact.phone} />
      <main className="flex-1">{children}</main>
      <Footer phone={contact.phone} />
      <FloatingContactButtons whatsappUrl={contact.whatsappUrl} messengerUrl={contact.messengerUrl} />
    </CartProvider>
  );
}
