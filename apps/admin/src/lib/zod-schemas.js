import { z } from "zod";
export const ProductFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    slug: z.string().min(1, "Slug is required").lowercase().trim(),
    description: z.string().min(1, "Description is required"),
    brand: z.string().min(1, "Brand is required").trim(),
    sku: z.string().min(1, "SKU is required").toUpperCase().trim(),
    category: z.string().min(1, "Category is required"), // ObjectId as string
    type: z.enum(['makhana', 'chips', 'nuts', 'seeds', 'assortments', 'other']).default('makhana'),
    netWeight: z.coerce.number().min(0, "Weight must be at least 0"),
    ingredients: z.array(z.string()).default([]),
    shelfLife: z.string().default("6 Months"),
    flavorProfile: z.enum(['Classic', 'Savory', 'Spicy', 'Sweet', 'Assortments']).default('Classic'),
    nutritionalValues: z.object({
        calories: z.coerce.number().default(0),
        protein: z.coerce.number().default(0),
        carbohydrates: z.coerce.number().default(0),
        fat: z.coerce.number().default(0),
        fiber: z.coerce.number().default(0),
    }).optional(),
    images: z.array(z.string()).default([]),
    price: z.coerce.number().min(0, "Price must be at least 0"),
    discount: z.coerce.number().min(0).max(100).default(0),
    stock: z.coerce.number().min(0, "Stock must be at least 0").default(0),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});
export const AddressSchema = z.object({
    label: z.string().default('Home'),
    fullName: z.string().min(1, "Full name is required"),
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    country: z.string().default('India'),
    mobile: z.string().min(1, "Mobile number is required"),
    isDefault: z.boolean().default(false),
});
export const UserFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email").min(1, "Email is required").lowercase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    mobile: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.union([z.date(), z.string()]).optional(),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
    isEmailVerified: z.boolean().default(false),
    addresses: z.array(AddressSchema).default([]),
    avatar: z.string().optional(),
});
export const CategoryFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    slug: z.string().min(1, "Slug is required").lowercase().trim(),
    image: z.any().optional(),
    parent: z.string().nullable().default(null),
    isActive: z.boolean().default(true),
});
export const BannerFormSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required"),
    label: z.string().optional(),
    buttonLink: z.string().optional(),
    actionText: z.string().optional(),
    image: z.any().optional(), // Can be string URL or File
    type: z.enum(['offer', 'announcement']).default('offer'),
    status: z.enum(['Active', 'Inactive', 'Scheduled']).default('Active'),
    placement: z.enum(['Both', 'Hero Slider', 'Mobile Promo']).default('Both'),
    expiry: z.string().optional(),
    // Product picker (offer banners only)
    linkedProduct: z.string().optional().nullable(), // product _id
    // Filter builder fields — stored so they can be re-hydrated on edit
    filterConfig: z.object({
        productType: z.string().optional().nullable(),
        category: z.string().optional().nullable(),
        flavorProfile: z.string().optional().nullable(),
        minPrice: z.coerce.number().optional().nullable(),
        maxPrice: z.coerce.number().optional().nullable(),
        brand: z.string().optional().nullable(),
        productSlug: z.string().optional().nullable(),
        searchQuery: z.string().optional().nullable(),
    }).optional(),
});

