const ApiError = require('../utils/ApiError');
const { APPLICATION_STATUSES, WORK_TYPES } = require('../models/application.model');

// shape-only check (e.g. 2026-13-40 passes); Postgres rejects genuinely invalid dates on insert
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// True for undefined/null/empty-or-whitespace-only strings
function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

// Validates and normalizes the POST/PUT request body against the applications contract
function validateApplicationBody(req, res, next) {
  const { company, role, status, workType, location, date, notes } = req.body ?? {};

  if (isBlank(company)) return next(new ApiError(400, 'company is required'));
  if (isBlank(role)) return next(new ApiError(400, 'role is required'));
  if (isBlank(date)) return next(new ApiError(400, 'date is required'));
  if (!DATE_RE.test(date)) return next(new ApiError(400, 'date must be in YYYY-MM-DD format'));

  const resolvedStatus = status ?? 'Applied';
  if (!APPLICATION_STATUSES.includes(resolvedStatus)) {
    return next(new ApiError(400, `status must be one of: ${APPLICATION_STATUSES.join(', ')}`));
  }

  const resolvedWorkType = workType ?? 'Remote';
  if (!WORK_TYPES.includes(resolvedWorkType)) {
    return next(new ApiError(400, `workType must be one of: ${WORK_TYPES.join(', ')}`));
  }

  if (resolvedWorkType !== 'Remote' && isBlank(location)) {
    return next(new ApiError(400, 'location is required unless workType is Remote'));
  }

  req.body = {
    company: String(company).trim(),
    role: String(role).trim(),
    status: resolvedStatus,
    workType: resolvedWorkType,
    location: isBlank(location) ? null : String(location).trim(),
    date,
    notes: notes ?? '',
  };

  next();
}

module.exports = validateApplicationBody;
