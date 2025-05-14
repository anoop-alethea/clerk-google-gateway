
// Application environment variables

interface EnvConfig {
  CLERK_PUBLISHABLE_KEY: string;
  DOCUSAURUS_SITE_URL: string;
  ALLOWED_REDIRECT_DOMAINS: string[];
}

/**
 * Access environment variables with validation
 */
export const env: EnvConfig = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  DOCUSAURUS_SITE_URL: import.meta.env.VITE_DOCUSAURUS_SITE_URL || 'http://localhost:3000',
  ALLOWED_REDIRECT_DOMAINS: import.meta.env.VITE_ALLOWED_REDIRECT_DOMAINS 
    ? import.meta.env.VITE_ALLOWED_REDIRECT_DOMAINS.split(',')
    : ['localhost:3000', 'localhost:8080']
};

// Validate required environment variables in development mode
if (import.meta.env.DEV) {
  const missingVars = [];
  
  if (!env.CLERK_PUBLISHABLE_KEY) {
    missingVars.push('VITE_CLERK_PUBLISHABLE_KEY');
  }
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Check if a URL's domain is in the allowed list
 * @param url URL to check
 * @returns boolean indicating if domain is allowed
 */
export const isAllowedDomain = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname + (urlObj.port ? `:${urlObj.port}` : '');
    
    return env.ALLOWED_REDIRECT_DOMAINS.some(domain => 
      hostname === domain || 
      hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
}
