const ApiError = require('../../../src/utils/ApiError');

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const err = new ApiError(400, 'bad request');

    expect(err).toBeInstanceOf(Error);
  });

  it('carries the statusCode and message', () => {
    const err = new ApiError(404, 'not found');

    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('not found');
  });
});
