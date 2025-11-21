/**
 * Global error handling middleware.
 *
 * Catches errors thrown in route handlers or services and formats
 * responses consistently. Attaches a status code if provided on the
 * error object; otherwise defaults to 500 (Internal Server Error).
 */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    message,
    // Optionally include a custom error code to help the frontend
    code: err.code || 'SERVER_ERROR',
  });
}

module.exports = {
  errorHandler,
};