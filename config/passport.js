const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
var { scoring, ContributeData } = require("../Data/matching.js");
const Data = require("../Data/Data.js");
const { forEach } = require("../Data/Data.js");
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
        });
        console.log(profile);

        var info = {};
        if (existingUser) {
          console.log(
            "processing the matching for EXISTING USERS to update the matchinglist "
          );
          const allUsers = await User.find({}, function (err, docs) {});
          var matching = new Object();

          allUsers.forEach((element) => {
            if (
              element.linkedinId != profile.id &&
              User.countDocuments() !== 0
            ) {
              matching[element.linkedinId] = scoring(
                existingUser.informations,
                element
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
          });
          return done(null, existingUser);
        }

        if (!existingUser) {
          console.log("first connection inserting data in the info variable");
          try {
            info = ContributeData(profile.displayName, Data);
          } catch (error) {
            console.log(error);
          }
          console.log("processing the matching and append users in a list");
          const allUsers = await User.find({}, function (err, docs) {});
          var matching = new Object();

          allUsers.forEach((element) => {
            if (
              element.linkedinId != profile.id &&
              User.estimatedDocumentCount() !== 0
            ) {
              matching[element.linkedinId] = scoring(info, element);
            }
          });
          if (Object.entries(matching).length === 0) {
            matching[profile.id] = 1000;
          }
          if (User.countDocuments() === 0) {
            matching[profile.linkedinId] = scoring(info, info);
          }
          const user = await new User({
            linkedinId: profile.id,
            matchingList: matching,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            email: profile.emails[0].value,
            profilpic: profile.photos[2].value,
            country: profile._json.firstName.preferredLocale.country,
            informations: info,
          }).save();
          done(null, user);
        }
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
