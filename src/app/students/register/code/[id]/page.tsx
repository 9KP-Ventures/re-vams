"use server";

import QRCodeErrorPage from "@/components/student-registration/code-display-error";
import { CodeLoadingSkeleton } from "@/components/student-registration/code-display-loading-skeleton";
import CodePageWithData from "@/components/student-registration/code-display-wrapper";
import StudentDataErrorPage from "@/components/student-registration/student-data-error";
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
  const { error, reason } = await searchParams;

  if (error === "true" && reason === "generate_code") {
    return <QRCodeErrorPage />;
  }

  if (error === "true") {
    return <StudentDataErrorPage />;
  }

  return (
    <Suspense fallback={<CodeLoadingSkeleton />}>
      <CodePageWithData studentId={id} />
    </Suspense>
  );
}
