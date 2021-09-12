const auth = require('./auth');
const upF = require('./upF');

module.exports = (app) => {
  app.use('/auth', auth);
  app.use('/upF', upF);
};
