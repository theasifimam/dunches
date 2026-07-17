import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Load models
import Product from './src/models/product.model.js';
import User from './src/models/user.model.js';
import Order from './src/models/order.model.js';
import Notification from './src/models/notification.model.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Get a product
    const product = await Product.findOne({ isActive: true });
    if (!product) {
      console.log('No active products found.');
      return;
    }
    console.log('Found product:', product.name, 'Price:', product.price, 'Stock:', product.stock);

    // 2. Get a user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found.');
      return;
    }
    console.log('Found user:', user.name, 'Email:', user.email, 'Mobile:', user.mobile);

    // 3. Let's see the last 3 orders
    const orders = await Order.find().sort({ createdAt: -1 }).limit(3);
    console.log('Last 3 orders in DB:');
    for (const order of orders) {
      console.log(`Order ID: ${order._id}, Total: ${order.totalAmount}, PaymentMethod: ${order.paymentMethod}, RazorpayOrderId: ${order.razorpayOrderId}, CreatedAt: ${order.createdAt}`);
    }

    // 4. Let's see if there are any notifications
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(3);
    console.log('Last 3 notifications:');
    for (const n of notifs) {
      console.log(`Notif: ${n.title} - ${n.message}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
