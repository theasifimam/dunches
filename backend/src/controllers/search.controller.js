import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import Banner from '../models/banner.model.js';
import Feedback from '../models/feedback.model.js';

// GET /api/v1/search?q=query
export const globalSearch = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  const query = q.trim();

  if (!query) {
    return res.status(200).json(
      new ApiResponse('Empty search query', {
        products: [],
        orders: [],
        users: [],
        categories: [],
        banners: [],
        feedbacks: [],
      })
    );
  }

  const regex = new RegExp(query, 'i');

  // Find matching users first to link with orders
  const matchingUsers = await User.find({
    $or: [
      { name: regex },
      { email: regex },
      { mobile: regex },
      { role: regex },
    ],
  }).select('_id');
  const userIds = matchingUsers.map((u) => u._id);

  // Search in parallel across collections
  const [products, orders, users, categories, banners, feedbacks] = await Promise.all([
    Product.find({
      $or: [
        { name: regex },
        { sku: regex },
        { description: regex },
      ],
    })
      .populate('category', 'name slug')
      .limit(10)
      .select('name price sku stock category images isActive'),

    Order.find({
      $or: [
        { orderStatus: regex },
        { paymentStatus: regex },
        { paymentMethod: regex },
        { 'shippingAddress.fullName': regex },
        { 'shippingAddress.mobile': regex },
        { 'shippingAddress.city': regex },
        { user: { $in: userIds } },
      ],
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('finalAmount orderStatus paymentStatus createdAt user shippingAddress'),

    User.find({
      $or: [
        { name: regex },
        { email: regex },
        { mobile: regex },
        { role: regex },
      ],
    })
      .limit(10)
      .select('name email role avatar isActive mobile'),

    Category.find({
      $or: [
        { name: regex },
        { slug: regex },
      ],
    })
      .limit(8)
      .select('name slug isActive'),

    Banner.find({
      $or: [
        { title: regex },
        { placement: regex },
      ],
    })
      .limit(5)
      .select('title placement status image'),
      
    Feedback.find({
      $or: [
        { exactQuote: regex },
        { bestThing: regex },
        { worstThing: regex },
        { phoneNumber: regex },
        { executiveName: regex },
        { suggestedNewFlavor: regex },
        { comment: regex },
      ],
    })
      .limit(10)
      .select('source type overallRating phoneNumber executiveName comment exactQuote createdAt'),
  ]);

  res.status(200).json(
    new ApiResponse('Global search results', {
      products,
      orders,
      users,
      categories,
      banners,
      feedbacks,
    })
  );
});
