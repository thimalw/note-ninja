// Helper functions

const makeRes = (status, message = null, data = null) => {
  return { status, message, data };
};

const to = (promise) => {
  return promise.then(data => {
    return [null, data];
  })
  .catch(err => [err]);
};

module.exports = {
  makeRes,
  to
};