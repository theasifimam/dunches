import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
import User from './src/models/user.model.js';
import Product from './src/models/product.model.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Get or create a test user
    let user = await User.findOne({ email: 'test_user_debug@dunches.com' });
    if (!user) {
      user = await User.create({
        name: 'Debugger User',
        email: 'test_user_debug@dunches.com',
        mobile: '+919999999999',
        password: 'Password123!',
      });
      console.log('Created debug user.');
    } else {
      console.log('Found debug user.');
    }

    // 2. Generate token
    const secret = process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET.replace(/^["']|["']$/g, '').trim() : 'jwt@dunches@2025';
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: '1h' }
    );
    console.log('Generated JWT Token using secret.');

    // 3. Get a product
    const product = await Product.findOne({ isActive: true });
    if (!product) {
      console.log('No active products found.');
      return;
    }
    console.log('Using product:', product.name, '_id:', product._id);

    // 4. Build shipping address
    const shippingAddress = {
      fullName: 'Debug User',
      line1: '123 Test Street',
      line2: 'Suite 4',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      mobile: '9999999999',
    };

    // 5. Build order items
    const items = [
      {
        productId: product._id.toString(),
        name: product.name,
        qty: 1,
      }
    ];

    // Test COD payment method first
    console.log('\n--- Testing COD Order Placement ---');
    let res = await fetch('https://dunchesbackend.mazlis.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: 'cod',
        items,
      }),
    });

    console.log('COD response status:', res.status);
    console.log('COD response body:', await res.text());

    // Test Online payment method
    console.log('\n--- Testing Online Order Placement ---');
    res = await fetch('https://dunchesbackend.mazlis.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: 'online',
        items,
      }),
    });

    console.log('Online response status:', res.status);
    console.log('Online response body:', await res.text());

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
