import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ResultMessage({
  success,
  message,
  onClose,
}: {
  success: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {success ? (
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      ) : (
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2">
        {success ? "Success" : "Error"}
      </h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={onClose}>{success ? "Close" : "Try Again"}</Button>
    </div>
  );
}
