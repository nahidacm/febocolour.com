import { SocialLinkForm } from "@/components/admin/social-links/SocialLinkForm";

export default function NewSocialLinkPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Social Link</h1>
      <div className="mt-6">
        <SocialLinkForm />
      </div>
    </div>
  );
}
