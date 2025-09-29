export async function sendSMS(
  mobile: string,
  message: string
): Promise<boolean> {
  // For development - log to console
  console.log(`SMS to ${mobile}: ${message}`);

  // In production, integrate with your SMS provider:
  // - Twilio, MSG91, TextLocal, etc.

  return true;
}
