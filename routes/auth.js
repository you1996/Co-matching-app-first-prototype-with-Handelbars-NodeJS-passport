const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc    Auth with linkedin
// @route   GET /auth/linkedin
router.get(
  "/linkedin",

  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile", "w_member_social"],
  })
);

// @desc    linkedin auth callback
// @route   GET /auth/linkedin/callback
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
