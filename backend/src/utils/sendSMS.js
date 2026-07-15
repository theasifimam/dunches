import twilio from 'twilio';

/**
 * Dispatches an SMS using Twilio messaging services.
 * If credentials are missing or Twilio errors, falls back to logging the message in the console.
 * @param {string} to - Destination mobile number (with country code)
 * @param {string} body - Message content
 * @returns {Promise<boolean>}
 */
export const sendSMS = async (to, body) => {
  const accountSid = process.env.TWILIO_ACC_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    console.warn("[TWILIO WARNING] Twilio environment variables are missing. Falling back to local console log:");
    console.log(`\n======================================================`);
    console.log(`[SMS FALLBACK] To: ${to}`);
    console.log(`[SMS FALLBACK] Body: ${body}`);
    console.log(`======================================================\n`);
    return false;
  }

  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body,
      from,
      to,
    });
    console.log(`[TWILIO SUCCESS] SMS sent to ${to}, message SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`[TWILIO ERROR] Failed to deliver SMS to ${to}:`, error.message);
    console.log(`\n======================================================`);
    console.log(`[SMS FALLBACK] To: ${to}`);
    console.log(`[SMS FALLBACK] Body: ${body}`);
    console.log(`======================================================\n`);
    return false;
  }
};
