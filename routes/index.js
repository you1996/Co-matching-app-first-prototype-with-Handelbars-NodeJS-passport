const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Story = require("../models/Story");
const User = require("../models/User");

// @desc    Login/Landing page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  var matches = [];

  const stories = await Story.find({ user: req.user._id })
    .sort({ createdAt: "desc" })
    .lean();

  list = req.user.matchingList;
  //query = await Object.values(req.user.matchingList);
  const run = async () => {
    for (let index = 0; index < list.length; index++) {
      let user = await User.findOne({ linkedinId: list[index].id }).lean();
      user.score = list[index].score;
      await matches.push(user);
    }
    return matches;
  };
  matches = await run();
  console.log(matches);
  console.log(list);

  //console.log(req.user.matchingList.user_id);

  res.render("dashboard", {
    profilpic: req.user.profilpic,
    country: req.user.country,
    email: req.user.email,
    givenName: req.user.givenName,
    familyName: req.user.familyName,
    matchingList: req.user.matchingList,
    informations: req.user.informations,
    stories,
    matches,
  });
  // } catch (err) {
  //   console.error(err);
  //   res.render("error/500");
  // }
});

module.exports = router;
