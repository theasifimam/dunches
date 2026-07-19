import mongoose from 'mongoose';
import Feedback from '../models/feedback.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// POST /api/v1/feedbacks
export const createFeedback = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  
  if (data.favoriteProduct === '') {
    delete data.favoriteProduct;
  }
  
  if (Array.isArray(data.productsTasted)) {
    data.productsTasted = data.productsTasted.filter((p) => p && p !== '');
  }

  const feedback = await Feedback.create(data);
  res.status(201).json(new ApiResponse('Feedback submitted successfully', feedback));
});

// GET /api/v1/feedbacks
export const getFeedbacks = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', type, source, startDate, endDate, sort = '-createdAt' } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (type) filter.type = type;
  if (source) filter.source = source;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .populate('favoriteProduct', 'name')
      .populate('productsTasted', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    Feedback.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse('Feedbacks fetched', {
      feedbacks,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// GET /api/v1/feedbacks/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, source } = req.query;

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  if (source) matchStage.source = source;

  // 1. Total KPI
  const totalFeedback = await Feedback.countDocuments(matchStage);

  // 2. Average Rating & Purchase Intent Distribution
  const metricsAgg = await Feedback.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$overallRating' },
        totalFeedbacks: { $sum: 1 },
      },
    },
  ]);

  const intentAgg = await Feedback.aggregate([
    { $match: matchStage },
    { $match: { purchaseIntent: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$purchaseIntent',
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. Source Breakdown
  const sourceAgg = await Feedback.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } }
  ]);
  
  // 4. Rating Distribution (1-10)
  const ratingAgg = await Feedback.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$overallRating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json(
    new ApiResponse('Feedback Analytics fetched', {
      totalFeedback,
      avgRating: metricsAgg.length > 0 ? Number(metricsAgg[0].avgRating.toFixed(1)) : 0,
      purchaseIntentData: intentAgg,
      sourceData: sourceAgg,
      ratingDistribution: ratingAgg
    })
  );
});
