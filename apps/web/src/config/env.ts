
// Application environment variables

interface EnvConfig {
  CLERK_PUBLISHABLE_KEY: string;
  DOCUSAURUS_SITE_URL: string;
}

/**
 * Access environment variables with validation
 */
export const env: EnvConfig = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  DOCUSAURUS_SITE_URL: import.meta.env.VITE_DOCUSAURUS_SITE_URL || 'http://localhost:3000'
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
