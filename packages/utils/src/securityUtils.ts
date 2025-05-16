
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
  apiKey: string;
}> {
  try {
    // The Resend API key
    const RESEND_API_KEY = "re_AkjbVfeP_L67mSXrc7r8sDsF76jG5f1n7";
    
    // Log a masked version of the API key for debugging
    const maskedKey = RESEND_API_KEY ? 
      `${RESEND_API_KEY.substring(0, 5)}...${RESEND_API_KEY.substring(RESEND_API_KEY.length - 4)}` : 
      'not provided';
    console.log(`Checking Resend API with key: ${maskedKey}`);
    
    if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
      return {
        isConfigured: false,
        status: "API key not configured",
        apiKey: 'missing'
      };
    }
    
    // Just check if we can get domains - this doesn't send an email
    // but verifies our API key works
    console.log('Sending test request to Resend API to check key validity...');
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resend API test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Resend API test response data:', data);
      return {
        isConfigured: true,
        status: "API key valid and working",
        apiKey: 'valid'
      };
    } else {
      const errorText = await response.text();
      console.error('Resend API error response:', errorText);
      return {
        isConfigured: false,
        status: `API error: ${response.status} - ${response.statusText}. Details: ${errorText}`,
        apiKey: 'invalid'
      };
    }
  } catch (error) {
    console.error('Error checking Resend API:', error);
    return {
      isConfigured: false,
      status: `Error checking API: ${error instanceof Error ? error.message : String(error)}`,
      apiKey: 'error'
    };
  }
}
