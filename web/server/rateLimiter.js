import rateLimit from "express-rate-limit";

const RateLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per window
    message: options.message || "Too many requests, please try again later.",
    standardHeaders: true, // Send rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

export default RateLimiter;
