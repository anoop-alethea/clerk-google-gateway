
import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthUseCase } from "../useCases/AuthUseCase";
import { AuthorizationService } from "../../domain/services/AuthorizationService";
import { ClerkAuthAdapter } from "../../infrastructure/services/ClerkAuthAdapter";
import { authConfig } from "../../infrastructure/config/authConfig";

export const useAuthAccess = () => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const authorizationService = new AuthorizationService(authConfig);
    const authUseCase = new AuthUseCase(authorizationService);
    const user = ClerkAuthAdapter.mapToUser(clerkUser);
    
    const accessResult = authUseCase.verifyUserAccess(user);
    
    if (!accessResult.authorized && accessResult.reason) {
      toast.error(accessResult.reason);
      signOut().then(() => navigate('/login'));
    }
  }, [clerkUser, signOut, navigate]);

  return { user: clerkUser ? ClerkAuthAdapter.mapToUser(clerkUser) : null };
};
