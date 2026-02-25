export const BASE_API_URL = "https://farmer-eats-8gk4.vercel.app";

export const AUTH_ENDPOINTS = {
  register: `${BASE_API_URL}/assignment/user/register`,
  login: `${BASE_API_URL}/assignment/user/login`,
  forgotPassword: `${BASE_API_URL}/assignment/user/forgot-password`,
  verifyOtp: `${BASE_API_URL}/assignment/user/verify-otp`,
  resetPassword: `${BASE_API_URL}/assignment/user/reset-password`,
};
