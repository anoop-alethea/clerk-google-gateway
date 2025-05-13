
export interface AuthorizationRules {
  allowedDomains: string[];
  allowedEmails: string[];
}

export class AuthorizationService {
  private rules: AuthorizationRules;

  constructor(rules: AuthorizationRules) {
    this.rules = rules;
  }

  isAuthorized(email: string): boolean {
    if (!email) return false;
    
    // Check if the email is explicitly allowed
    if (this.rules.allowedEmails.includes(email)) {
      return true;
    }
    
    // Check if the domain is allowed
    const domain = email.split('@')[1];
    if (domain && this.rules.allowedDomains.includes(domain)) {
      return true;
    }
    
    return false;
  }
}
