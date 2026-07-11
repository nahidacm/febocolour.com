import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { FloatingContactButtons } from "@/components/storefront/FloatingContactButtons";
import { CartProvider } from "@/components/storefront/CartProvider";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </CartProvider>
  );
}
