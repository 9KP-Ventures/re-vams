"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import {
  registerStudent,
  RegistrationFormData,
} from "@/actions/student-registration";
import { Tables } from "@/app/utils/supabase/types";
import { getMajorsForProgram } from "@/actions/majors";

type RegistrationStatus = "idle" | "submitting" | "success" | "error";
interface StudentRegistrationFormProps {
  id: string;
  firstName?: string | undefined;
  middleName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  programs: Tables<"programs">[];
  yearLevels: Tables<"year_levels">[];
}

export default function StudentRegistrationForm({
  id,
  firstName,
  middleName,
  lastName,
  email,
  programs,
  yearLevels,
}: StudentRegistrationFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    idNumber: id,
    firstName: firstName || "",
    middleName: middleName || "",
    lastName: lastName || "",
    email: email || "",
    program: null,
    yearLevel: null,
    major: null,
  });

  const [majors, setMajors] = useState<Tables<"majors">[]>([]);
  const [loadingMajors, setLoadingMajors] = useState(false);

  // Handle input changes for text fields
  const handleTextInputChange = (
    field: keyof Pick<
      RegistrationFormData,
      "firstName" | "middleName" | "lastName" | "email"
    >,
    value: string
  ) => {
    let processedValue = value;

    // Handle name fields
    if (
      field === "firstName" ||
      field === "lastName" ||
      field === "middleName"
    ) {
      // Auto-capitalize as user types
      processedValue = value.toUpperCase();
    }

    // Handle email field
    if (field === "email") {
      // Keep email lowercase
      processedValue = value.toLowerCase();
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue.trim(),
    }));

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  // Handle program selection
  const handleProgramChange = async (programId: string) => {
    const selectedProgram = programs.find(p => p.id.toString() === programId);

    if (selectedProgram) {
      setFormData(prev => ({
        ...prev,
        program: {
          id: selectedProgram.id,
          name: selectedProgram.name,
        },
        major: null, // Reset major when program changes
      }));

      // Fetch majors for the selected program
      setLoadingMajors(true);
      try {
        const programMajors = await getMajorsForProgram(selectedProgram.id);
        setMajors(programMajors);
      } catch (error) {
        console.error("Error fetching majors:", error);
        setMajors([]);
      } finally {
        setLoadingMajors(false);
      }
    }

    // Clear error
    if (errorMessage) {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  // Handle year level selection
  const handleYearLevelChange = (yearLevelId: string) => {
    const selectedYearLevel = yearLevels.find(
      y => y.id.toString() === yearLevelId
    );

    if (selectedYearLevel) {
      setFormData(prev => ({
        ...prev,
        yearLevel: {
          id: selectedYearLevel.id,
          name: selectedYearLevel.name,
        },
      }));
    }

    // Clear error
    if (errorMessage) {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  // Handle major selection
  const handleMajorChange = (majorId: string) => {
    const selectedMajor = majors.find(m => m.id.toString() === majorId);

    if (selectedMajor) {
      setFormData(prev => ({
        ...prev,
        major: {
          id: selectedMajor.id,
          name: selectedMajor.name,
          program_id: formData.program?.id ?? null,
        },
      }));
    }

    // Clear error
    if (errorMessage) {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.program) return "Please select a degree program";
    if (!formData.yearLevel) return "Please select a year level";
    if (!formData.email.trim()) return "Email is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim()))
      return "Please enter a valid email address";

    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const result = await registerStudent(formData);

      if (result.success && !result.error && result.verified) {
        setStatus("success");

        // Cookie is automatically set if successfully registered
        setTimeout(() => {
          router.push(`/students/register/code/${formData.idNumber}`);
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Registration failed.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(`${error}`);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center space-x-2 text-primary p-3 bg-primary/10 rounded-lg border border-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Registration successful! Redirecting...
            </span>
          </div>
        );

      case "error":
        return (
          <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg border border-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {errorMessage || "Registration failed"}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "submitting":
        return "Registering...";
      case "success":
        return "Redirecting...";
      default:
        return "Register";
    }
  };

  const isFormDisabled = status === "submitting" || status === "success";

  return (
    <>
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/70 to-primary rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Register
            </h1>
            <p className="text-sm text-muted-foreground">
              Please fill out the form to register
            </p>
          </div>
        </div>

        {/* Registration Form Card */}
        <Card className="py-0">
          <CardHeader className="py-3 gap-1 bg-gradient-to-r from-primary/75 to-primary text-white rounded-t-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Student Registration</span>
            </div>
            <p className="text-sm text-white/90">
              Complete your enrollment information
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-4">
            {/* ID Number (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="id-number" className="text-sm font-medium">
                ID Number
              </Label>
              <Input
                id="id-number"
                type="text"
                value={formData.idNumber}
                disabled
                className="bg-muted font-mono text-center"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={`${formData.idNumber}@vsu.edu.ph`}
                  value={formData.email}
                  onChange={e => handleTextInputChange("email", e.target.value)}
                  disabled={isFormDisabled}
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={e =>
                    handleTextInputChange("firstName", e.target.value)
                  }
                  disabled={isFormDisabled}
                />
              </div>

              <Input
                type="text"
                placeholder="Middle Name (Optional)"
                value={formData.middleName}
                onChange={e =>
                  handleTextInputChange("middleName", e.target.value)
                }
                disabled={isFormDisabled}
                className="text-muted-foreground"
              />

              <Input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={e =>
                  handleTextInputChange("lastName", e.target.value)
                }
                disabled={isFormDisabled}
              />
            </div>

            {/* Degree Program */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Degree Program</Label>
              <Select
                value={formData.program?.id.toString() || ""}
                onValueChange={handleProgramChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose option..." />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year Level</Label>
              <Select
                value={formData.yearLevel?.id.toString() || ""}
                onValueChange={handleYearLevelChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose option..." />
                </SelectTrigger>
                <SelectContent>
                  {yearLevels.map(year => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Major (Conditional) */}
            {formData.program && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Major</Label>
                <Select
                  value={formData.major?.id.toString() || ""}
                  onValueChange={handleMajorChange}
                  disabled={isFormDisabled || loadingMajors}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={majors.length === 0}
                  >
                    <SelectValue
                      placeholder={
                        loadingMajors
                          ? "Loading majors..."
                          : majors.length === 0
                          ? "No majors found"
                          : "Choose option..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map(major => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status Display */}
            {status !== "idle" && status !== "submitting" && (
              <div className="space-y-3">{getStatusDisplay()}</div>
            )}

            {/* Register Button */}
            <Button
              onClick={handleRegister}
              disabled={isFormDisabled}
              className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
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
