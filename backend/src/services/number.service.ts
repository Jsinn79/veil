import { query } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import type { PhoneNumberRow, MessageLogRow } from '../types/index.js';

// Twilio integration — stubbed until TWILIO_ env vars are set
let twilioClient: any = null;

function getTwilio() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID) {
    // Lazy-init Twilio when credentials are available
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

export async function rentNumber(userId: string, areaCode?: string): Promise<PhoneNumberRow> {
  const client = getTwilio();

  if (client) {
    // Real Twilio provisioning
    const searchResults = await client.availablePhoneNumbers('US').local.list({
      areaCode: areaCode || undefined,
      limit: 1,
    });

    if (searchResults.length === 0) {
      throw new NotFoundError('Available phone number');
    }

    const purchased = await client.incomingPhoneNumbers.create({
      phoneNumber: searchResults[0].phoneNumber,
      smsUrl: `${process.env.API_URL || 'http://localhost:3001'}/api/webhooks/twilio`,
    });

    const results = await query(
      `INSERT INTO phone_numbers (user_id, phone_number, twilio_sid)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, purchased.phoneNumber, purchased.sid],
    );
    return (results as any[])[0] as PhoneNumberRow;
  }

  // Mock provisioning for development without Twilio
  const mockNumber = `+1555${String(Math.floor(10000000 + Math.random() * 90000000))}`;
  const results = await query(
    `INSERT INTO phone_numbers (user_id, phone_number, twilio_sid)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, mockNumber, `PN_mock_${crypto.randomUUID().slice(0, 8)}`],
  );
  return (results as any[])[0] as PhoneNumberRow;
}

export async function listNumbers(userId: string): Promise<PhoneNumberRow[]> {
  const results = await query(
    `SELECT * FROM phone_numbers
     WHERE user_id = $1 AND released_at IS NULL
     ORDER BY created_at DESC`,
    [userId],
  );
  return results as PhoneNumberRow[];
}

export async function releaseNumber(userId: string, numberId: string): Promise<void> {
  const results = await query(
    `UPDATE phone_numbers SET released_at = NOW(), is_active = false
     WHERE id = $1 AND user_id = $2 AND released_at IS NULL
     RETURNING id`,
    [numberId, userId],
  );
  if ((results as any[]).length === 0) throw new NotFoundError('Phone number');
}

export async function getMessageLogs(userId: string, numberId: string): Promise<MessageLogRow[]> {
  // Verify number belongs to user
  const numbers = await query(
    'SELECT id FROM phone_numbers WHERE id = $1 AND user_id = $2 AND released_at IS NULL',
    [numberId, userId],
  );
  if ((numbers as any[]).length === 0) throw new NotFoundError('Phone number');

  const results = await query(
    `SELECT * FROM message_logs WHERE phone_number_id = $1 ORDER BY created_at DESC LIMIT 100`,
    [numberId],
  );
  return results as MessageLogRow[];
}

import crypto from 'crypto';