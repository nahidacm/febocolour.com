import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Stand-in for real product/banner photography until catalog images exist (Phase 1+).
 * Swap call sites for next/image once real assets are uploaded.
 */
export function PlaceholderImage({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-linear-to-br from-brand-100 via-brand-50 to-accent-100",
        className,
      )}
    >
      <ImageIcon className={cn("h-8 w-8 text-brand-300", iconClassName)} />
    </div>
  );
}
