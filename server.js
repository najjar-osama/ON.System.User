const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const logger = require("morgan");
const dotenv = require("dotenv");

dotenv.load({
  path: process.env.NODE_ENV === "dev" ? "./dev.env" : "./prod.env"
});

const app = express();
// load routes
const usersRouteHandler = require("./routes/api/users");

// BodyParser  middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger(process.env.NODE_ENV === "dev" ? "dev" : "combined"));

const port = process.env.PORT || 3000;

app.use("/api/users", usersRouteHandler);

// setting passwport

app.use(passport.initialize());
require("./config/passport")(passport);

mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD
    }
  )
  .then(() => {
    console.log(`Connected to DB [env:${process.env.NODE_ENV}] successfully!`);
  })
  .catch(error => {
    console.log(error.message);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send(`<div style="color:purple;display:flex; justify-content:center;align-items:center;height:100%;">
      <h1>Server is up & running...</h1>
  </div>`);
});
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
