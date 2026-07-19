import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';


// GET /api/v1/dashboard/metrics
export const getDashboardMetrics = asyncHandler(async (req, res) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const last12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Fetch all metrics concurrently to drastically reduce DB roundtrip times
    const [
        totalRevenueAggregation,
        currentMonthRevenueAgg,
        previousMonthRevenueAgg,
        activeOrders,
        activeBookings,
        todayBookingsCount,
        activeTableBookings,
        newCustomers,
        previousMonthCustomers,
        monthlyAgg,
        recentOrders
    ] = await Promise.all([
        Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        Order.aggregate([
            { $match: { orderStatus: 'delivered', createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        Order.aggregate([
            { $match: { orderStatus: 'delivered', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        Order.countDocuments({
            orderStatus: { $in: ['placed', 'confirmed', 'processing', 'shipped'] }
        }),
        Booking.countDocuments({
            bookingStatus: 'confirmed',
            date: { $gte: startOfToday }
        }),
        Booking.countDocuments({
            date: { $gte: startOfToday, $lte: endOfToday }
        }),
        Booking.find({
            bookingStatus: 'confirmed',
            date: { $gte: startOfToday, $lte: endOfToday }
        }).select('tableId'),
        User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        }),
        User.countDocuments({
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        }),
        Order.aggregate([
            { $match: { orderStatus: 'delivered', createdAt: { $gte: last12Months } } },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    total: { $sum: "$finalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]),
        Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
    ]);

    const totalRevenue = totalRevenueAggregation[0]?.total || 0;
    const currentMonthRevenue = currentMonthRevenueAgg[0]?.total || 0;
    const previousMonthRevenue = previousMonthRevenueAgg[0]?.total || 0;

    // Calculate Growth %
    let growth = 0;
    if (previousMonthRevenue > 0) {
        growth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
        growth = 100; // infinite growth if prev month was 0
    }

    const uniqueBookedTables = new Set(activeTableBookings.map(b => b.tableId));
    const totalTablesCount = 12; // 5 window seats, 4 center hall, 3 booths
    const tableOccupancyRate = Math.round((uniqueBookedTables.size / totalTablesCount) * 100);

    let customerGrowth = 0;
    if (previousMonthCustomers > 0) {
        customerGrowth = ((newCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;
    } else if (newCustomers > 0) {
        customerGrowth = 100;
    }

    // The chart data needs to be 12 elements long, representing the last 12 months including current month at the end
    const monthlyRevenue = Array(12).fill(0);
    const currentMonthIndex = now.getMonth(); // 0-11

    monthlyAgg.forEach(item => {
        // Determine how many months ago this was
        const itemMonthIndex = item._id.month - 1; // 0-11
        let monthsAgo = currentMonthIndex - itemMonthIndex;
        if (monthsAgo < 0) {
            monthsAgo += 12; // It was from last year
        }

        // Position in array: 11 is current month, 0 is 11 months ago
        const arrayPosition = 11 - monthsAgo;
        if (arrayPosition >= 0 && arrayPosition < 12) {
            monthlyRevenue[arrayPosition] = item.total;
        }
    });

    // Calculate highest month to output relative percentages for the chart
    const maxMonthRev = Math.max(...monthlyRevenue, 1); // avoid div by 0
    const monthlyRevenuePercentages = monthlyRevenue.map(rev => Math.round((rev / maxMonthRev) * 100));

    // Generate month labels
    const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
        let m = currentMonthIndex - i;
        if (m < 0) m += 12;
        monthLabels.push(monthNames[m]);
    }

    const formattedRecentOrders = recentOrders.map((order) => {
        // Calculate time ago
        const diffMs = now.getTime() - order.createdAt.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHours / 24);

        let timeAgo = '';
        if (diffMins < 60) timeAgo = `${diffMins} mins ago`;
        else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
        else if (diffDays === 1) timeAgo = `1 day ago`;
        else timeAgo = `${diffDays} days ago`;

        return {
            id: `#${order._id.toString().substring(order._id.toString().length - 8)}`.toUpperCase(),
            customer: order.user?.name || 'Unknown User',
            amount: order.finalAmount,
            status: order.orderStatus,
            time: timeAgo,
            rawDate: order.createdAt
        };
    });

    res.status(200).json(
        new ApiResponse('Dashboard metrics fetched', {
            totalRevenue,
            growth,
            activeOrders,
            newCustomers,
            customerGrowth,
            monthlyRevenue: monthlyRevenuePercentages,
            monthLabels,
            recentOrders: formattedRecentOrders,
            activeBookings,
            todayBookingsCount,
            tableOccupancyRate
        })
    );
});
