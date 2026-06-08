export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = error.message || "Server error";
  const isDatabaseConnectionError =
    message.includes("SSL routines") ||
    message.includes("MongoServerSelectionError") ||
    message.includes("Could not connect to any servers");

  res.status(statusCode).json({
    message: isDatabaseConnectionError
      ? "Database connection failed. Please check MongoDB Atlas Network Access/IP whitelist."
      : message
  });
}
