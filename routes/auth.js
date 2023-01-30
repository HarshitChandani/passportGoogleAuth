const express = require("express");
const Router = express.Router();
const passport = require("passport");
const { db_tables, db_procedures } = require("../utils/constants");
const { sql_request_instance, executeQuery } = require("../utils/DB_CONFIG");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const sql = require("mssql");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["profile", "email"],
      callbackURL: "/auth/google/callback",
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      try {
        const request = await sql_request_instance();
        request.input("provider_name", sql.Char(255), "google");
        request.input("users_social_id", sql.Char(255), `${profile.id}`);
        request.input(
          "provider_link",
          sql.Char(255),
          "https://accounts.google.com"
        );
        request.input("user_name", sql.Char(255), profile._json.name);
        request.input("user_email", sql.Char(255), profile._json.email);
        request.input("user_pic", sql.Char(255), profile._json.picture);
        request.input(
          "user_active_status",
          sql.Bit,
          profile._json.email_verified ? 1 : 0
        );
        request.output("user_id", sql.Int);
        request.output("is_new_user", sql.Bit);
        const response = await request.execute(db_procedures.federated_login);
        if (response.output.is_new_user) {
          return cb(null, {
            id: response.output.user_id,
            name: profile.displayName,
          });
        } else {
          const execute = await executeQuery(
            `SELECT * FROM ${db_tables.users} WHERE id = ${response.output.user_id}`
          );
          const user = {};
          execute.recordset.forEach((obj) => {
            user["id"] = obj.id;
            user["name"] = obj.name;
          });
          return cb(null, user);
        }
      } catch (error) {
        cb(error);
      }
    }
  )
);

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
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = Router;
