const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;

const config = require("../config/config.json");
const { User } = require("../models");

module.exports = {
  localSignupStrategy: new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const emailExists = await checkForExistingEmail(email);

        if (emailExists)
          return done(new Error(`A user already exists with email ${email}`));

        const newUser = await User.create({
          email: email.trim(),
          password: await createSafePassword(password),
          verified: false,
          verificationCode: null,
          linked: false,
          type: null
        });

        return done(null);
      } catch (e) {
        return done(e);
      }
    }
  ),
  localLoginStrategy: new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser)
          return done(new Error("Incorrect email or password"));

        const payload = { sub: existingUser.id };
        const token = jwt.sign(payload, config.JWT_SECRET);
        const data = { email: existingUser.email };

        return done(null, token, data);
      } catch (e) {
        return done(e);
      }
    }
  )
};

/* === */

async function checkForExistingEmail(email) {
  return !!await User.findOne({ where: { email } });
}

async function createSafePassword(password) {
  return new Promise((resolve, reject) => {
    return bcrypt.genSalt(config.SALT_ROUNDS, (err, salt) => {
      if (err) return reject(err);

      return bcrypt.hash(password, salt, (err, hash) => {
        return err ? reject(err) : resolve(hash);
      });
    });
  });
}

async function confirmPassword(incomingPassword, correctPassword) {
  return new Promise((resolve, reject) => {
    return bcrypt.compare(incomingPassword, correctPassword, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}
