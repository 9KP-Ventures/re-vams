import { Check } from "lucide-react";
import Link from "next/link";
import { UrlObject } from "url";

export const FilterOption = ({
  label,
  isActive,
  href,
  onClick,
  fullWidth = false,
}: {
  label: string;
  isActive: boolean;
  href: string | UrlObject;
  onClick: () => void;
  fullWidth?: boolean;
}) => (
  <Link
    href={href}
    className={`
      ${fullWidth ? "flex justify-between w-full" : "inline-flex items-center"}
      px-3 py-1.5 rounded-md text-sm
      ${
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "bg-background hover:bg-accent text-foreground"
      }
    `}
    onClick={onClick}
  >
    <span className="capitalize">{label}</span>
    {isActive && <Check size={14} className="ml-1 text-primary" />}
  </Link>
);
