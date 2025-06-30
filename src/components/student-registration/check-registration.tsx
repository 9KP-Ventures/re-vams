"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type CheckStatus =
  | "idle"
  | "checking"
  | "found"
  | "not-found"
  | "invalid-format";

export default function RegistrationCheck() {
  const router = useRouter();
  const [idNumber, setIdNumber] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Get current year's last two digits
  const getCurrentYearDigits = (): string => {
    return new Date().getFullYear().toString().slice(-2);
  };

  // Zod-style validation function
  const validateInput = (id: string): { success: boolean; error?: string } => {
    if (!id || id.trim() === "") {
      return { success: false, error: "Student ID is required" };
    }

    const pattern = /^\d{2}-[1-9]-\d{5}$/;
    if (!pattern.test(id)) {
      return { success: false, error: "Invalid student ID format" };
    }

    return { success: true };
  };

  const handleCheck = async () => {
    if (!idNumber.trim()) return;

    // Validate using Zod-style validation
    const validation = validateInput(idNumber);
    if (!validation.success) {
      setValidationError(validation.error || "Invalid format");
      setStatus("invalid-format");
      return;
    }

    setStatus("checking");
    setValidationError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock database check - simulate existing records
    const existingIds = [
      "25-1-12345",
      "24-2-67890",
      "23-3-11111",
      "21-1-01040",
      "25-1-12345",
    ];

    if (existingIds.includes(idNumber)) {
      setStatus("found");
      // Redirect to verify page after a short delay
      setTimeout(() => {
        router.push(
          `/students/register/verify?accepted-policy=true&student-id=${idNumber}`
        );
      }, 1000);
    } else {
      setStatus("not-found");
      // Redirect to registration form after a short delay
      setTimeout(() => {
        router.push(
          `/students/register/form?accepted-policy=true&student-id=${idNumber}`
        );
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow completely empty input for deletion
    if (value === "") {
      setIdNumber("");
      if (status !== "idle" && status !== "checking") {
        setStatus("idle");
      }
      if (validationError) {
        setValidationError(null);
      }
      return;
    }

    // Only allow numbers and dashes
    value = value.replace(/[^0-9-]/g, "");

    // Limit total length to 10
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setIdNumber(value);

    // Reset status and validation error when user modifies input
    if (status !== "idle" && status !== "checking") {
      setStatus("idle");
    }
    if (validationError) {
      setValidationError(null);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "found":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary p-3 bg-primary/10 rounded-lg border border-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Student ID found!</span>
            </div>
          </div>
        );

      case "not-found":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-muted-foreground p-3 bg-muted rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Taking you to registration...
              </span>
            </div>
          </div>
        );

      case "invalid-format":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg border border-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {validationError || "Invalid student ID format."}
              </span>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Correct format:</strong> YY-S-#####
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • <strong>YY</strong>: Year of admission (last 2 digits)
                </p>
                <p>
                  • <strong>S</strong>: Year level at admission (1-9)
                </p>
                <p>
                  • <strong>#####</strong>: 5-digit student number
                </p>
                <p className="pt-1">
                  <strong>Example:</strong> {getCurrentYearDigits()}-1-12345
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "checking":
        return "Verifying...";
      case "found":
      case "not-found":
        return "Redirecting...";
      default:
        return "Verify Registration";
    }
  };

  const isButtonDisabled = () => {
    return (
      !idNumber.trim() ||
      status === "checking" ||
      status === "found" ||
      status === "not-found"
    );
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/70 to-primary rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Check Registration
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your student ID to verify your registration status
            </p>
          </div>
        </div>

        {/* Registration Check Card */}
        <Card className="py-0">
          <CardHeader className="py-3 gap-1 bg-gradient-to-r from-primary/75 to-primary text-white rounded-t-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span className="font-medium">Student ID Verification</span>
            </div>
            <p className="text-sm text-white/90">
              Enter your student ID to check your registration
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-4">
            {/* ID Input Section */}
            <div className="space-y-2">
              <Label htmlFor="id-number" className="text-sm font-medium">
                Student ID Number
              </Label>
              <Input
                id="id-number"
                type="text"
                placeholder="YY-S-#####"
                value={idNumber}
                onChange={handleInputChange}
                onKeyDown={e =>
                  e.key === "Enter" && !isButtonDisabled() && handleCheck()
                }
                disabled={
                  status === "checking" ||
                  status === "found" ||
                  status === "not-found"
                }
                className="text-center font-mono text-lg tracking-wider"
              />
              <p className="text-xs text-muted-foreground text-center">
                Format: {getCurrentYearDigits()}-1-12345 (Year-Level-Number)
              </p>
            </div>

            {/* Status Display - Only show when not checking */}
            <div className="space-y-3">{getStatusDisplay()}</div>

            {/* Action Button */}
            <Button
              onClick={handleCheck}
              disabled={isButtonDisabled()}
              className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "checking" ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{getButtonText()}</span>
                </div>
              ) : (
                getButtonText()
              )}
            </Button>

            {/* Help Text */}
            {status === "idle" && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Need help?</strong> Your student ID follows the format
                  YY-S-##### where: <br />
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
                  <li>
                    <strong>YY</strong> is the academic year you enrolled in
                  </li>
                  <li>
                    <strong>S</strong> is the year level when you were admitted
                  </li>
                  <li>
                    <strong>#####</strong> is your unique 5-digit number
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
