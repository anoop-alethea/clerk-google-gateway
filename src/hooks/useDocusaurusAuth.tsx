
import { useAuth, useUser } from "@clerk/clerk-react";
import { env } from "../config/env";

/**
 * Hook to get the Docusaurus auth URL with token
 */
export function useDocusaurusAuth() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  
  // Base URL of your Docusaurus site from environment variables
  const docusaurusBaseUrl = env.DOCUSAURUS_SITE_URL;
  
  if (!isSignedIn || !user) {
    return {
      docusaurusUrl: null,
      isAuthenticated: false
    };
  }
  
  const getDocusaurusUrl = async () => {
    // Use Clerk's getToken method to get a JWT using the "WiCheckDocumentation" template
    const token = await getToken({ template: "WiCheckDocumentation" });
    
    return `${docusaurusBaseUrl}?token=${token}`;
  };
  
  return {
    getDocusaurusUrl,
    isAuthenticated: true
  };
}

// Remove the generateDocusaurusToken function since we're now using Clerk's JWT
