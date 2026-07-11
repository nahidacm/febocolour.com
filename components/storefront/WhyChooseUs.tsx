import { Truck, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/storefront/SectionHeading";

const reasons = [
  {
    icon: Sparkles,
    title: "Premium Fabric",
    description: "Soft, breathable materials chosen for comfort in every size, from baby to adult.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description: "Each piece is checked for stitching, color and finish before it ships.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick dispatch with delivery across the city and nationwide.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    description: "Designed for modest, elegant style that feels as good as it looks.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Our Promise" title="Why Choose FeboColour" />
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {reasons.map((reason) => (
          <div key={reason.title} className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <reason.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{reason.title}</h3>
            <p className="mt-2 text-xs text-foreground/60">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
