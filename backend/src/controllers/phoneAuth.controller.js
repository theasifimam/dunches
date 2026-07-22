import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendSMS } from "../utils/sendSMS.js";
import { COOKIE_OPTIONS, generateTokens } from "../utils/token.utils.js";

// POST /api/v1/auth/phone-login-request
export const phoneLoginRequest = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) throw new ApiError(400, "Mobile number is required");

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(
    Date.now() + Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000,
  );

  await Otp.findOneAndDelete({ mobile, purpose: "mobile-verify" });
  await Otp.create({ mobile, otp, purpose: "mobile-verify", expiresAt });

  const smsBody = `Your Dunches Verification Code is: ${otp}. Valid for 10 minutes.`;
  await sendSMS(mobile, smsBody);

  res
    .status(200)
    .json(new ApiResponse("OTP sent successfully to your mobile.", { mobile }));
});

// POST /api/v1/auth/phone-login-verify
export const phoneLoginVerify = asyncHandler(async (req, res) => {
  const { mobile, otp, name, password } = req.body;
  if (!mobile || !otp) throw new ApiError(400, "Mobile and OTP are required");

  let isValid = false;
  if (process.env.MODE === "development" && otp === "1234") {
    isValid = true;
    console.log(
      `[DEVELOPER BYPASS] Verified mobile number: ${mobile} with bypass code`,
    );
  } else {
    const otpDoc = await Otp.findOne({ mobile, purpose: "mobile-verify" });
    if (!otpDoc) throw new ApiError(400, "OTP expired or not found");

    if (otpDoc.attempts >= 5) {
      await otpDoc.deleteOne();
      throw new ApiError(
        429,
        "Too many failed attempts. Please request a new OTP.",
      );
    }

    isValid = await otpDoc.compareOTP(otp);
    if (!isValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      throw new ApiError(
        400,
        `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`,
      );
    }

    await otpDoc.deleteOne();
  }

  if (!isValid) {
    throw new ApiError(400, "Invalid verification code");
  }

  let user = await User.findOne({ mobile, isDeleted: false });
  if (!user) {
    const cleanMobile = mobile.replace(/[^0-9]/g, "");
    const dummyEmail = `user_${cleanMobile}@dunches.com`;
    const finalName = name || `Muncher ${cleanMobile.slice(-4)}`;
    const finalPassword =
      password || Math.random().toString(36).slice(-8) + "Ab1!";

    const existingEmail = await User.findOne({ email: dummyEmail });
    if (existingEmail) {
      user = existingEmail;
      user.mobile = mobile;
      if (password) user.password = finalPassword;
      if (name) user.name = finalName;
    } else {
      user = new User({
        name: finalName,
        email: dummyEmail,
        mobile: mobile,
        password: finalPassword,
        isEmailVerified: true,
      });
    }
    await user.save();
  }

  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role,
  );
  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse("Login successful", {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      }),
    );
});

// POST /api/v1/auth/phone-check
export const phoneCheck = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      res
        .status(400)
        .json({ success: false, message: "Mobile number is required" });
      return;
    }
    const user = await User.findOne({ mobile, isDeleted: false }).select(
      "+password",
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Phone check complete",
        data: { exists: !!user, hasPassword: !!(user && user.password) },
      });
  } catch (e) {
    next(e);
  }
};

// POST /api/v1/auth/phone-login-password
export const phoneLoginPassword = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      res
        .status(400)
        .json({ success: false, message: "Mobile and password required" });
      return;
    }
    const user = await User.findOne({ mobile, isDeleted: false }).select(
      "+password",
    );
    if (!user) {
      res
        .status(401)
        .json({
          success: false,
          message: "No account found with this mobile number",
        });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res
        .status(401)
        .json({
          success: false,
          message: "Incorrect password. Please try again.",
        });
      return;
    }
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role,
    );
    user.refreshToken = refreshToken;
    await user.save();
    res
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
          },
        },
      });
  } catch (e) {
    next(e);
  }
};

// POST /api/v1/auth/phone-forgot-password
export const phoneForgotPassword = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) throw new ApiError(400, "Mobile number is required");

  const user = await User.findOne({
    mobile,
    isDeleted: false,
  });
  if (!user) throw new ApiError(404, "No account with this mobile number");

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(
    Date.now() + Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000,
  );
  await Otp.findOneAndDelete({ mobile, purpose: "phone-password-reset" });
  await Otp.create({
    mobile,
    otp,
    purpose: "phone-password-reset",
    expiresAt,
  });

  const smsBody = `Your Dunches Password Reset Code is: ${otp}. Valid for 10 minutes.`;
  await sendSMS(mobile, smsBody);

  res
    .status(200)
    .json(
      new ApiResponse("Password reset OTP sent to your mobile", { mobile }),
    );
});

// POST /api/v1/auth/phone-reset-password
export const phoneResetPassword = asyncHandler(async (req, res) => {
  const { mobile, otp, newPassword } = req.body;
  if (!mobile || !otp || !newPassword)
    throw new ApiError(400, "Mobile, OTP and new password are required");
  if (newPassword.length < 6)
    throw new ApiError(400, "Password must be at least 6 characters");

  let isValid = false;
  if (process.env.MODE === "development" && otp === "1234") {
    isValid = true;
  } else {
    const otpDoc = await Otp.findOne({
      mobile,
      purpose: "phone-password-reset",
    });
    if (!otpDoc) throw new ApiError(400, "OTP expired or not found");

    if (otpDoc.attempts >= 5) {
      await otpDoc.deleteOne();
      throw new ApiError(
        429,
        "Too many failed attempts. Please request a new OTP.",
      );
    }

    isValid = await otpDoc.compareOTP(otp);
    if (!isValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      throw new ApiError(
        400,
        `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`,
      );
    }

    await otpDoc.deleteOne();
  }
  if (!isValid) {
    throw new ApiError(400, "Invalid verification code");
  }

  const user = await User.findOne({ mobile, isDeleted: false });
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse("Password reset successful. Please login.", null));
});
