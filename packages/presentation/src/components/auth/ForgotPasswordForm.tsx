
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { toast } from "sonner";
import EmailForm from "./EmailForm";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetSuccessScreen from "./ResetSuccessScreen";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

type PasswordResetStage = "email" | "reset" | "success";

const ForgotPasswordForm = ({ onBack, onSuccess }: ForgotPasswordFormProps) => {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<PasswordResetStage>("email");
  const [userEmail, setUserEmail] = useState("");
  
  const handleEmailSubmit = async (data: { email: string }) => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      setUserEmail(data.email);
      
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      
      setStage("reset");
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error sending password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (data: { code: string; password: string }) => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });
      
      setStage("success");
      toast.success("Password has been reset successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  switch (stage) {
    case "reset":
      return (
        <ResetPasswordForm 
          userEmail={userEmail}
          onSubmit={handleResetSubmit}
          onBack={() => setStage("email")}
          isLoading={isLoading}
        />
      );
    case "success":
      return (
        <ResetSuccessScreen 
          onBack={onBack}
        />
      );
    case "email":
    default:
      return (
        <EmailForm 
          onSubmit={handleEmailSubmit}
          onCancel={onBack}
          isLoading={isLoading}
        />
      );
  }
};

export default ForgotPasswordForm;
