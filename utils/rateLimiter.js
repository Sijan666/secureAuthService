const { rateLimit, MINUTE } = require('express-rate-limit')

// limiter
const apiLimiter = rateLimit({
    windowMs: 15 * MINUTE,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});

module.exports = { apiLimiter };