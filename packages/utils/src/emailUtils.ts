
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
    // Define the admin email
    const adminEmail = "anoop.appukuttan@aletheatech.com";
    
    // The Resend API key
    const RESEND_API_KEY = "re_AkjbVfeP_L67mSXrc7r8sDsF76jG5f1n7";
    
    // Prepare the email content
    const emailContent = {
      from: "Access Requests <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Access Request from ${data.fullName}`,
      html: `
        <h1>New Access Request Received</h1>
        <p>A new user has requested access to the platform:</p>
        <ul>
          <li><strong>Name:</strong> ${data.fullName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Company:</strong> ${data.company}</li>
          ${data.reason ? `<li><strong>Reason:</strong> ${data.reason}</li>` : ''}
        </ul>
        <p>Please review this request at your earliest convenience.</p>
      `
    };
    
    // Send the email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error sending email:', result);
      return false;
    }
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send access request notification:', error);
    return false;
  }
}
