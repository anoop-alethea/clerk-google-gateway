
/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extracts the domain part from an email address
 * @param email Full email address
 * @returns Domain portion of the email (after @)
 */
export function getEmailDomain(email: string): string | null {
  if (!isValidEmail(email)) return null;
  return email.split('@')[1];
}

/**
 * Masks an email address for privacy (e.g., j******e@example.com)
 * @param email The email to mask
 * @returns Masked email address
 */
export function maskEmail(email: string): string {
  if (!isValidEmail(email)) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  const maskedUsername = `${firstChar}${'*'.repeat(username.length - 2)}${lastChar}`;
  
  return `${maskedUsername}@${domain}`;
}

interface AccessRequestData {
  fullName: string;
  email: string;
  company: string;
  reason?: string;
}

/**
 * Generates a unique idempotency key for email requests
 * @returns Unique string to use as idempotency key
 */
function generateIdempotencyKey(data: AccessRequestData): string {
  const timestamp = new Date().getTime();
  return `access_request_${data.email}_${timestamp}`;
}

/**
 * Sends a notification to administrators about new access requests
 * @param data Access request data including user information
 * @returns Promise resolving to a boolean indicating success
 */
export async function sendAccessRequestNotification(data: AccessRequestData): Promise<boolean> {
  // Log the request
  console.log('Access request received:', data);
  
  // Validate email
  if (!isValidEmail(data.email)) {
    console.error('Invalid email format:', data.email);
    return false;
  }

  try {
    // Define the admin email - Make sure this is correct
    const adminEmail = "anoop.appukuttan@aletheatech.com";
    
    // The Resend API key
    const RESEND_API_KEY = "re_AkjbVfeP_L67mSXrc7r8sDsF76jG5f1n7";
    
    // Generate a unique idempotency key to prevent duplicate emails
    const idempotencyKey = generateIdempotencyKey(data);
    
    // Prepare the email content with improved HTML formatting
    const emailContent = {
      from: "Access Requests <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Access Request from ${data.fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { padding: 20px; max-width: 600px; margin: 0 auto; }
              h1 { color: #4a5568; }
              ul { padding-left: 20px; }
              li { margin-bottom: 8px; }
              .highlight { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New Access Request Received</h1>
              <p>A new user has requested access to the platform:</p>
              <ul>
                <li><span class="highlight">Name:</span> ${data.fullName}</li>
                <li><span class="highlight">Email:</span> ${data.email}</li>
                <li><span class="highlight">Company:</span> ${data.company}</li>
                ${data.reason ? `<li><span class="highlight">Reason:</span> ${data.reason}</li>` : ''}
              </ul>
              <p>Please review this request at your earliest convenience.</p>
            </div>
          </body>
        </html>
      `,
      // Adding text version as a fallback for email clients that don't support HTML
      text: `
New Access Request Received

A new user has requested access to the platform:

Name: ${data.fullName}
Email: ${data.email}
Company: ${data.company}
${data.reason ? `Reason: ${data.reason}` : ''}

Please review this request at your earliest convenience.
      `,
      tags: [
        {
          name: "request_type",
          value: "access_request"
        }
      ]
    };
    
    // Add additional debugging
    console.log('Sending email to:', adminEmail);
    console.log('Using Resend API key:', `${RESEND_API_KEY.substring(0, 5)}...`);
    
    // Send the email via Resend API with improved error handling
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(emailContent)
    });
    
    // Get response data
    const responseData = await response.text();
    
    // Try to parse JSON response if possible
    let result;
    try {
      result = JSON.parse(responseData);
    } catch (e) {
      result = { raw: responseData };
    }
    
    // Check if request was successful
    if (!response.ok) {
      console.error('Error sending email. Status:', response.status);
      console.error('Response:', result);
      return false;
    }
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send access request notification:', error);
    return false;
  }
}
