import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import Order from './src/models/order.model.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const onlineOrders = await Order.find({ paymentMethod: 'online' }).sort({ createdAt: -1 });
    console.log(`Found ${onlineOrders.length} online orders.`);
    for (const order of onlineOrders) {
      console.log(`ID: ${order._id}, Status: ${order.paymentStatus}, Razorpay ID: ${order.razorpayOrderId}, Created: ${order.createdAt}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
