
import { isValidEmail } from '@monorepo/utils';

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
    // In a real application, you would send an email to administrators
    // This is a mock implementation that always succeeds
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For development/demo purposes, we're just returning success
    // In production, this would connect to an email service API
    return true;
  } catch (error) {
    console.error('Failed to send access request notification:', error);
    return false;
  }
}
