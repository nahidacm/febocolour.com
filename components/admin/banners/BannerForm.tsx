"use client";

import Image from "next/image";
import { useActionState } from "react";
import { FormField, FormCheckbox } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveBannerAction, type BannerFormState } from "@/lib/actions/admin/banners";

const initialState: BannerFormState = {};

export function BannerForm({
  banner,
}: {
  banner?: {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    ctaLabel: string | null;
    ctaUrl: string | null;
    secondaryCtaLabel: string | null;
    secondaryCtaUrl: string | null;
    sortOrder: number;
    isActive: boolean;
  };
}) {
  const [state, formAction] = useActionState(saveBannerAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}

      {banner?.image ? (
        <div className="relative h-40 w-full overflow-hidden rounded-brand-md border border-brand-100">
          <Image src={`/uploads/${banner.image}`} alt="" fill className="object-cover" />
        </div>
      ) : null}

      <div>
        <label htmlFor="image" className="text-sm font-medium text-foreground/80">
          {banner ? "Replace Image" : "Image"}
          {!banner ? <span className="text-brand-600"> *</span> : null}
        </label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          required={!banner}
          className="mt-1.5 text-sm text-foreground/70 file:mr-3 file:rounded-brand-sm file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>

      <FormField label="Title" name="title" defaultValue={banner?.title} required error={state.fieldErrors?.title} />
      <FormField label="Subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Primary CTA Label" name="ctaLabel" defaultValue={banner?.ctaLabel ?? ""} />
        <FormField label="Primary CTA URL" name="ctaUrl" defaultValue={banner?.ctaUrl ?? ""} />
        <FormField label="Secondary CTA Label" name="secondaryCtaLabel" defaultValue={banner?.secondaryCtaLabel ?? ""} />
        <FormField label="Secondary CTA URL" name="secondaryCtaUrl" defaultValue={banner?.secondaryCtaUrl ?? ""} />
      </div>

      <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={banner?.sortOrder ?? 0} />
      <FormCheckbox label="Active" name="isActive" defaultChecked={banner?.isActive ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{banner ? "Save Changes" : "Create Banner"}</SubmitButton>
    </form>
  );
}
