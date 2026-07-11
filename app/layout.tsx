import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FeboColour — Hijab & Abaya for Every Age",
    template: "%s | FeboColour",
  },
  description:
    "FeboColour is an online hijab & abaya store for women and girls of all ages, with a special collection for baby girls. Easy ordering, fast delivery across Bangladesh.",
  openGraph: {
    type: "website",
    siteName: "FeboColour",
    locale: "en_US",
    images: ["/febo-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/febo-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
