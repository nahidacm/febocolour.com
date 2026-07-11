import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";

export function StaticPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/70 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </>
  );
}
