import mongoose, { Schema } from 'mongoose';

const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    label: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    actionText: { type: String, trim: true, default: 'Shop Now' },
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ['announcement', 'offer'],
      default: 'offer',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Scheduled'],
      default: 'Active',
    },
    placement: {
      type: String,
      enum: ['Hero Slider', 'Mobile Promo', 'Both'],
      default: 'Both',
    },
    clicks: { type: Number, default: 0 },
    expiry: { type: Date },
    // Offer banners can be linked to a specific product (image sourced from product)
    linkedProduct: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    // Stores the admin's chosen filter configuration so it can be re-hydrated on edit
    filterConfig: {
      productType: { type: String, default: null },
      category: { type: String, default: null },
      flavorProfile: { type: String, default: null },
      minPrice: { type: Number, default: null },
      maxPrice: { type: Number, default: null },
      brand: { type: String, default: null },
      productSlug: { type: String, default: null },
      searchQuery: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', BannerSchema);
