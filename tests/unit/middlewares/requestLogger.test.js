const requestLogger = require('../../../src/middlewares/requestLogger');

describe('requestLogger middleware', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('logs the full request and calls next()', () => {
    const req = {
      method: 'POST',
      originalUrl: '/applications/1?foo=bar',
      params: { id: '1' },
      query: { foo: 'bar' },
      body: { company: 'Acme' },
    };
    const next = jest.fn();

    requestLogger(req, {}, next);

    expect(consoleLogSpy).toHaveBeenCalledWith('[request]', {
      method: 'POST',
      url: '/applications/1?foo=bar',
      params: { id: '1' },
      query: { foo: 'bar' },
      body: { company: 'Acme' },
    });
    expect(next).toHaveBeenCalledWith();
  });
});
