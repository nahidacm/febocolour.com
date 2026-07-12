import { ProfileForm } from "@/components/account/ProfileForm";
import { getCurrentCustomer } from "@/lib/auth/customer";

export default async function AccountProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Profile</h1>
      <div className="mt-6">
        <ProfileForm customer={customer} />
      </div>
    </div>
  );
}
