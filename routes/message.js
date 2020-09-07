const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Message = require("../models/Message");
// @desc    Process add form
// @route   POST /messages
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.sender = req.user.id;
    req.body.reciever = req.params.matches.id;
    console.log(req.body.sender, req.body.reciever);
    await Message.create(req.body);
    console.log("created");

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
