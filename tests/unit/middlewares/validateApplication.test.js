const validateApplicationBody = require('../../../src/middlewares/validateApplication');
const ApiError = require('../../../src/utils/ApiError');

function buildReq(body) {
  return { body };
}

describe('validateApplicationBody middleware', () => {
  const validBody = {
    company: 'Acme Corp',
    role: 'Backend Engineer',
    status: 'Applied',
    workType: 'Remote',
    date: '2026-01-15',
  };

  it('calls next() with no arguments when the body is valid', () => {
    const req = buildReq({ ...validBody });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('normalizes the request body, trimming strings and defaulting notes', () => {
    const req = buildReq({ ...validBody, company: '  Acme Corp  ', notes: undefined });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(req.body).toEqual({
      company: 'Acme Corp',
      role: 'Backend Engineer',
      status: 'Applied',
      workType: 'Remote',
      location: null,
      date: '2026-01-15',
      notes: '',
    });
  });

  it.each(['company', 'role', 'date'])('rejects a missing %s with a 400 ApiError', (field) => {
    const body = { ...validBody };
    delete body[field];
    const req = buildReq(body);
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe(`${field} is required`);
  });

  it.each(['company', 'role'])('rejects a whitespace-only %s', (field) => {
    const req = buildReq({ ...validBody, [field]: '   ' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe(`${field} is required`);
  });

  it('rejects a malformed date', () => {
    const req = buildReq({ ...validBody, date: '15-01-2026' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe('date must be in YYYY-MM-DD format');
  });

  it('defaults status to Applied when omitted', () => {
    const body = { ...validBody };
    delete body.status;
    const req = buildReq(body);
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(req.body.status).toBe('Applied');
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects an invalid status', () => {
    const req = buildReq({ ...validBody, status: 'Ghosted' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toMatch(/^status must be one of/);
  });

  it('defaults workType to Remote when omitted', () => {
    const body = { ...validBody };
    delete body.workType;
    const req = buildReq(body);
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(req.body.workType).toBe('Remote');
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects an invalid workType', () => {
    const req = buildReq({ ...validBody, workType: 'Moon' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toMatch(/^workType must be one of/);
  });

  it('requires location when workType is not Remote', () => {
    const req = buildReq({ ...validBody, workType: 'Onsite', location: '' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe('location is required unless workType is Remote');
  });

  it('accepts a missing location when workType is Remote', () => {
    const req = buildReq({ ...validBody, workType: 'Remote', location: undefined });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.location).toBeNull();
  });

  it('accepts and trims a valid location for a non-Remote workType', () => {
    const req = buildReq({ ...validBody, workType: 'Hybrid', location: '  New York  ' });
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.location).toBe('New York');
  });

  it('handles a missing request body gracefully', () => {
    const req = { body: undefined };
    const next = jest.fn();

    validateApplicationBody(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe('company is required');
  });
});
