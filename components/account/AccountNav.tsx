"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { customerLogoutAction } from "@/lib/actions/customer-auth";

const links = [
  { href: "/account", label: "Overview", exact: true },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Profile" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-brand-sm px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-brand-50 text-brand-700" : "text-foreground/70 hover:bg-brand-50/60",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <form action={customerLogoutAction}>
        <button
          type="submit"
          className="block w-full rounded-brand-sm px-3 py-2 text-left text-sm font-medium text-foreground/70 hover:bg-brand-50/60"
        >
          Log Out
        </button>
      </form>
    </nav>
  );
}
