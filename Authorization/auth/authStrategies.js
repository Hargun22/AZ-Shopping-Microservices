const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const axios = require("axios");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      bcrypt.hash(password, 10, async (err, hash) => {
        try {
          if (err) throw new Error(err.message);
          const user = {
            username,
            password: hash,
            email: req.body.email,
            admin: req.body.admin || false,
          };
          const res = await axios.post("http://user:5001", user);
          return done(null, res.data);
        } catch (error) {
          done(error);
        }
      });
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRETKEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await axios.get(`http://user:5001/username/${username}`);
        if (!user) return done(new Error("User not found"));
        const passwordIsValid = bcrypt.compareSync(
          password,
          user.data.password
        );
        if (!passwordIsValid) return done(new Error("Wrong password"));
        console.log("password line");
        return done(null, user.data, { message: "Logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
