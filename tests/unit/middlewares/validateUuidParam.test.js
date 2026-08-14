const validateUuidParam = require('../../../src/middlewares/validateUuidParam');
const ApiError = require('../../../src/utils/ApiError');

describe('validateUuidParam middleware', () => {
  const middleware = validateUuidParam('id');

  it('calls next() with no arguments for a valid UUID', () => {
    const req = { params: { id: '123e4567-e89b-12d3-a456-426614174000' } };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('accepts an uppercase UUID', () => {
    const req = { params: { id: '123E4567-E89B-12D3-A456-426614174000' } };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('rejects a malformed UUID with a 400 ApiError', () => {
    const req = { params: { id: 'not-a-uuid' } };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe('id must be a valid UUID');
  });

  it('rejects a missing param', () => {
    const req = { params: {} };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  it('uses the configured param name in the error message', () => {
    const appIdMiddleware = validateUuidParam('applicationId');
    const req = { params: { applicationId: 'bad' } };
    const next = jest.fn();

    appIdMiddleware(req, {}, next);

    expect(next.mock.calls[0][0].message).toBe('applicationId must be a valid UUID');
  });
});
