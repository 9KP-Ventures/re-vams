"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, User } from "lucide-react";
import { QRCodeDisplay } from "../qr-code-display";
import QRCode from "qrcode";

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  studentData: StudentData;
}

export default function StudentCodeDisplay({ studentData }: Props) {
  const handleSaveQR = async () => {
    try {
      // QR code size
      const qrSize = 250;
      const padding = 20;
      const textAreaHeight = 80;

      // Set canvas size based on QR code + padding + text area
      const canvasWidth = qrSize + padding * 2;
      const canvasHeight = qrSize + padding * 2 + textAreaHeight;

      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Generate QR code on a temporary canvas
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, `student:${studentData.id}`, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Draw QR code onto main canvas (centered with padding)
      ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);

      // Add student info text
      ctx.fillStyle = "#000000";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";

      const textStartY = qrSize + padding + 25;
      ctx.fillText(`${studentData.id}`, canvas.width / 2, textStartY);
      ctx.font = "16px Arial";
      ctx.fillText(
        `${studentData.firstName} ${studentData.lastName}`,
        canvas.width / 2,
        textStartY + 25
      );
      ctx.fillText("VSU Baybay Campus", canvas.width / 2, textStartY + 50);

      // Convert to blob and download
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
              {/* Mock QR Code - In real implementation, use a QR code library */}
              <QRCodeDisplay value={`student:${studentData.id}`} />
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
            className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70"
          >
            <Download className="w-4 h-4 mr-2" />
            Save QR Code
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
