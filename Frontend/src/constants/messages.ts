export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully",
  LOGIN_ERROR: "Login failed",

  REGISTER_SUCCESS: "Registered successfully. Check your email!",
  REGISTER_ERROR: "Registration failed",

  OTP_SUCCESS: "Your account has been successfully verified.",
  OTP_VERIFY_ERROR: "OTP verification failed",

  OTP_RESEND_SUCCESS: "A new verification code has been sent to your email.",
  OTP_RESEND_ERROR: "Failed to resend OTP",

  EMAIL_MISSING: "Missing email. Please go back and register again.",
  INVALID_OTP: "Please enter a valid 6-digit OTP",
  
  FORGOT_REQUIRED_EMAIL: "Please enter your email address",
  FORGOT_INVALID_EMAIL: "Please enter a valid email address",
  FORGOT_SUCCESS: "Reset link sent to your email.",
  FORGOT_ERROR: "Failed to send reset link",

  RESET_LINK_INVALID: "This reset link is invalid or has expired.",
  RESET_PASSWORD_POLICY: "Password must meet all security requirements.",
  RESET_PASSWORD_MISMATCH: "Passwords don't match",
  RESET_SUCCESS: "Your password has been updated. You can now log in.",
  RESET_ERROR: "Failed to reset password",
};
