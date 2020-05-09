const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  opts.secretOrKey = process.env.SECRET;
  passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
    } catch (err) {
      return done(err, false);
    }
  }));
};
