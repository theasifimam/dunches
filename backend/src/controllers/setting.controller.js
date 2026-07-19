import Setting from '../models/setting.model.js';
import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/settings
export const getSetting = asyncHandler(async (req, res) => {
    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }
    res.status(200).json(new ApiResponse('Settings fetched successfully', setting));
});

// PUT /api/v1/settings (admin)
export const updateSetting = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    
    if (req.files) {
        if (req.files['previewImage'] && req.files['previewImage'][0]) {
            data.previewImage = `/uploads/${req.files['previewImage'][0].filename}`;
        }
        if (req.files['logo'] && req.files['logo'][0]) {
            data.logo = `/uploads/${req.files['logo'][0].filename}`;
        }
    } else if (req.file) {
        data.previewImage = `/uploads/${req.file.filename}`;
    }

    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }

    const updatedSetting = await Setting.findByIdAndUpdate(setting._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(new ApiResponse('Settings updated', updatedSetting));
});

// POST /api/v1/settings/contact
export const sendContactMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email and message' });
    }

    // Save as a notification for the admin
    await Notification.create({
        type: 'new_complaint',
        title: `Contact Message from ${name}`,
        message: message,
        data: {
            customerName: name,
            customerEmail: email
        }
    });

    res.status(200).json(new ApiResponse('Your message has been sent to the admin successfully', null));
});
