
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { isAllowedDomain } from "../../../web/src/config/env";

/**
 * Hook to redirect the user to the Docusaurus app with a secure Clerk JWT.
 */
export const useClerkTokenRedirect = () => {
  const { getToken } = useAuth();

  const redirectToDocusaurus = async (
    docusaurusUrl: string,
    template = "docusaurus"
  ): Promise<void> => {
    try {
      // Validate target domain for security
      if (!isAllowedDomain(docusaurusUrl)) {
        toast.error("Redirect blocked: Domain not in allowed list");
        throw new Error(`Domain security error: ${new URL(docusaurusUrl).hostname} is not in allowed domains list`);
      }

      const token = await getToken({ template });

      if (!token) {
        throw new Error(`JWT not generated for template: ${template}`);
      }

      const url = `${docusaurusUrl}?token=${encodeURIComponent(token)}`;
      window.location.href = url;
    } catch (error) {
      console.error("🔐 Clerk JWT generation or redirect failed:", error);
      throw error;
    }
  };

  return { redirectToDocusaurus };
};
