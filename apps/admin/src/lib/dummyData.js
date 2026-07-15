// Rich, premium dummy data for makhāna Admin Console showcasing

export const DUMMY_DASHBOARD_METRICS = {
  totalRevenue: 248950,
  growth: 18.4,
  activeOrders: 14,
  newCustomers: 28,
  customerGrowth: 22.5,
  monthlyRevenue: [45, 58, 62, 50, 78, 85, 92, 88, 95, 105, 115, 128],
  monthLabels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  recentOrders: [
    { id: 'ORD-8924', customer: 'Aarav Mehta', amount: 3450.00, status: 'placed', time: '5 mins ago' },
    { id: 'ORD-8921', customer: 'Priyanka Sen', amount: 185.50, status: 'delivered', time: '1 hour ago' },
    { id: 'ORD-8919', customer: 'Rohan Gupta', amount: 560.00, status: 'delivered', time: '3 hours ago' },
    { id: 'ORD-8918', customer: 'Ananya Roy', amount: 210.00, status: 'placed', time: '4 hours ago' },
    { id: 'ORD-8915', customer: 'Kabir Kapoor', amount: 425.00, status: 'delivered', time: '1 day ago' }
  ]
};

export const DUMMY_ORDERS = [
  {
    _id: 'ord_66601f01de11a12345678901',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    user: { name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com' },
    items: [{ qty: 2 }, { qty: 1 }],
    finalAmount: 3450.00,
    orderStatus: 'placed',
    paymentStatus: 'pending',
    paymentMethod: 'UPI'
  },
  {
    _id: 'ord_66601f01de11a12345678902',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    user: { name: 'Priyanka Sen', email: 'priyanka.sen@yahoo.com' },
    items: [{ qty: 1 }],
    finalAmount: 185.50,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Card'
  },
  {
    _id: 'ord_66601f01de11a12345678903',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    user: { name: 'Rohan Gupta', email: 'rohan.gupta@outlook.com' },
    items: [{ qty: 3 }, { qty: 2 }],
    finalAmount: 560.00,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI'
  },
  {
    _id: 'ord_66601f01de11a12345678904',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    user: { name: 'Ananya Roy', email: 'ananya.roy@gmail.com' },
    items: [{ qty: 1 }, { qty: 1 }],
    finalAmount: 210.00,
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI'
  },
  {
    _id: 'ord_66601f01de11a12345678905',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    user: { name: 'Kabir Kapoor', email: 'kabir.k@gmail.com' },
    items: [{ qty: 4 }],
    finalAmount: 425.00,
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Card'
  },
  {
    _id: 'ord_66601f01de11a12345678906',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    user: { name: 'Vikram Singh', email: 'vikram.singh@gmail.com' },
    items: [{ qty: 2 }],
    finalAmount: 310.00,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'COD'
  },
  {
    _id: 'ord_66601f01de11a12345678907',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    user: { name: 'Meera Nair', email: 'meera.nair@icloud.com' },
    items: [{ qty: 1 }],
    finalAmount: 145.00,
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'UPI'
  }
];

export const DUMMY_USERS = [
  {
    _id: 'user_000000000000000000000001',
    avatar: null,
    name: 'Aarav Mehta',
    email: 'aarav.mehta@gmail.com',
    role: 'admin',
    isEmailVerified: true,
    createdAt: '2025-01-15T10:00:00.000Z',
    isActive: true
  },
  {
    _id: 'user_000000000000000000000002',
    avatar: null,
    name: 'Priyanka Sen',
    email: 'priyanka.sen@yahoo.com',
    role: 'moderator',
    isEmailVerified: true,
    createdAt: '2025-02-20T11:30:00.000Z',
    isActive: true
  },
  {
    _id: 'user_000000000000000000000003',
    avatar: null,
    name: 'Rohan Gupta',
    email: 'rohan.gupta@outlook.com',
    role: 'user',
    isEmailVerified: true,
    createdAt: '2025-03-05T09:15:00.000Z',
    isActive: true
  },
  {
    _id: 'user_000000000000000000000004',
    avatar: null,
    name: 'Ananya Roy',
    email: 'ananya.roy@gmail.com',
    role: 'user',
    isEmailVerified: false,
    createdAt: '2025-04-12T14:20:00.000Z',
    isActive: false
  },
  {
    _id: 'user_000000000000000000000005',
    avatar: null,
    name: 'Kabir Kapoor',
    email: 'kabir.k@gmail.com',
    role: 'moderator',
    isEmailVerified: true,
    createdAt: '2025-05-18T16:45:00.000Z',
    isActive: true
  },
  {
    _id: 'user_000000000000000000000006',
    avatar: null,
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    role: 'user',
    isEmailVerified: true,
    createdAt: '2025-06-01T12:00:00.000Z',
    isActive: true
  }
];

export const DUMMY_SUBSCRIBERS = [
  {
    _id: 'sub_000000000000000000000001',
    email: 'mindful.snacker@gmail.com',
    isActive: true,
    createdAt: '2025-01-20T10:00:00.000Z'
  },
  {
    _id: 'sub_000000000000000000000002',
    email: 'makhanafan@outlook.com',
    isActive: true,
    createdAt: '2025-02-22T14:30:00.000Z'
  },
  {
    _id: 'sub_000000000000000000000003',
    email: 'organicwellness@gmail.com',
    isActive: true,
    createdAt: '2025-03-10T09:00:00.000Z'
  },
  {
    _id: 'sub_000000000000000000000004',
    email: 'healthyeats@gmail.com',
    isActive: false,
    createdAt: '2025-04-05T16:15:00.000Z'
  },
  {
    _id: 'sub_000000000000000000000005',
    email: 'care@makhana.wellness',
    isActive: true,
    createdAt: '2025-05-12T11:20:00.000Z'
  }
];

export const DUMMY_BANNERS = [
  {
    id: 'ban_000000000000000000000001',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    title: 'Monsoon Mindful Snacking Season',
    status: 'Active',
    placement: 'Hero Banner',
    clicks: 1420,
    expiry: '2026-08-31T23:59:59.000Z'
  },
  {
    id: 'ban_000000000000000000000002',
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&w=800&q=80',
    title: 'Organic Sugarcane Gud Makhana Launch',
    status: 'Active',
    placement: 'Hero Banner',
    clicks: 840,
    expiry: '2026-07-15T23:59:59.000Z'
  },
  {
    id: 'ban_000000000000000000000003',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    title: 'Wellness Assortment Gifting Kits',
    status: 'Scheduled',
    placement: 'Sidebar Banner',
    clicks: 0,
    expiry: '2026-09-30T23:59:59.000Z'
  }
];

export const DUMMY_PRODUCTS = [
  {
    _id: 'prod_000000000000000000000001',
    name: 'Classic Himalayan Pink Salt Makhāna',
    sku: 'MKH-CPS-01',
    category: { name: 'Classic' },
    stock: 45,
    price: 120.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000002',
    name: 'Smoked Chili & Zesty Lime Makhāna',
    sku: 'MKH-SCL-02',
    category: { name: 'Spicy' },
    stock: 28,
    price: 135.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000003',
    name: 'Toasted Sesame & Black Pepper Makhāna',
    sku: 'MKH-TSB-03',
    category: { name: 'Savory' },
    stock: 32,
    price: 130.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000004',
    name: 'Organic Jaggery & Fennel Seed Makhāna',
    sku: 'MKH-OJF-04',
    category: { name: 'Sweet' },
    stock: 15,
    price: 150.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000005',
    name: 'Cooling Mint & Mountain Herb Makhāna',
    sku: 'MKH-CMM-05',
    category: { name: 'Savory' },
    stock: 40,
    price: 130.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000006',
    name: 'Creamy Cheddar & Basil Dust Makhāna',
    sku: 'MKH-CCB-06',
    category: { name: 'Savory' },
    stock: 12,
    price: 145.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800']
  },
  {
    _id: 'prod_000000000000000000000007',
    name: 'Wellness Assortment Makhāna Box',
    sku: 'MKH-WAB-07',
    category: { name: 'Assortments' },
    stock: 25,
    price: 499.00,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800']
  }
];
