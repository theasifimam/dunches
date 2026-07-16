import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/notifications  (admin)
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', type, isRead } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (type && type !== 'all') filter.type = type;
  if (isRead !== undefined && isRead !== '') filter.isRead = isRead === 'true';

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort('-createdAt').skip(skip).limit(limitNum),
    Notification.countDocuments(filter),
    Notification.countDocuments({ isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse('Notifications fetched', {
      notifications,
      unreadCount,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// GET /api/v1/notifications/unread-count  (admin)
export const getUnreadCount = asyncHandler(async (_req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  res.status(200).json(new ApiResponse('Unread count fetched', { count }));
});

// PATCH /api/v1/notifications/:id/read  (admin)
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params['id'],
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse('Notification marked as read', notification));
});

// PATCH /api/v1/notifications/read-all  (admin)
export const markAllAsRead = asyncHandler(async (_req, res) => {
  const result = await Notification.updateMany({ isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse('All notifications marked as read', { updated: result.modifiedCount }));
});

// DELETE /api/v1/notifications/:id  (admin)
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params['id']);
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse('Notification deleted', null));
});

// DELETE /api/v1/notifications/clear-all  (admin)
export const clearAllNotifications = asyncHandler(async (_req, res) => {
  const result = await Notification.deleteMany({});
  res.status(200).json(new ApiResponse('All notifications cleared', { deleted: result.deletedCount }));
});
