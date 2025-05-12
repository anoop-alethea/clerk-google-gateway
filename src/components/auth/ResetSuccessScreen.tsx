
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ResetSuccessScreenProps {
  onBack: () => void;
}

const ResetSuccessScreen = ({ onBack }: ResetSuccessScreenProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg">Password reset complete</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Your password has been reset successfully.
        </p>
      </div>
      <Button 
        className="w-full" 
        onClick={onBack}
      >
        Back to login
      </Button>
    </div>
  );
};

export default ResetSuccessScreen;
