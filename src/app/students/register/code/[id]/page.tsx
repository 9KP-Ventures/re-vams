"use server";

import QRCodeErrorPage from "@/components/student-registration/code-display-error";
import { CodeLoadingSkeleton } from "@/components/student-registration/code-display-loading-skeleton";
import CodePageWithData from "@/components/student-registration/code-display-wrapper";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function StudentCodePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  if (error && error === "true") {
    return <QRCodeErrorPage />;
  }

  return (
    <Suspense fallback={<CodeLoadingSkeleton />}>
      <CodePageWithData studentId={id} />
    </Suspense>
  );
}
