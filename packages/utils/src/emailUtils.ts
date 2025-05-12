
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
