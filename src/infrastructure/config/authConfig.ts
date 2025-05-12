
import { AuthorizationRules } from "../../domain/services/AuthorizationService";

// This configuration can be moved to environment variables or a config file
export const authConfig: AuthorizationRules = {
  allowedDomains: ["gmail.com"],
  // You can add specific allowed emails here
  allowedEmails: []
};
