const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Admin = require('../models/admin');

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  opts.secretOrKey = process.env.SECRET;
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    // console.log(jwtPayload);
    // eslint-disable-next-line no-underscore-dangle
    Admin.getUserById(jwtPayload._id, (err, admin) => {
      if (err) {
        return done(err, false);
      }
      if (admin) {
        return done(null, admin);
      }
      return done(null, false);
    });
  }));
};
