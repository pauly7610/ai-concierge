const rateLimit = (requestsPerHour) => {
    const requestTracker = new Map();
  
    return (req, res, next) => {
      const userId = req.user.id;
      const currentTime = Date.now();
      
      const userRequests = requestTracker.get(userId) || [];
      const recentRequests = userRequests.filter(
        time => currentTime - time < 60 * 60 * 1000
      );
  
      if (recentRequests.length >= requestsPerHour) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: 'Wait an hour'
        });
      }
  
      requestTracker.set(userId, [...recentRequests, currentTime]);
      next();
    };
  };
  
  module.exports = { rateLimit };