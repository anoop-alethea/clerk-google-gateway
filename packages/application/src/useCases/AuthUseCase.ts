
import { User } from "@supabase/supabase-js";
import { AuthorizationService } from "@monorepo/domain";

export class AuthUseCase {
  private authorizationService: AuthorizationService;

  constructor(authorizationService: AuthorizationService) {
    this.authorizationService = authorizationService;
  }

  verifyUserAccess(user: User | null): { authorized: boolean; reason?: string } {
    if (!user) {
      return { authorized: false, reason: "User not authenticated" };
    }

    const isAuthorized = this.authorizationService.isAuthorized(user.email || '');
    
    if (!isAuthorized) {
      return { 
        authorized: false, 
        reason: "Unauthorized email domain. Only certain emails are allowed." 
      };
    }

    return { authorized: true };
  }
}
