"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";
import { verifyStudentIdByLastName } from "@/actions/student-registration";

type VerifyStatus = "idle" | "verifying" | "success" | "failed" | "error";

interface VerifyStudentIdentityProps {
  id: string;
}

export default function VerifyStudentIdentity({
  id,
}: VerifyStudentIdentityProps) {
  const router = useRouter();
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!lastName.trim()) {
      setErrorMessage("Last name is required");
      setStatus("error");
      return;
    }

    setStatus("verifying");
    setErrorMessage(null);

    // Mock verification - simulate successful verification for certain names
    const verified = await verifyStudentIdByLastName(id, lastName);
    if (verified) {
      setStatus("success");

      // Redirect to student dashboard after short delay
      setTimeout(() => {
        router.push(`/students/register/code/${id}`);
      }, 1000);
    } else {
      setStatus("failed");
      setErrorMessage("Last name doesn't match our records");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);

    // Reset status when user types
    if (status !== "idle" && status !== "verifying") {
      setStatus("idle");
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center space-x-2 text-primary p-3 bg-primary/10 rounded-lg border border-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Identity verified! Redirecting...
            </span>
          </div>
        );

      case "failed":
      case "error":
        return (
          <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg border border-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {errorMessage || "Verification failed"}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "verifying":
        return "Verifying...";
      case "success":
        return "Redirecting...";
      default:
        return "Verify";
    }
  };

  const isButtonDisabled = () => {
    return !lastName.trim() || status === "verifying" || status === "success";
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/70 to-primary rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Verify
            </h1>
            <p className="text-sm text-muted-foreground">
              We verified that you are registered. To confirm that this is you,
              kindly enter your last name.
            </p>
          </div>
        </div>

        {/* Verification Card */}
        <Card className="py-0">
          <CardHeader className="py-3 gap-1 bg-gradient-to-r from-primary/75 to-primary text-white rounded-t-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Ownership Verification</span>
            </div>
            <p className="text-sm text-white/90">
              Enter your last name to validate your ownership.
              <br />
              <strong>{id}</strong>
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Last Name Input Section */}
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={handleInputChange}
                onKeyDown={e =>
                  e.key === "Enter" && !isButtonDisabled() && handleVerify()
                }
                disabled={status === "verifying" || status === "success"}
                className="text-lg"
              />
            </div>

            {/* Status Display */}
            {status !== "idle" && status !== "verifying" && (
              <div className="space-y-3">{getStatusDisplay()}</div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleVerify}
              disabled={isButtonDisabled()}
              className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "verifying" ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{getButtonText()}</span>
                </div>
              ) : (
                getButtonText()
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
