
import { toast } from "sonner";

interface AccessRequestData {
  fullName: string;
  email: string;
  company: string;
  reason?: string;
}

export const sendAccessRequestNotification = async (data: AccessRequestData): Promise<boolean> => {
  try {
    // In a real implementation, this would use an API call to your backend
    // For now, let's log the data and simulate success
    console.log("Would send email to admin with details:", {
      to: "anoop.appukuttan@aletheatech.com",
      subject: "New access request",
      body: `
        New access request details:
        Name: ${data.fullName}
        Email: ${data.email}
        Company: ${data.company}
        Reason: ${data.reason || "Not provided"}
      `
    });
    
    // Simulate success
    return true;
  } catch (error) {
    console.error("Error sending access request notification:", error);
    return false;
  }
};
