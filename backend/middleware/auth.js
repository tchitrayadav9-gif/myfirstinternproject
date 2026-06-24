const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'avon_smart_portal_enterprise_key_2026');

      // Fetch user from DB (or JSON Db)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Authorization failed. User no longer exists.' });
      }

      req.user = {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl
      };

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, missing session token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRoleLower = req.user?.role?.toLowerCase();
    const allowedRolesLower = roles.map(r => r.toLowerCase());
    if (!req.user || !allowedRolesLower.includes(userRoleLower)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted. Requires roles: [${roles.join(', ')}]. Current role: ${req.user ? req.user.role : 'none'}` 
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
