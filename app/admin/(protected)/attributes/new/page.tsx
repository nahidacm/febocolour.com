import { AttributeForm } from "@/components/admin/attributes/AttributeForm";

export default function NewAttributePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Attribute</h1>
      <div className="mt-6">
        <AttributeForm />
      </div>
    </div>
  );
}
