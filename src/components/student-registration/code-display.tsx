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
      // Enable cross-origin for better image quality
      img.crossOrigin = "anonymous";
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

      // High-DPI settings for better quality
      const devicePixelRatio = window.devicePixelRatio || 1;
      const scaleFactor = Math.max(devicePixelRatio, 2); // Minimum 2x for quality

      // QR code size and layout (base dimensions)
      const baseQrSize = 300; // Increased from 250
      const basePadding = 25; // Increased from 20
      const baseLogoHeight = 80; // Increased from 60
      const baseLogoSpacing = 12; // Increased from 8
      const baseTextAreaHeight = 100; // Increased from 80

      // Scale everything up for high DPI
      const qrSize = baseQrSize * scaleFactor;
      const padding = basePadding * scaleFactor;
      const logoHeight = baseLogoHeight * scaleFactor;
      const logoSpacing = baseLogoSpacing * scaleFactor;
      const textAreaHeight = baseTextAreaHeight * scaleFactor;

      const canvasWidth = qrSize + padding * 2;
      const canvasHeight =
        logoHeight + logoSpacing + qrSize + padding * 2 + textAreaHeight;

      // Create high-DPI canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set actual canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Set display size (for download, we want full resolution)
      canvas.style.width = `${canvasWidth / scaleFactor}px`;
      canvas.style.height = `${canvasHeight / scaleFactor}px`;

      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Scale the context for high-DPI
      ctx.scale(scaleFactor, scaleFactor);

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth / scaleFactor, canvasHeight / scaleFactor);

      // Calculate logo dimensions (using base dimensions for calculations)
      const logo1Width = (logo1.width / logo1.height) * baseLogoHeight;
      const logo2Width = (logo2.width / logo2.height) * baseLogoHeight;
      const totalLogosWidth = logo1Width + logo2Width + 25; // 25px spacing between logos
      const startX = (canvasWidth / scaleFactor - totalLogosWidth) / 2;

      // Draw logos with high quality
      ctx.drawImage(logo1, startX, basePadding, logo1Width, baseLogoHeight);
      ctx.drawImage(
        logo2,
        startX + logo1Width + 25,
        basePadding,
        logo2Width,
        baseLogoHeight
      );

      // Generate high-quality QR code
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, studentData.code, {
        width: qrSize, // Use scaled size
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
        errorCorrectionLevel: "M", // Medium error correction for better quality
      });

      const qrY = basePadding + baseLogoHeight + baseLogoSpacing;
      ctx.drawImage(qrCanvas, basePadding, qrY, baseQrSize, baseQrSize);

      // Add student info with scaled fonts
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      const textStartY = qrY + baseQrSize + 30;

      // Student ID
      ctx.font = `bold ${(22 * scaleFactor) / scaleFactor}px Arial`; // Maintain readable size
      ctx.fillText(
        `${obfuscateName(studentData.id)}`,
        canvasWidth / scaleFactor / 2,
        textStartY
      );

      // First name with wide letter spacing
      ctx.font = `${(18 * scaleFactor) / scaleFactor}px Arial`;
      const firstName = obfuscateName(studentData.firstName);
      const lastInitial = `${studentData.lastName.charAt(0)}.`;

      // Draw first name with tracking
      const charSpacing = 3; // Extra spacing between characters
      let currentX =
        canvasWidth / scaleFactor / 2 -
        ctx.measureText(`${firstName} ${lastInitial}`).width / 2;

      for (let i = 0; i < firstName.length; i++) {
        ctx.fillText(firstName[i], currentX, textStartY + 30);
        currentX += ctx.measureText(firstName[i]).width + charSpacing;
      }

      // Add space
      currentX += ctx.measureText(" ").width;

      // Draw last initial in bold
      ctx.font = `bold ${(18 * scaleFactor) / scaleFactor}px Arial`;
      ctx.fillText(lastInitial, currentX, textStartY + 30);

      // University name
      ctx.font = `${(16 * scaleFactor) / scaleFactor}px Arial`;
      ctx.fillText(
        "VSU Baybay Campus",
        canvasWidth / scaleFactor / 2,
        textStartY + 60
      );

      // Download with high quality
      canvas.toBlob(
        blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${studentData.id}-qr-code.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0
      ); // Maximum quality PNG
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
