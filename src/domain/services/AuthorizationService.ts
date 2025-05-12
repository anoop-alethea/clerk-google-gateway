
export interface AuthorizationRules {
  allowedDomains?: string[];
  allowedEmails?: string[];
}

export class AuthorizationService {
  private rules: AuthorizationRules;

  constructor(rules: AuthorizationRules) {
    this.rules = rules;
  }

  isAuthorized(email: string): boolean {
    if (!email) return false;
    
    // Check if email is in allowed emails list
    if (this.rules.allowedEmails?.includes(email)) {
      return true;
    }
    
    // Check if email domain is in allowed domains list
    if (this.rules.allowedDomains && this.rules.allowedDomains.length > 0) {
      return this.rules.allowedDomains.some(domain => 
        email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
      );
    }
    
    // If no rules are specified, all users are authorized
    // Change this if you want stricter default behavior
    return true;
  }
}
