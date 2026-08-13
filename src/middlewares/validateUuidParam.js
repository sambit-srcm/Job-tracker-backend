const ApiError = require('../utils/ApiError');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Returns middleware that 400s if req.params[paramName] isn't a well-formed UUID
function validateUuidParam(paramName) {
  return (req, res, next) => {
    if (!UUID_RE.test(req.params[paramName])) {
      return next(new ApiError(400, `${paramName} must be a valid UUID`));
    }
    next();
  };
}

module.exports = validateUuidParam;
