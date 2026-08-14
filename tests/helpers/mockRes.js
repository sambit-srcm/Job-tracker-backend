// Builds a chainable mock of Express's `res` for unit-testing controllers/middlewares.
function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

module.exports = buildRes;
