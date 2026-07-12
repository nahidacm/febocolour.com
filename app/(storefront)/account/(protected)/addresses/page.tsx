import { DeleteButton } from "@/components/admin/DeleteButton";
import { AddAddressForm } from "@/components/account/AddAddressForm";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { getCustomerAddresses } from "@/lib/services/customers";
import { deleteAddressAction } from "@/lib/actions/customer";

export default async function AccountAddressesPage() {
  const customer = await getCurrentCustomer();
  const addresses = customer ? await getCustomerAddresses(customer.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Your Addresses</h1>

      {addresses.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="flex items-start justify-between gap-4 rounded-brand-lg border border-brand-100 bg-white p-4"
            >
              <div className="text-sm text-foreground/70">
                {addr.label ? <p className="font-medium text-foreground">{addr.label}</p> : null}
                <p>{addr.fullName} · {addr.phone}</p>
                <p>
                  {addr.addressLine}, {addr.city}
                  {addr.area ? `, ${addr.area}` : ""}
                </p>
              </div>
              <DeleteButton action={deleteAddressAction.bind(null, addr.id)} confirmText="Delete this address?" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-foreground/60">No saved addresses yet.</p>
      )}

      <div className="mt-8 rounded-brand-lg border border-brand-100 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Add a New Address</h2>
        <div className="mt-4">
          <AddAddressForm />
        </div>
      </div>
    </div>
  );
}
