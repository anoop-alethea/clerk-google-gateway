
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
    // Make sure this template is set up in your Clerk dashboard
    const token = await getToken({ template: "WiCheckDocumentation" });
    
    return `${docusaurusBaseUrl}?token=${token}`;
  };
  
  return {
    getDocusaurusUrl,
    isAuthenticated: true
  };
}
