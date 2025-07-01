"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QRCodeErrorPage() {
  const router = useRouter();

  return (
    <>
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Error Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-destructive/60 to-destructive rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Unable to Load QR Code
            </h1>
            <p className="text-sm text-muted-foreground">
              We&apos;re having trouble generating your student QR code at the
              moment.
            </p>
          </div>
        </div>

        {/* Error Card */}
        <Card className="py-0">
          <CardHeader className="py-3 gap-1 bg-gradient-to-r from-destructive/80 to-destructive text-white rounded-t-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">System Error</span>
            </div>
            <p className="text-sm text-white/90">
              Failed to retrieve your student identification code
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-6">
            {/* Error Message */}
            <div className="bg-muted rounded-lg p-4">
              <div className="text-center space-y-2">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium text-muted-foreground">
                  QR Code Generation Failed
                </h3>
                <p className="text-sm text-muted-foreground/80">
                  There was a problem connecting to our servers or generating
                  your unique QR code. This could be due to a temporary network
                  issue or server maintenance.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  window.location.reload(); // Manual reload to trigger loading
                }}
                className="w-full transition-all bg-gradient-to-r from-primary/70 to-primary hover:opacity-70"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => {
                  router.replace("/students/register");
                }}
                variant="outline"
                className="w-full dark:hover:bg-accent"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Registration
              </Button>
            </div>

            {/* Help Text */}
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Still having trouble?</strong> If this problem persists,
                please contact the registrar&apos;s office or try again in a few
                minutes. Your registration information has been saved
                successfully.
              </p>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                What you can do:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your internet connection</li>
                <li>Wait a few minutes and try again</li>
                <li>Clear your browser cache and reload</li>
                <li>Contact technical support if the issue continues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
