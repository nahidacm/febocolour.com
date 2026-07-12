import { BannerForm } from "@/components/admin/banners/BannerForm";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Banner</h1>
      <div className="mt-6">
        <BannerForm />
      </div>
    </div>
  );
}
