const express = require("express");
const router = express.Router();

//Load User Model

const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests Users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "users api works!" });
});

// @route   POST api/users/register
// @desc    Register user
// @access  Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });
    }
  });
});

module.exports = router;
