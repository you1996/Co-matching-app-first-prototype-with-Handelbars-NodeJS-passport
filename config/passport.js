const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["r_emailaddress", "r_liteprofile", "w_member_social"],
      },

      async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({
          linkedinId: profile.id,
        }); /*
        console.log(profile);
        const all = await User.find({}, function (err, docs) {});
        var matching = {};

        all.forEach((element) => {
          if (element.linkedinId != profile.id) {
            matching[element.linkedinId] = scoring.scoring(
              existingUser.info,
              element.info
            );
          }
        });
        let query = { linkedinId: profile.id };
        User.updateOne(
          query,
          { $set: { matchingList: matching } },
          { upsert: true }
        ).then((result, err) => {
          return "ok";
        });*/

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          linkedinId: profile.id,
          givenName: profile.name.givenName,
          familyName: profile.name.familyName,
          email: profile.emails[0].value,
          profilpic: profile.photos[2].value,
          country: profile._json.firstName.preferredLocale.country,
        }).save();
        done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
