"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AddTimeSlot() {
  return (
    <Card
      className="py-10 relative cursor-pointer bg-background shadow-none border-dashed-custom"
      style={{ "--dashed-border-color": "darkgray" } as React.CSSProperties}
    >
      <CardContent className="flex gap-4 mx-auto">
        <Plus />
        Add Time Slot
      </CardContent>
    </Card>
  );
}
