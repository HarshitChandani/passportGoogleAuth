const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {sql_request_instance,executeQuery} = require("../utils/DB_CONFIG");
const sql = require("mssql");
const { db_procedures } = require("../utils/constants");
const LocalStrategy = require("passport-local").Strategy;


// Google Strategy
module.exports.googleStrategy = new GoogleStrategy(
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
       const response = await request.execute(db_procedures.federated_login);
       return cb(null,{
         id: response.output.user_id,
         name: profile._json.name
       })
     } catch (error) {
       cb(error,{});
     }
   }
 )

// Local Strategy
module.exports.localStrategy = new LocalStrategy(
   {
   usernameField: "username",
   passwordField: "password"
   },
   function verify(username,password,done){
     if (username === null || password === null){
       done({
         status: 404,
         message: "Fields cannot be empty."
       },null);
     }else{
       done(null,{
         "username":username,
         "password":password
       })
     }
   }
)