import AdminLoginForm from "@/components/admin-login-form";
import Copyright from "@/components/copyright";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminLoginForm />
        <Copyright />
      </div>
    </div>
  );
}
