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
  try {
    const stories = await Story.find({ user: req.user._id }).lean();

    const matches = [];
    matches.push(
      await User.findById(req.user.matchingList[0].user_id)

        .sort({
          score: "desc",
        })
        .lean()
    );
    //req.user.matchingList.sort({ score: "desc" }).forEach((element) => {

    // });
    console.log(req.user.matchingList.user_id);
    console.log(matches);

    res.render("dashboard", {
      profilpic: req.user.profilpic,
      country: req.user.country,
      email: req.user.email,
      givenName: req.user.givenName,
      familyName: req.user.familyName,
      matchingList: req.user.matchingList,
      stories,
      matches,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
