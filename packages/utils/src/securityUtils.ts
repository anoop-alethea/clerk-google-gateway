/**
 * Validate domains and URLs for security and CORS
 */

/**
 * Extract domain from URL
 * @param url The URL to extract domain from
 * @returns The domain or null if invalid URL
 */
export const extractDomain = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};

/**
 * Check if request origin is allowed based on CORS configuration
 * @param origin Request origin
 * @param allowedOrigins List of allowed origins
 * @returns Boolean indicating if origin is allowed
 */
export const isOriginAllowed = (
  origin: string | undefined,
  allowedOrigins: string[]
): boolean => {
  if (!origin) return false;
  
  // Check if the origin exactly matches any allowed origins
  if (allowedOrigins.includes(origin)) return true;
  
  // Check if origin is a subdomain of any allowed domains
  try {
    const originDomain = new URL(origin).hostname;
    return allowedOrigins.some(allowed => 
      originDomain === allowed ||
      originDomain.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
};

/**
 * Create CORS headers for a response
 * @param origin Request origin
 * @param allowedOrigins List of allowed origins
 * @returns Object with CORS headers
 */
export const createCorsHeaders = (
  origin: string | undefined,
  allowedOrigins: string[]
): Record<string, string> => {
  if (!origin || !isOriginAllowed(origin, allowedOrigins)) {
    return {};
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

/**
 * Get the currently configured Resend API status
 * This helps debug email sending issues
 */
export async function checkResendApiStatus(): Promise<{
  isConfigured: boolean;
  status: string;
}> {
  try {
    // The Resend API key
    const RESEND_API_KEY = "re_AkjbVfeP_L67mSXrc7r8sDsF76jG5f1n7";
    
    if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
      return {
        isConfigured: false,
        status: "API key not configured"
      };
    }
    
    // Just check if we can get domains - this doesn't send an email
    // but verifies our API key works
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return {
        isConfigured: true,
        status: "API key valid and working"
      };
    } else {
      return {
        isConfigured: false,
        status: `API error: ${response.status} - ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      isConfigured: false,
      status: `Error checking API: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
