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
import { UserPlus, Loader2, User } from "lucide-react";
import { registerStudent } from "@/actions/student-registration";
import { getMajorsForProgram } from "@/actions/majors";
import { GetProgramMajorsDataSuccess } from "@/lib/requests/programs/majors/get";
import { GetProgramsDataSuccess } from "@/lib/requests/programs/get";
import { GetYearLevelsDataSuccess } from "@/lib/requests/year-levels/get";
import { toast } from "sonner";
import {
  CreateStudentData,
  createStudentSchema,
} from "@/lib/requests/students/create";
import { ValidatedStudentRegistrationParamsSchema } from "@/app/students/register/[name]/page";
import { cn } from "@/lib/utils";

type RegistrationStatus = "idle" | "submitting" | "success";
interface StudentRegistrationFormProps {
  params: ValidatedStudentRegistrationParamsSchema;
  programs: GetProgramsDataSuccess["programs"];
  yearLevels: GetYearLevelsDataSuccess["year_levels"];
}

type CreateFormData = {
  id?: string;
  first_name?: string;
  middle_name?: string | null | undefined;
  last_name?: string;
  email_address?: string;
  degree_id?: number;
  program_id?: number;
  year_level_id?: number;
  major_id?: number | null | undefined;
};

export default function StudentRegistrationForm({
  params,
  programs,
  yearLevels,
}: StudentRegistrationFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [formData, setFormData] = useState<CreateFormData>({
    id: params.student_id,
    first_name: params.first_name?.toUpperCase(),
    middle_name: params.middle_name?.toUpperCase(),
    last_name: params.last_name?.toUpperCase(),
    email_address: params.email_address,
    degree_id: 1,
    program_id: params.program_id,
    major_id: params.major_id,
    year_level_id: params.year_level_id,
  });

  // Add state to track field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const [majors, setMajors] = useState<GetProgramMajorsDataSuccess["majors"]>(
    []
  );
  const [loadingMajors, setLoadingMajors] = useState(false);

  // Handle input changes for text fields
  const handleTextInputChange = (
    field: keyof Pick<
      CreateFormData,
      "first_name" | "middle_name" | "last_name" | "email_address"
    >,
    value: string
  ) => {
    let processedValue = value;

    // Handle name fields
    if (
      field === "first_name" ||
      field === "last_name" ||
      field === "middle_name"
    ) {
      // Auto-capitalize as user types
      processedValue = value.toUpperCase();
    }

    // Handle email field
    if (field === "email_address") {
      // Keep email lowercase
      processedValue = value.toLowerCase();
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error for this field when user edits it
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // Modify other handlers to clear errors too
  const handleProgramChange = async (programId: string) => {
    const selectedProgram = programs.find(p => `${p.id}` === programId);

    if (selectedProgram) {
      setFormData(prev => ({
        ...prev,
        program_id: selectedProgram.id,
        major_id: null, // Reset major when program changes
      }));

      // Clear program_id error
      if (fieldErrors.program_id) {
        setFieldErrors(prev => ({
          ...prev,
          program_id: false,
        }));
      }

      // Fetch majors for the selected program
      setLoadingMajors(true);
      const data = await getMajorsForProgram(selectedProgram.id);

      if ("error" in data) {
        toast.error(`Majors data error: ${data.error.code}`, {
          description: data.error.message,
        });
        setMajors([]);
        setLoadingMajors(false);
        return;
      }

      setMajors(data.majors);
      setLoadingMajors(false);
    }
  };

  const handleYearLevelChange = (yearLevelId: string) => {
    const selectedYearLevel = yearLevels.find(y => `${y.id}` === yearLevelId);

    if (selectedYearLevel) {
      setFormData(prev => ({
        ...prev,
        year_level_id: selectedYearLevel.id,
      }));

      // Clear year_level_id error
      if (fieldErrors.year_level_id) {
        setFieldErrors(prev => ({
          ...prev,
          year_level_id: false,
        }));
      }
    }
  };

  const handleMajorChange = (majorId: string) => {
    const selectedMajor = majors.find(m => `${m.id}` === majorId);

    if (selectedMajor) {
      setFormData(prev => ({
        ...prev,
        major_id: selectedMajor.id,
      }));

      // Clear major_id error
      if (fieldErrors.major_id) {
        setFieldErrors(prev => ({
          ...prev,
          major_id: false,
        }));
      }
    }
  };

  const handleRegister = async () => {
    setStatus("submitting");
    // Reset all field errors
    setFieldErrors({});

    const result = createStudentSchema.safeParse(formData);

    if (!result.success) {
      // Track which fields have errors
      const newFieldErrors: Record<string, boolean> = {};

      // Access issues array from Zod error
      if (result.error.issues && result.error.issues.length > 0) {
        // Loop through all validation errors and show each one
        result.error.issues.forEach(issue => {
          // Mark this field as having an error
          const fieldPath = issue.path.join(".");
          newFieldErrors[fieldPath] = true;

          toast.error("Registration form error", {
            description: issue.message,
          });
        });
      } else {
        // Fallback for general error message
        toast.error("Registration form failed", {
          description: result.error.message || "Please check your form input",
        });
      }

      // Update field errors state
      setFieldErrors(newFieldErrors);
      setStatus("idle");
      return;
    }

    const validatedData: CreateStudentData = result.data;

    const data = await registerStudent(validatedData);

    if ("error" in data) {
      toast.error("Registration submission failed", {
        description: data.error.message,
      });
      setStatus("idle");
      return;
    }

    toast.success("Registration successful", {
      description: "Redirecting you to your attendance code.",
    });
    setStatus("success");

    // Cookie is automatically set if successfully registered
    setTimeout(() => {
      router.push(`/students/register/code/${data.student.id}`);
    }, 1500);
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

  // Helper function to get input class based on error state
  const getInputClass = (fieldName: string) => {
    return fieldErrors[fieldName]
      ? "border-destructive focus-visible:ring-destructive"
      : "";
  };

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
                value={formData.id}
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
                  placeholder={`${formData.id}@vsu.edu.ph`}
                  value={formData.email_address || ""}
                  onChange={e =>
                    handleTextInputChange("email_address", e.target.value)
                  }
                  disabled={isFormDisabled}
                  className={`placeholder:text-muted-foreground/70 ${getInputClass(
                    "email_address"
                  )}`}
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
                  value={formData.first_name || ""}
                  onChange={e =>
                    handleTextInputChange("first_name", e.target.value)
                  }
                  disabled={isFormDisabled}
                  className={getInputClass("first_name")}
                />
              </div>

              <Input
                type="text"
                placeholder="Middle Name (Optional)"
                value={formData.middle_name || ""}
                onChange={e =>
                  handleTextInputChange("middle_name", e.target.value)
                }
                disabled={isFormDisabled}
                className={`text-muted-foreground ${getInputClass(
                  "middle_name"
                )}`}
              />

              <Input
                type="text"
                placeholder="Last Name"
                value={formData.last_name || ""}
                onChange={e =>
                  handleTextInputChange("last_name", e.target.value)
                }
                disabled={isFormDisabled}
                className={getInputClass("last_name")}
              />
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Program</Label>
              <Select
                value={`${formData.program_id || ""}`}
                onValueChange={handleProgramChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger
                  className={`w-full ${getInputClass("program_id")}`}
                >
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
                value={`${formData.year_level_id || ""}`}
                onValueChange={handleYearLevelChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger
                  className={`w-full ${getInputClass("year_level_id")}`}
                >
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
            {formData.program_id && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Major</Label>
                <Select
                  value={`${formData.major_id || ""}`}
                  onValueChange={handleMajorChange}
                  disabled={isFormDisabled || loadingMajors}
                >
                  <SelectTrigger
                    className={`w-full ${getInputClass("major_id")}`}
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

            {/* Register Button */}
            <Button
              onClick={handleRegister}
              disabled={isFormDisabled || loadingMajors}
              className={cn(
                loadingMajors && "cursor-wait",
                isFormDisabled && "cursor-not-allowed",
                "w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70 disabled:pointer-events-auto"
              )}
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
