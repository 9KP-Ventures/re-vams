"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Shield, TreePine, Clock, CheckCircle, LucideIcon } from "lucide-react";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

type PrivacySectionProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
};

export default function PrivacyNotice() {
  const router = useRouter();

  // Track opened sections with an object
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [hasConsented, setHasConsented] = useState(false);

  const privacySections: PrivacySectionProps[] = useMemo(
    () => [
      {
        id: "data-collection",
        title: "Data Collection",
        icon: TreePine,
        content: (
          <p className="text-sm text-muted-foreground">
            We collect personal information such as name, email, and attendance
            data for the purpose of managing student records and improving our
            services.
          </p>
        ),
      },
      {
        id: "data-usage",
        title: "Data Usage",
        icon: Clock,
        content: (
          <p className="text-sm text-muted-foreground">
            Your data will be used to track attendance, generate reports, and
            enhance the learning experience.
          </p>
        ),
      },
      {
        id: "your-rights",
        title: "Your Rights",
        icon: CheckCircle,
        content: (
          <p className="text-sm text-muted-foreground">
            You have the right to access, correct, and delete your personal
            information at any time.
          </p>
        ),
      },
    ],
    []
  );

  // Track if all sections are opened
  const allSectionsOpened = useMemo(() => {
    return privacySections.every(section => openSections[section.id]);
  }, [openSections, privacySections]);

  // Handle Accordion value change
  const handleAccordionChange = (value: string[]) => {
    const newOpenSections = { ...openSections };

    // Update each section based on whether it's in the value array
    privacySections.forEach(section => {
      newOpenSections[section.id] = value.includes(section.id);
    });

    setOpenSections(newOpenSections);
  };

  const handleAccept = () => {
    if (hasConsented && allSectionsOpened) {
      router.push("/students/register/check?accepted-policy=true");
    }
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
              Welcome to ReVAMS
            </h1>
            <p className="text-sm text-muted-foreground">
              Revenue and Attendance Management System <br /> for VSU Baybay
              Campus
            </p>
          </div>
        </div>

        {/* Privacy Notice Card */}
        <Card className="py-0">
          <CardHeader className="py-3 gap-1 bg-gradient-to-r from-primary/75 to-primary text-white rounded-t-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Data Privacy Notice</span>
            </div>
            <p className="text-sm text-shadow-white">
              Please review our privacy practices before proceeding
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-4">
            {/* Privacy Summary */}
            <div className="bg-primary/10 border border-primary rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-primary">
                  We protect your personal information and use it only for
                  attendance tracking and academic purposes in compliance with
                  the <strong>Data Privacy Act of 2012</strong>.
                </div>
              </div>
            </div>

            {/* Accordion Sections (migrated from Collapsible) */}
            <div className="space-y-3">
              <Accordion
                type="multiple"
                className="w-full"
                value={Object.keys(openSections).filter(
                  key => openSections[key]
                )}
                onValueChange={handleAccordionChange}
              >
                {privacySections.map(section => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border-0 mb-3"
                  >
                    <AccordionTrigger
                      className={`p-3 rounded-lg transition-colors [&[data-state=open]>svg]:text-primary-foreground ${
                        openSections[section.id]
                          ? "bg-gradient-to-r from-primary/75 to-primary shadow-sm text-white"
                          : "bg-background hover:bg-primary/30 text-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <section.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-muted rounded-b-md">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Consent Checkbox */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy-consent"
                  checked={hasConsented}
                  onCheckedChange={checked =>
                    setHasConsented(checked as boolean)
                  }
                  disabled={!allSectionsOpened}
                  className="mt-1 disabled:opacity-50"
                />
                <Label
                  htmlFor="privacy-consent"
                  className={`inline-block text-xs ${
                    allSectionsOpened
                      ? "text-foreground/70"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  I have read and understood the{" "}
                  <strong className="text-primary">Data Privacy Notice</strong>{" "}
                  and consent to the processing of my personal data for
                  attendance tracking purposes.
                </Label>
              </div>
              {!allSectionsOpened && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 ml-7">
                  Please review all privacy sections above before providing
                  consent by opening it.
                </p>
              )}
            </div>

            {/* Accept Button */}
            <Button
              onClick={handleAccept}
              disabled={!hasConsented || !allSectionsOpened}
              className={`w-full text-white transition-colors ${
                hasConsented && allSectionsOpened
                  ? "bg-gradient-to-r hover:opacity-70 from-primary/70 to-primary shadow-sm transition-all"
                  : "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              }`}
            >
              {allSectionsOpened
                ? hasConsented
                  ? "I Agree and Continue"
                  : "Please Check Consent Box"
                : "Please Review All Sections"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
