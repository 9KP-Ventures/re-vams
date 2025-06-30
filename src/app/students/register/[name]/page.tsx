"use server";
import RegistrationCheck from "@/components/student-registration/check-registration";
import PrivacyNotice from "@/components/student-registration/data-privacy";

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <>
      {name === "data-privacy" && <PrivacyNotice />}
      {name === "check" && <RegistrationCheck />}
      {name === "form" && <>Register here</>}
      {name === "verify" && <>Verify student by last name</>}
      {name === "your-id" && <>Show code here</>}
    </>
  );
}
