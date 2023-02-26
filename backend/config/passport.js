const facebookTokentStrategy = require("passport-facebook-token");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const appConfig = require("../config");
const { UserModel } = require("../db");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = appConfig.secretOrKey;

module.exports.jwtStra = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      // console.log({ jwt_payload });
      try {
        const user = await UserModel.findOne({
          where: { user_id: jwt_payload.user_id },
        });
        // .findById(jwt_payload.id);
        if (!user) {
          return done(null, false);
        } else {
          // console.log(user);
          return done(null, user.dataValues);
        }
      } catch (e) {
        console.log(e);
        // res.status(500).json(e);
      }
    })
  );
};

module.exports.facebookStrategy = (passport) => {
  passport.use(
    "facebookToken",
    new facebookTokentStrategy(
      {
        clientID: appConfig.facebookClientId,
        clientSecret: appConfig.facebookClientSecrete,
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    )
  );
};
