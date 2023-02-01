const express = require("express");
const Router = express.Router();
const passport = require("passport");

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

Router.get("/login/google", passport.authenticate("google"));

Router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successMessage: true,
    successRedirect: "/home",
    failureRedirect: "/login",
  })
);

Router.get("/auth/logout",(req,res) => {
  req.logout({
    keepSessionInfo: false
  },() =>{

  });
  res.redirect("/LoginPage");
})

// Redirect when manual login perform by user instead of any social logins.Controller will check for that this is already registered user and its provider i,e; Google,FB,Local.  
Router.post("/login/manual",passport.authenticate("local"),(req,res) => {
  try {
    const {username,password} = req.user;
    
  } catch (error) {
    
  }
});

module.exports = Router;
