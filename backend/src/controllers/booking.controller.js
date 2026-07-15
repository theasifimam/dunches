import Booking from '../models/booking.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Seed bookings helper
const seedDummyBookings = async () => {
  const count = await Booking.countDocuments();
  if (count > 0) return;

  console.log('Seeding dummy restaurant bookings...');
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const mockBookings = [
    {
      name: 'Ayaan Ahmed',
      phone: '+91 98765 43210',
      date: today,
      time: '19:00',
      guests: 2,
      vehicle: 'Car',
      preOrder: true,
      tableId: 'W1',
      specialRequests: 'Window seat preferred, celebrating birthday',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingFee: 500,
    },
    {
      name: 'Priya Sharma',
      phone: '+91 91234 56789',
      date: today,
      time: '20:30',
      guests: 4,
      vehicle: 'None',
      preOrder: false,
      tableId: 'C2',
      specialRequests: 'Allergies to nuts',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingFee: 500,
    },
    {
      name: 'Vikram Malhotra',
      phone: '+91 88888 88888',
      date: today,
      time: '13:00',
      guests: 6,
      vehicle: 'Bus',
      preOrder: true,
      tableId: 'B1',
      specialRequests: 'Travelling with a tour group, need fast service',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      bookingFee: 500,
    },
    {
      name: 'Rohan Gupta',
      phone: '+91 77777 66666',
      date: tomorrow,
      time: '19:30',
      guests: 2,
      vehicle: 'Motorcycle',
      preOrder: false,
      tableId: 'W3',
      specialRequests: '',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingFee: 500,
    },
    {
      name: 'Meera Nair',
      phone: '+91 99999 11111',
      date: tomorrow,
      time: '21:00',
      guests: 5,
      vehicle: 'Car',
      preOrder: true,
      tableId: 'B2',
      specialRequests: 'Need extra chair for kid',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingFee: 500,
    },
    {
      name: 'Karan Singh',
      phone: '+91 82345 67890',
      date: today,
      time: '12:00',
      guests: 2,
      vehicle: 'Truck',
      preOrder: false,
      tableId: 'W2',
      specialRequests: '',
      paymentMethod: 'card',
      paymentStatus: 'failed',
      bookingStatus: 'cancelled',
      bookingFee: 500,
    },
  ];

  await Booking.insertMany(mockBookings);
  console.log('Dummy bookings seeded successfully');
};

// POST /api/v1/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { name, phone, date, time, guests, vehicle, preOrder, tableId, specialRequests, paymentMethod, paymentStatus } = req.body;

  if (!name || !phone || !date || !time || !guests || !tableId) {
    throw new ApiError(400, 'Required booking fields are missing');
  }

  // Create booking
  const booking = await Booking.create({
    user: req.user?.id || null, // Optional if anonymous guest
    name,
    phone,
    date: new Date(date),
    time,
    guests,
    vehicle,
    preOrder,
    tableId,
    specialRequests,
    paymentMethod,
    paymentStatus: paymentStatus || 'paid', // Default paid for mock integration
    bookingStatus: 'confirmed',
    bookingFee: 500,
  });

  res.status(201).json(new ApiResponse('Table booked successfully', booking));
});

// GET /api/v1/bookings/my
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).sort('-date -time');
  res.status(200).json(new ApiResponse('My bookings fetched', bookings));
});

// GET /api/v1/bookings (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  await seedDummyBookings(); // Automatically seed if database has zero bookings

  const { page = '1', limit = '20', status, date, search, tableId } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (status && status !== 'All Status' && status !== 'All') {
    filter['bookingStatus'] = status.toLowerCase();
  }

  if (tableId) {
    filter['tableId'] = tableId;
  }

  if (date) {
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
    filter['date'] = { $gte: startOfDay, $lte: endOfDay };
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter['$or'] = [{ name: searchRegex }, { phone: searchRegex }];
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort('-date -time').skip(skip).limit(limitNum),
    Booking.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse('All bookings fetched', {
      bookings,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// PATCH /api/v1/bookings/:id/status (admin)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (bookingStatus) booking.bookingStatus = bookingStatus;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  await booking.save();
  res.status(200).json(new ApiResponse('Booking status updated', booking));
});

// PATCH /api/v1/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // Verify ownership if not admin
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'moderator';
  const isOwner = req.user && booking.user && booking.user.toString() === req.user.id;

  // If request has user object, protect ownership. Otherwise allow public cancel (e.g. guest cancel via ID)
  if (req.user && !isAdmin && !isOwner) {
    throw new ApiError(403, 'Not authorized to cancel this booking');
  }

  booking.bookingStatus = 'cancelled';
  if (booking.paymentStatus === 'paid') {
    booking.paymentStatus = 'refunded';
  }

  await booking.save();
  res.status(200).json(new ApiResponse('Booking cancelled successfully', booking));
});
