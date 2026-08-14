const asyncHandler = require('../../../src/utils/asyncHandler');

describe('asyncHandler', () => {
  it('invokes the wrapped handler with req, res, next', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const req = {};
    const res = {};
    const next = jest.fn();

    await asyncHandler(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
  });

  it('forwards a rejected promise to next()', async () => {
    const error = new Error('failure');
    const handler = jest.fn().mockRejectedValue(error);
    const next = jest.fn();

    await asyncHandler(handler)({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('does not call next() when the handler resolves successfully', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const next = jest.fn();

    await asyncHandler(handler)({}, {}, next);

    expect(next).not.toHaveBeenCalled();
  });
});
