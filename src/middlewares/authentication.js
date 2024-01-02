import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../dao/models/user.model.js";

passport.use(
  "localLogin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function verificationCallback(username, password, done) {
      try {
        const userData = await userModel.login(username, password);
        done(null, userData);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user);
});
passport.deserializeUser((user, next) => {
  next(null, user);
});

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
