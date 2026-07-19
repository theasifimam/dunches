import mongoose, { Schema } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['admin', 'public'],
      required: true,
      default: 'admin',
    },
    // Common fields
    source: {
      type: String,
      enum: [
        'Sampling',
        'Retail Store',
        'Website',
        'QR',
        'Amazon',
        'Blinkit',
        'WhatsApp',
        'Instagram',
        'Other',
      ],
      required: true,
      default: 'Other',
    },
    productsTasted: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    favoriteProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
    overallRating: { type: Number, min: 1, max: 10, required: true }, // 1-5 for public, 1-10 for admin
    purchaseIntent: {
      type: String,
      enum: ['Yes', 'Maybe', 'No'],
    },
    wouldRecommend: { type: Boolean },
    
    // Admin / Detailed Fields
    samplingLocation: { type: String, trim: true },
    societyEventName: { type: String, trim: true },
    executiveName: { type: String, trim: true },
    customerAgeGroup: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    firstTimeMakhana: { type: Boolean },
    purchasedToday: { type: Boolean },
    purchasedSKU: { type: String, trim: true },
    expectedPrice: { type: Number, min: 0 },
    bestThing: { type: String, trim: true },
    worstThing: { type: String, trim: true },
    exactQuote: { type: String, trim: true },
    suggestedNewFlavor: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    photoUrl: { type: String },

    // Public Form specific fields (if any differ)
    comment: { type: String, trim: true }, // "One optional comment" for public
  },
  { timestamps: true }
);

// Indexes for analytics
FeedbackSchema.index({ source: 1, createdAt: -1 });
FeedbackSchema.index({ type: 1, createdAt: -1 });
FeedbackSchema.index({ overallRating: 1 });
FeedbackSchema.index({ favoriteProduct: 1 });

export default mongoose.model('Feedback', FeedbackSchema);
