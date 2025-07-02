"use client";

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center text-center text-muted-foreground">
      <div className="bg-secondary/20 p-2 sm:p-3 md:p-4 rounded-full mb-2 md:mb-3">
        {icon}
      </div>
      <p className="text-sm sm:text-base font-medium">{value}</p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
