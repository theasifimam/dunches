import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type: {
      type: String,
      enum: ['makhana', 'chips', 'nuts', 'seeds', 'assortments', 'other'],
      required: true,
      default: 'makhana',
    },
    netWeight: { type: Number, required: true, default: 0 },
    ingredients: { type: [String], default: [] },
    shelfLife: { type: String, default: '6 Months' },
    flavorProfile: {
      type: String,
      enum: ['Classic', 'Savory', 'Spicy', 'Sweet', 'Assortments'],
      default: 'Classic',
    },
    nutritionalValues: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ type: 1, isActive: 1 });

export default mongoose.model('Product', ProductSchema);
