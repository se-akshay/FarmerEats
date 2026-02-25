# FarmerEats Backend

Node.js + Express + MongoDB + Twilio backend for:

- `POST /assignment/user/register`
- `POST /assignment/user/login`
- `POST /assignment/user/forgot-password`
- `POST /assignment/user/verify-otp`
- `POST /assignment/user/reset-password`

## Quick start

1. Copy `.env.example` to `.env`
2. Fill all values in `.env`
3. Install dependencies: `npm install`
4. Run server: `npm run dev` (or `npm start`)

## Important

- For local testing without SMS provider, set `TWILIO_USE_MOCK=true`
- For real OTP delivery, set `TWILIO_USE_MOCK=false` and valid Twilio credentials
