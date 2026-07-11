import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentAdminUser } from "@/lib/auth/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdminUser();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50/50 px-4">
      <div className="w-full max-w-sm rounded-brand-lg border border-brand-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image src="/febo-logo.png" alt="FeboColour" width={160} height={60} className="h-10 w-auto" />
        </div>
        <h1 className="mt-6 text-center font-display text-lg font-semibold text-foreground">
          Admin Sign In
        </h1>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
