// Error carrying an HTTP status code, for errorHandler to turn into a { error } response
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
