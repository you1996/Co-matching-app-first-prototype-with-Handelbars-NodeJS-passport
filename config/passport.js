const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
var { scoring, ContributeData } = require("../Data/matching.js");
const Data = require("../Data/Data.js");

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

        var info = {};
        if (existingUser) {
          console.log(
            "processing the matching for EXISTING USERS to update the matchinglist "
          );
          const allUsers = await User.find({}, function (err, docs) {});
          const CurrentUser = await User.findOne(
            { linkedinId: profile.id },
            function (err, docs) {}
          );
          var matching = new Object({ _id: false });

          var list = [];
          console.log(profile);

          allUsers.forEach((element) => {
            var matching = new Object();
            if (
              element.linkedinId != profile.id &&
              User.estimatedDocumentCount() !== 0
            ) {
              matching.id = element.linkedinId;
              matching.score = scoring(CurrentUser.informations, element);
              list.push(matching);
            }
            delete matching;
          });
          list.sort(function (a, b) {
            return a.score - b.score;
          });
          let query = { linkedinId: profile.id };
          User.updateOne(
            query,
            {
              $set: {
                matchingList: list,
              },
            },
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
          console.log(info);
          console.log("processing the matching and append users in a list");
          const allUsers = await User.find({}, function (err, docs) {});

          var list = [];

          allUsers.forEach((element) => {
            var matching = new Object();
            if (
              element.linkedinId != profile.id &&
              User.estimatedDocumentCount() !== 0
            ) {
              matching.id = element.linkedinId;
              matching.score = scoring(info, element);
              list.push(matching);
            }
            delete matching;
          });

          // if (Object.entries(matching).length === 0) {
          //   matching[profile.id] = 1000;
          // }
          if (User.countDocuments() === 0) {
            matching[profile.linkedinId] = scoring(info, info);
          }
          const user = await new User({
            linkedinId: profile.id,
            matchingList: list,
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
