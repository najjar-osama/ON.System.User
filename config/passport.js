const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const opts = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return null, false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
  );
};
