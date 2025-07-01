"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, User } from "lucide-react";
import { QRCodeDisplay } from "../qr-code-display";
import QRCode from "qrcode";
import { obfuscateName } from "@/lib/utils";

export interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
}

interface Props {
  studentData: StudentData;
}

export default function StudentCodeDisplay({ studentData }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const requestDownloadPermission = async (): Promise<boolean> => {
    // Check if browser supports the Permissions API
    if ("permissions" in navigator) {
      try {
        // Note: 'downloads' permission might not be supported in all browsers
        const permission = await navigator.permissions.query({
          name: "downloads" as PermissionName,
        });
        return permission.state === "granted" || permission.state === "prompt";
      } catch {
        // If downloads permission is not supported, fall back to general approach
        console.log(
          "Downloads permission not supported, proceeding with download"
        );
        return true;
      }
    }

    // For browsers without Permissions API, proceed with download
    return true;
  };

  const loadLogo = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load logo: ${path}`));
      img.src = path;
    });
  };

  const handleSaveQR = async () => {
    try {
      setIsSaving(true);

      const hasPermission = await requestDownloadPermission();
      if (!hasPermission) {
        console.log("Download permission denied");
        return;
      }

      // Load both logos
      const [logo1, logo2] = await Promise.all([
        loadLogo("/vsu-logo.png"),
        loadLogo("/re-vams-logo.png"), // Add your second logo path
      ]);

      // QR code size and layout
      const qrSize = 250;
      const padding = 20;
      const logoHeight = 60;
      const logoSpacing = 8; // Reduced from 15
      const textAreaHeight = 80;

      const canvasWidth = qrSize + padding * 2;
      const canvasHeight =
        logoHeight + logoSpacing + qrSize + padding * 2 + textAreaHeight;

      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw both logos side by side
      const logo1Width = (logo1.width / logo1.height) * logoHeight;
      const logo2Width = (logo2.width / logo2.height) * logoHeight;
      const totalLogosWidth = logo1Width + logo2Width + 20; // 20px spacing between logos
      const startX = (canvas.width - totalLogosWidth) / 2;

      // Draw first logo
      ctx.drawImage(logo1, startX, padding, logo1Width, logoHeight);
      // Draw second logo
      ctx.drawImage(
        logo2,
        startX + logo1Width + 20,
        padding,
        logo2Width,
        logoHeight
      );

      // Generate QR code
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, studentData.code, {
        width: qrSize,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      });

      const qrY = padding + logoHeight + logoSpacing;
      ctx.drawImage(qrCanvas, padding, qrY, qrSize, qrSize);

      // Add student info with wide tracking and bold last name
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      const textStartY = qrY + qrSize + 25;
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        `${obfuscateName(studentData.id)}`,
        canvas.width / 2,
        textStartY
      );

      // First name with wide letter spacing
      ctx.font = "16px Arial";
      const firstName = obfuscateName(studentData.firstName);
      const lastInitial = `${studentData.lastName.charAt(0)}.`;

      // Draw first name with tracking
      const charSpacing = 2; // Extra spacing between characters
      let currentX =
        canvas.width / 2 -
        ctx.measureText(`${firstName} ${lastInitial}`).width / 2;

      for (let i = 0; i < firstName.length; i++) {
        ctx.fillText(firstName[i], currentX, textStartY + 25);
        currentX += ctx.measureText(firstName[i]).width + charSpacing;
      }

      // Add space
      currentX += ctx.measureText(" ").width;

      // Draw last initial in bold
      ctx.font = "bold 16px Arial";
      ctx.fillText(lastInitial, currentX, textStartY + 25);

      ctx.font = "16px Arial";
      ctx.fillText("VSU Baybay Campus", canvas.width / 2, textStartY + 50);

      // Download
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${studentData.id}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/70 to-primary rounded-full flex items-center justify-center shadow-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Your Attendance Code
          </h1>
          <p className="text-sm text-muted-foreground">
            Save this QR Code image before closing this page
          </p>
        </div>
      </div>
      <Card className="py-0">
        <CardHeader className="py-3 gap-1 bg-gradient-to-r from-primary/75 to-primary text-white rounded-t-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span className="font-medium">Student Identification</span>
          </div>
          <p className="text-sm text-white/90">
            Your unique QR code for attendance tracking
          </p>
        </CardHeader>

        <CardContent className="px-4 py-6 space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
              <QRCodeDisplay value={studentData.code} />
            </div>
          </div>

          {/* Student Information */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Student Information</span>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-1">
              <p className="font-mono text-lg font-semibold text-foreground">
                {studentData.id}
              </p>
              <p className="text-sm text-muted-foreground">
                {studentData.firstName} <strong>{studentData.lastName}</strong>
              </p>
              <p className="text-xs text-muted-foreground">VSU Baybay Campus</p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveQR}
            disabled={isSaving}
            className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isSaving ? "Saving QR..." : "Save QR Code"}
          </Button>

          {/* Help Text */}
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Important:</strong> Keep this QR code accessible on your
              device. You&apos;ll need to present it during attendance
              verification and university events.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
