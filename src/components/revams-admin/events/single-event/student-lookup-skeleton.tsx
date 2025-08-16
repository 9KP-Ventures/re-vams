"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentLookupSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="border-b-1 relative">
        <CardTitle className="pb-4">
          <div className="h-8 bg-muted rounded-lg w-40"></div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Search form skeleton */}
        <div className="relative mb-6">
          <div className="h-12 bg-muted rounded-md w-full"></div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-muted rounded-full"></div>
        </div>

        {/* Empty state skeleton */}
        <div className="py-50 flex flex-col items-center justify-center space-y-6">
          <div className="bg-muted rounded-full p-4 h-20 w-20"></div>
          <div className="space-y-3 max-w-md text-center">
            <div className="h-6 bg-muted rounded-md w-48 mx-auto"></div>
            <div className="h-4 bg-muted rounded-md w-64 mx-auto"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
