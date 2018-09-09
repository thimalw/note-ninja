const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserController = require('../controllers/UserController');
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; // TODO

module.exports = new Strategy(opts, async (jwt_payload, done) => {
  const user = await UserController.read(jwt_payload.id);
  if (user.status === 200 && user.data.user) {
    return done(null, user.data.user);
  }
  return done(null, false);
});