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
  },
  { timestamps: true }
);

export default mongoose.model('Banner', BannerSchema);
