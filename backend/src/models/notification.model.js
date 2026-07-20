import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['new_order', 'new_complaint', 'order_cancelled', 'payment_verified', 'low_stock'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    data: {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      reviewId: { type: Schema.Types.ObjectId, ref: 'Review' },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      amount: { type: Number },
      customerName: { type: String },
      customerEmail: { type: String },
      productName: { type: String },
      rating: { type: Number },
      comment: { type: String },
      orderStatus: { type: String },
      paymentMethod: { type: String },
      itemCount: { type: Number },
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);
