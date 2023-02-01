const express = require("express");
const { sql_request_instance } = require("../utils/DB_CONFIG");
const Router = express.Router();

Router.get("/", async(req, res) => {
  res.render("main");
});

Router.get("/LoginPage", (req, res) => {
  res.render("login");
});

// Protected Route.
Router.get("/home",(req,res,next) => {
  // At core level isAuthenticated is a auth user object
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) next();
  else{
    res.redirect("/LoginPage");
  }
},(req,res) => {
  res.render("home",{
    userDisplayName: req.user.name
  });
})

module.exports = Router;
