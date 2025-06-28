"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Check, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsLoading(false);
    alert("Login functionality is not implemented yet.");
  };

  const handleGoogleSignIn = async () => {
    // Handle Google OAuth login
    alert("Google Sign In clicked");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="shadow-xl border-0 rounded-3xl">
          <CardContent className="p-8 space-y-6">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <Check className="w-8 h-8 text-primary-foreground stroke-3" />
              </div>
              <h1 className="text-2xl font-semibold">Welcome to ReVAMS</h1>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-primary"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ussc.baybay@vsu.edu.ph"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 text-sm sm:text-base rounded-xl pl-12 bg-white/70 border-primary/20 focus:border-primary"
                    onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-primary"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 text-sm sm:text-base rounded-xl pl-12 pr-12 bg-white/70 border-primary/20 focus:border-primary"
                    onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-12 rounded-xl font-medium"
              >
                <Image
                  src="/google.svg"
                  alt="Google Icon"
                  width={15}
                  height={15}
                />
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            ReVAMS - Revenue and Attendance Management System <br />© 9KP
            Ventures 2025
          </p>
          <p className="text-sm text-muted-foreground/70">
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
