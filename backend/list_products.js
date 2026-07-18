import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import Product from './src/models/product.model.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const products = await Product.find();
    console.log('All Products in DB:');
    for (const p of products) {
      console.log(`_id: ${p._id}, Name: ${p.name}, Slug: ${p.slug}, Price: ${p.price}, Stock: ${p.stock}, IsActive: ${p.isActive}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
