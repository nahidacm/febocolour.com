import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/RegisterForm";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Create Account", path: "/account/register", noIndex: true });
export const dynamic = "force-dynamic";

export default async function AccountRegisterPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center font-display text-2xl font-semibold text-foreground">Create Account</h1>
      <div className="mt-8 rounded-brand-lg border border-brand-100 bg-white p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
