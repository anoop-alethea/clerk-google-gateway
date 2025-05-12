
import { AuthorizationRules } from "../../domain/services/AuthorizationService";

// This configuration can be moved to environment variables or a config file
export const authConfig: AuthorizationRules = {
  // Add your authorized domains here
  allowedDomains: ["gmail.com", "yourdomain.com"],
  // You can add specific allowed emails here
  allowedEmails: ["specificuser@example.com"]
};

// URL to redirect to after successful authentication
export const POST_LOGIN_REDIRECT_URL = "https://your-private-application.com";
