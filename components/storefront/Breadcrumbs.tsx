import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-foreground/60">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRight className="h-3 w-3 text-foreground/30" /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/80" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
