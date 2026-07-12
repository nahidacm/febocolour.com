import { requireCustomer } from "@/lib/auth/guards";
import { AccountNav } from "@/components/account/AccountNav";

export const dynamic = "force-dynamic";

export default async function AccountProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCustomer();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
        <AccountNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
