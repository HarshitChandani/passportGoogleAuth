require("dotenv").config();
const express = require("express");
const path = require("path");
const defaultRouter = require("./routes/index");
const passportAuthRouter = require("./routes/auth");
const session = require("express-session");
const app = express();
const passport = require("passport");
const { googleStrategy, localStrategy } = require("./middlewares/authMiddleware");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.authenticate("session"));
passport.use(googleStrategy);
passport.use(localStrategy);
app.use("/", defaultRouter);
app.use("/", passportAuthRouter);

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

// OAuth and OpenID connect:
// At core level 