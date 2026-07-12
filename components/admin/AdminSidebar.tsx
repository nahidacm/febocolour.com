"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  FolderTree,
  Boxes,
  ClipboardList,
  Users,
  Star,
  Image as ImageIcon,
  Truck,
  CreditCard,
  Share2,
  Settings,
  FileClock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { adminLogoutAction } from "@/lib/actions/admin-auth";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/attributes", label: "Attributes", icon: Tags },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Storefront",
    items: [
      { href: "/admin/banners", label: "Homepage Banners", icon: ImageIcon },
      { href: "/admin/shipping", label: "Shipping", icon: Truck },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/social-links", label: "Social Links", icon: Share2 },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
    ],
  },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-brand-100 bg-white">
      <div className="border-b border-brand-100 px-5 py-4">
        <span className="font-display text-lg font-semibold text-brand-700">
          FeboColour
        </span>
        <span className="ml-1.5 text-xs text-foreground/70">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, i) => (
          <div key={i} className={i > 0 ? "mt-5" : undefined}>
            {group.label ? (
              <p className="px-2 text-[10px] font-semibold tracking-wider text-foreground/70 uppercase">
                {group.label}
              </p>
            ) : null}
            <div className="mt-1.5 space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-brand-sm px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-foreground/70 hover:bg-brand-50/60 hover:text-brand-700",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-brand-100 p-3">
        <p className="truncate px-2 text-xs text-foreground/70">{adminName}</p>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2.5 rounded-brand-sm px-2.5 py-2 text-sm font-medium text-foreground/70 hover:bg-brand-50/60 hover:text-brand-700"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
