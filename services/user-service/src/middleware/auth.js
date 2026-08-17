const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }

  next();
}

function authenticateInternal(req, res, next) {
  const internalKey = req.headers['x-internal-key'];

  if (
    !internalKey ||
    internalKey !== process.env.INTERNAL_SERVICE_KEY
  ) {
    return res.status(401).json({
      message: 'Internal authentication required'
    });
  }

  next();
}

module.exports = {
  authenticate,
  authenticateInternal,
  isAdmin,
};