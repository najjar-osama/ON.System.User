const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const randomatic = require("randomatic");
const sendEmailVerificationCode = require("../../utils/sendEmailVerificationCode");

const validateRegistration = require("../../validation/users")
  .validateRegistration;

//Load User Model
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const validation = validateRegistration(req.body);

  if (validation.isValid) {
    User.findOne({ email: req.body.email })
      .then(user => {
        // user already there!
        if (user) {
          validation.errors.email = "Email is already in use.";
          validation.isValid = false;
          return res.status(409).json(validation);
        }
        // create new user
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
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) {
              return res.status(500).json({ error });
            }
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                sendEmailVerificationCode(
                  user.email,
                  user.name,
                  user.emailVerfication.verficationCode
                );
                return user;
              })
              .then(user => {
                // created
                res.status(201).json(handleSucessRegistrationResponse(user));
              })
              // error while creating new user.
              .catch(error => res.status(500).json({ error }));
          });
        });
      })
      .catch(error => res.status(500).json({ error }));
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

const handleSucessRegistrationResponse = ({ name, email, role, avatar }) => ({
  data: {
    type: "users",
    attributes: {
      name,
      email,
      role,
      avatar
    }
  }
});

module.exports = router;
