import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/LoginForm";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Sign In", path: "/account/login", noIndex: true });
export const dynamic = "force-dynamic";

export default async function AccountLoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center font-display text-2xl font-semibold text-foreground">Sign In</h1>
      <div className="mt-8 rounded-brand-lg border border-brand-100 bg-white p-8">
        <LoginForm />
      </div>
    </div>
  );
}
