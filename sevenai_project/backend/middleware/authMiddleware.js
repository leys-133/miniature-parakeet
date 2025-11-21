/**
 * JWT authentication middleware.
 *
 * Verifies the presence and validity of a JWT in the Authorization
 * header. When valid, attaches the decoded user information to the
 * request object (req.user) and calls next(). Otherwise returns an
 * unauthorized response.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT. Expects the header
 * `Authorization: Bearer <token>` to be set. If the token is missing or
 * invalid, a 401 Unauthorized response is sent.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
}

module.exports = {
  authenticateToken,
};