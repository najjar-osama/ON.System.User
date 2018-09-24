const validator = require("validator");
const isEmpty = require("../utils/isEmpty");

const validateRegistration = ({
  name,
  email,
  password,
  passwordConfirmation,
  role
}) => {
  isEmpty(name) ? (name = "") : name;
  isEmpty(email) ? (email = "") : email;
  isEmpty(password) ? (password = "") : password;
  isEmpty(passwordConfirmation)
    ? (passwordConfirmation = "")
    : passwordConfirmation;
  isEmpty(role) ? (role = "") : role;
  const errors = {};
  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (!validator.isEmail(email)) {
    errors.email = "Email is inavlid.";
  }
  if (!validator.isLength(password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!validator.equals(passwordConfirmation, password)) {
    errors.passwordConfirmation = "Passwords do not match.";
  }

  if (isEmpty(name)) {
    errors.name = "Name field is required.";
  }
  if (isEmpty(email)) {
    errors.email = "Email field is required.";
  }
  if (isEmpty(password)) {
    errors.password = "Password field is required.";
  }
  if (isEmpty(passwordConfirmation)) {
    errors.passwordConfirmation = "Password confirmation field is required.";
  }
  if (isEmpty(role)) {
    errors.role = "Role field is required.";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = {
  validateRegistration
};
