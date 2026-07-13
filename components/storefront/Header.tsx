import Link from "next/link";
import Image from "next/image";
import { Phone, Search } from "lucide-react";
import { MobileNav } from "@/components/storefront/MobileNav";
import { CartMenu } from "@/components/storefront/CartMenu";
import { navLinks } from "@/lib/nav-links";

export function Header({ phone }: { phone: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center" aria-label="FeboColour home">
            <Image
              src="/febo-logo.png"
              alt="FeboColour — Hijab & Abaya"
              width={160}
              height={60}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={`tel:${phone}`}
            className="hidden items-center gap-2 rounded-brand-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-50 hover:text-brand-700 md:flex"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-brand-md text-foreground/80 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <Search className="h-5 w-5" />
          </Link>
          <CartMenu />
        </div>
      </div>
    </header>
  );
}
