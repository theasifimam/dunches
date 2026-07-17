import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const cleanEnv = (val = '') => val.replace(/^["']|["']$/g, '').trim();

const key_id = cleanEnv(process.env.RAZOR_KEY_ID);
const key_secret = cleanEnv(process.env.RAZOR_KEY_SECRET);

console.log('Testing Razorpay keys:');
console.log('Key ID:', key_id);
console.log('Key Secret length:', key_secret.length);

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

try {
  const orders = await razorpay.orders.all({ count: 1 });
  console.log('Razorpay API connection successful!');
  console.log('Sample Order:', orders);
} catch (error) {
  console.error('Razorpay API connection failed:', error);
}
