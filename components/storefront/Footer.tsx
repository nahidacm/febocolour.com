import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { navLinks } from "@/lib/nav-links";
import { siteConfig } from "@/lib/site-config";

const policyLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-policy", label: "Return Policy" },
];

export function Footer({ phone }: { phone: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-brand-50/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="font-display text-sm font-semibold tracking-wide text-brand-800 uppercase">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold tracking-wide text-brand-800 uppercase">
              Categories
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/category/hijab" className="text-sm text-foreground/70 hover:text-brand-700">
                  Hijab
                </Link>
              </li>
              <li>
                <Link href="/category/abaya" className="text-sm text-foreground/70 hover:text-brand-700">
                  Abaya
                </Link>
              </li>
              <li>
                <Link
                  href="/category/baby-girl-hijab"
                  className="text-sm text-foreground/70 hover:text-brand-700"
                >
                  Baby Girl Hijab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold tracking-wide text-brand-800 uppercase">
              Contact
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-brand-700"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@febocolour.com"
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-brand-700"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  hello@febocolour.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold tracking-wide text-brand-800 uppercase">
              Follow Us
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm transition-colors hover:bg-brand-100"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm transition-colors hover:bg-brand-100"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm transition-colors hover:bg-brand-100"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-brand-100 pt-6 sm:flex-row sm:justify-between">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-foreground/60 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground/60">
            &copy; {year} FeboColour. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
