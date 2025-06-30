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
  RegisterStudent,
  RegistrationFormData,
} from "@/actions/student-registration";

type RegistrationStatus = "idle" | "submitting" | "success" | "error";

interface StudentRegistrationFormProps {
  id: string;
}

// Mock data - in real app, fetch from API
const degreePrograms = [
  { id: "bscs", name: "Bachelor of Science in Computer Science" },
  { id: "bsit", name: "Bachelor of Science in Information Technology" },
  { id: "bsba", name: "Bachelor of Science in Business Administration" },
  { id: "bsed", name: "Bachelor of Science in Education" },
];

const yearLevels = [
  { id: "1", name: "1st Year" },
  { id: "2", name: "2nd Year" },
  { id: "3", name: "3rd Year" },
  { id: "4", name: "4th Year" },
];

// Mock majors based on selected program
const getMajorsForProgram = (programId: string) => {
  const majors = {
    bscs: [
      { id: "ai", name: "Artificial Intelligence" },
      { id: "cybersec", name: "Cybersecurity" },
      { id: "software", name: "Software Engineering" },
    ],
    bsit: [
      { id: "webdev", name: "Web Development" },
      { id: "network", name: "Network Administration" },
      { id: "database", name: "Database Management" },
    ],
    bsba: [
      { id: "finance", name: "Finance" },
      { id: "marketing", name: "Marketing" },
      { id: "management", name: "Management" },
    ],
    bsed: [
      { id: "elementary", name: "Elementary Education" },
      { id: "secondary", name: "Secondary Education" },
      { id: "special", name: "Special Education" },
    ],
  };
  return majors[programId as keyof typeof majors] || [];
};

export default function StudentRegistrationForm({
  id,
}: StudentRegistrationFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    idNumber: id,
    firstName: "",
    middleName: "",
    lastName: "",
    degreeProgram: "",
    yearLevel: "",
    major: "",
  });

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset major when program changes
      ...(field === "degreeProgram" && { major: "" }),
    }));

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.degreeProgram) return "Please select a degree program";
    if (!formData.yearLevel) return "Please select a year level";
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
      const result = await RegisterStudent(formData);

      if (result.success) {
        setStatus("success");
        // Cookie is automatically set if verified
        setTimeout(() => {
          router.push(`/students/register/code/${formData.idNumber}`);
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Registration failed");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Registration failed. Please try again.");
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
                  onChange={e => handleInputChange("firstName", e.target.value)}
                  disabled={isFormDisabled}
                />
              </div>

              <Input
                type="text"
                placeholder="Middle Name (Optional)"
                value={formData.middleName}
                onChange={e => handleInputChange("middleName", e.target.value)}
                disabled={isFormDisabled}
                className="text-muted-foreground"
              />

              <Input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={e => handleInputChange("lastName", e.target.value)}
                disabled={isFormDisabled}
              />
            </div>

            {/* Degree Program */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Degree Program</Label>
              <Select
                value={formData.degreeProgram}
                onValueChange={value =>
                  handleInputChange("degreeProgram", value)
                }
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose option..." />
                </SelectTrigger>
                <SelectContent>
                  {degreePrograms.map(program => (
                    <SelectItem key={program.id} value={program.id}>
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
                value={formData.yearLevel}
                onValueChange={value => handleInputChange("yearLevel", value)}
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose option..." />
                </SelectTrigger>
                <SelectContent>
                  {yearLevels.map(year => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Major (Conditional) */}
            {formData.degreeProgram && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Major (Optional)</Label>
                <Select
                  value={formData.major}
                  onValueChange={value => handleInputChange("major", value)}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getMajorsForProgram(formData.degreeProgram).map(major => (
                      <SelectItem key={major.id} value={major.id}>
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
