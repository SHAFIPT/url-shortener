export enum Messages {
  REGISTER_SUCCESS = "User registered successfully",
  LOGIN_SUCCESS = "Login successful",
  INVALID_CREDENTIALS = "Invalid email or password",
  UNAUTHORIZED = "Unauthorized access",
  SERVER_ERROR = "Internal server error",
  REFRESH_SUCCESS = "Access token refreshed successfully",
  EMAIL_ALREADY_EXISTS = "Email already exists",
  VALIDATION_FAILED = "Validation failed",
  ACCOUNT_INACTIVE = "Your account has been blocked by the admin",
  LOGOUT_SUCCESS = "User logged out successfully",

  REGISTED_OTP_SEND = "Registered. OTP sent to email.",
  USER_NOT_FOUND = 'User not found',
  INVALID_OTP = 'Invalid or expired OTP',
  EMAIL_VARIFIED = 'Email verified successfully',
  ALREADY_VARIFIED = 'Already verified',

  OTP_RESENT = 'OTP Resent Successfully',
  EMAIL_NOT_VARIFIED = 'Email not verified',
  INCORRECT_PASSWORD = "Incorrect password",
  OTP_SENT_IF_EMAIL_EXISTS = "If the email exists, an OTP has been sent.",
  PASSWORD_UPDATED = "Password updated successfully",
}
