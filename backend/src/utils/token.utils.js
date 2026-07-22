import jwt from "jsonwebtoken";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const generateTokens = (userId, role) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessToken = jwt.sign({ id: userId, role }, accessSecret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY ?? "1d",
  });
  const refreshToken = jwt.sign({ id: userId, role }, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY ?? "7d",
  });
  return { accessToken, refreshToken };
};
