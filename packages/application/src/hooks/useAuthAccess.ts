
import { useEffect } from "react";
import { useAuth } from "@monorepo/infrastructure";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthUseCase } from "../useCases/AuthUseCase";
import { AuthorizationService } from "@monorepo/domain";
import { authConfig } from "@monorepo/infrastructure";

export const useAuthAccess = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authorizationService = new AuthorizationService(authConfig);
    const authUseCase = new AuthUseCase(authorizationService);
    
    const accessResult = authUseCase.verifyUserAccess(user);
    
    if (!accessResult.authorized && accessResult.reason) {
      toast.error(accessResult.reason);
      signOut().then(() => navigate('/login'));
    }
  }, [user, signOut, navigate]);

  return { user };
};
