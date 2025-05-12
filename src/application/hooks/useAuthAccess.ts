
import { useEffect } from "react";
import { useAuth } from "@/infrastructure/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthUseCase } from "../useCases/AuthUseCase";
import { AuthorizationService } from "../../domain/services/AuthorizationService";
import { authConfig } from "../../infrastructure/config/authConfig";

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
