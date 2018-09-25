const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const randomatic = require("randomatic");
const sendEmailVerificationCode = require("../../utils/sendEmailVerificationCode");

const validateRegistration = require("../../validation/users")
  .validateRegistration;

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
  const validation = validateRegistration(req.body);
  if (validation.isValid) {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        validation.errors.email = "Email is already in use.";
        validation.isValid = false;
        return res.status(409).json(validation);
      } else {
        const newUser = new User({
          name: req.body.name,
          role: req.body.role,
          email: req.body.email,
          avatar: req.body.avatar,
          password: req.body.password,
          emailVerfication: {
            verficationCode: randomatic("0", 6),
            emailVerified: false
          }
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                sendEmailVerificationCode(
                  user.email,
                  user.name,
                  user.emailVerfication.verficationCode
                );
                res.json({
                  name: user.name,
                  message: "a verifcation email has been sent ot your account!"
                });
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  } else {
    return res.status(400).json(validation);
  }
});

// @route   POST api/users/login
// @desc    Login user / Return JWT token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user Matched
        // sign the token
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            res.status(200).json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect!" });
      }
    });
  });
});

// @route   POST api/users/current
// @desc    Return current user
// @access  Protected

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);
module.exports = router;
