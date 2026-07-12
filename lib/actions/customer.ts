"use server";

import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/guards";
import { createAddress, deleteAddress, updateCustomerProfile } from "@/lib/services/customers";

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const customer = await requireCustomer();
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  if (!fullName || !phone) return { error: "Name and phone are required." };

  await updateCustomerProfile(customer.id, { fullName, phone });
  revalidatePath("/account/profile");
  return { success: true };
}

export type AddressFormState = { error?: string };

export async function addAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const customer = await requireCustomer();

  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const addressLine = formData.get("addressLine")?.toString().trim() ?? "";
  const city = formData.get("city")?.toString().trim() ?? "";

  if (!fullName || !phone || !addressLine || !city) {
    return { error: "Full name, phone, address, and city are required." };
  }

  await createAddress(customer.id, {
    label: formData.get("label")?.toString().trim() || undefined,
    fullName,
    phone,
    addressLine,
    city,
    area: formData.get("area")?.toString().trim() || undefined,
    postalCode: formData.get("postalCode")?.toString().trim() || undefined,
  });

  revalidatePath("/account/addresses");
  return {};
}

export async function deleteAddressAction(addressId: number) {
  const customer = await requireCustomer();
  await deleteAddress(customer.id, addressId);
  revalidatePath("/account/addresses");
}
