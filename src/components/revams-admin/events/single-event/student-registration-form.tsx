import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function StudentRegistrationForm({
  studentId,
  onSubmit,
}: {
  studentId: string;
  onSubmit: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="bg-muted/30 p-3 rounded-md mb-4">
        <p className="text-sm text-muted-foreground">
          Student ID <strong>{studentId}</strong> not found in our system.
          Please register this student first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" placeholder="Enter first name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" placeholder="Enter last name" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="student@example.edu"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program">Program</Label>
          <Input id="program" placeholder="Program" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year Level</Label>
          <Input id="year" placeholder="Year Level" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Input id="major" placeholder="Major" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input id="degree" placeholder="Degree" />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register & Add"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
