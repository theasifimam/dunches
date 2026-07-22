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
  if (source && source !== 'All') matchStage.source = source;

  // Execute all aggregations concurrently via Promise.all
  const [
    totalFeedback,
    metricsAgg,
    intentAgg,
    sourceAgg,
    ratingAgg,
    flavorAgg,
    monthlyAgg
  ] = await Promise.all([
    Feedback.countDocuments(matchStage),
    Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$overallRating' },
          totalFeedbacks: { $sum: 1 },
        },
      },
    ]),
    Feedback.aggregate([
      { $match: matchStage },
      { $match: { purchaseIntent: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$purchaseIntent',
          count: { $sum: 1 },
        },
      },
    ]),
    Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
    Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$overallRating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // 5. Flavor / Product Performance
    Feedback.aggregate([
      { $match: { ...matchStage, favoriteProduct: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$favoriteProduct',
          count: { $sum: 1 },
          avgRating: { $avg: '$overallRating' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: { path: '$productDoc', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          name: { $ifNull: ['$productDoc.name', 'Unknown Product'] },
          sku: '$productDoc.sku',
        },
      },
      { $sort: { count: -1 } },
    ]),
    // 6. Monthly / Seasonal Telemetry
    Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$overallRating' },
          positiveIntentCount: {
            $sum: { $cond: [{ $eq: ['$purchaseIntent', 'Yes'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  res.status(200).json(
    new ApiResponse('Feedback Analytics fetched', {
      totalFeedback,
      avgRating: metricsAgg.length > 0 ? Number(metricsAgg[0].avgRating.toFixed(1)) : 0,
      purchaseIntentData: intentAgg,
      sourceData: sourceAgg,
      ratingDistribution: ratingAgg,
      flavorPerformance: flavorAgg,
      monthlyTrends: monthlyAgg,
    })
  );
});
