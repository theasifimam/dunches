import Banner from '../models/banner.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';


// GET /api/v1/banners
export const getBanners = asyncHandler(async (req, res) => {
    const { status, placement } = req.query;

    const filter = {};
    if (status) filter['status'] = status;
    if (placement) filter['placement'] = placement;

    const banners = await Banner.find(filter)
        .populate('linkedProduct', 'name slug images price discount')
        .sort('-createdAt');
    res.status(200).json(new ApiResponse('Banners fetched successfully', banners));
});

// GET /api/v1/banners/:id
export const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params['id'])
        .populate('linkedProduct', 'name slug images price discount');
    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner fetched', banner));
});

// POST /api/v1/banners (admin)
export const createBanner = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
    } else if (data.imageUrl) {
        // Product image URL passed directly (offer banners linked to a product)
        data.image = data.imageUrl;
        delete data.imageUrl;
    }

    if (!data.image) {
        throw new ApiError(400, 'Image is required');
    }

    // Parse filterConfig if sent as JSON string
    if (data.filterConfig && typeof data.filterConfig === 'string') {
        try {
            data.filterConfig = JSON.parse(data.filterConfig);
        } catch {
            data.filterConfig = {};
        }
    }

    // Handle linkedProduct — set to null if empty string
    if (!data.linkedProduct || data.linkedProduct === '') {
        data.linkedProduct = null;
    }

    const banner = await Banner.create(data);
    const populated = await banner.populate('linkedProduct', 'name slug images price discount');
    res.status(201).json(new ApiResponse('Banner created', populated));
});

// PUT /api/v1/banners/:id (admin)
export const updateBanner = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
    } else if (data.imageUrl) {
        // Product image URL passed directly
        data.image = data.imageUrl;
        delete data.imageUrl;
    }

    // Parse filterConfig if sent as JSON string
    if (data.filterConfig && typeof data.filterConfig === 'string') {
        try {
            data.filterConfig = JSON.parse(data.filterConfig);
        } catch {
            data.filterConfig = {};
        }
    }

    // Handle linkedProduct — set to null if empty string
    if (!data.linkedProduct || data.linkedProduct === '') {
        data.linkedProduct = null;
    }

    const banner = await Banner.findByIdAndUpdate(req.params['id'], data, {
        new: true,
        runValidators: true,
    }).populate('linkedProduct', 'name slug images price discount');

    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner updated', banner));
});

// DELETE /api/v1/banners/:id (admin)
export const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findByIdAndDelete(req.params['id']);
    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner deleted', null));
});
