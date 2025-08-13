import { Badge } from "@/components/ui/badge";

export const FilterGroup = ({
  title,
  children,
  badgeCount = 0,
}: {
  title: string;
  children: React.ReactNode;
  badgeCount?: number;
}) => (
  <div className="p-4">
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-sm">{title}</h4>
      {badgeCount > 0 && (
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 text-xs"
        >
          {badgeCount}
        </Badge>
      )}
    </div>
    {children}
  </div>
);
