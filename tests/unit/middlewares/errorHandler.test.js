const { notFound, errorHandler } = require('../../../src/middlewares/errorHandler');
const ApiError = require('../../../src/utils/ApiError');
const buildRes = require('../../helpers/mockRes');

describe('notFound middleware', () => {
  it('responds 404 with an error payload', () => {
    const res = buildRes();

    notFound({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });
});

describe('errorHandler middleware', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('translates an ApiError into its status code and message', () => {
    const res = buildRes();
    const err = new ApiError(404, 'Application not found');

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Application not found' });
  });

  it.each(['23514', '23502', '22P02'])('translates a Postgres error code %s into a 400', (code) => {
    const res = buildRes();
    const err = { code, detail: 'Key violates constraint' };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Key violates constraint' });
  });

  it('falls back to the error message when a Postgres error has no detail', () => {
    const res = buildRes();
    const err = { code: '23502', message: 'null value in column' };

    errorHandler(err, {}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ error: 'null value in column' });
  });

  it('translates a JSON parse failure into a 400', () => {
    const res = buildRes();
    const err = { type: 'entity.parse.failed' };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Malformed JSON in request body' });
  });

  it('falls back to a 500 for unrecognized errors and logs it', () => {
    const res = buildRes();
    const err = new Error('boom');

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
  });
});
