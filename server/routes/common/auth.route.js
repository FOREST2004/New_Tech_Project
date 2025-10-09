// server/routes/common/auth.route.js
import express from "express";
import passport from "passport";
import { AuthController } from "../../controllers/common/auth.controller.js";

const router = express.Router();


router.post("/login", AuthController.login);


router.get(
  '/google',
  passport.authenticate('google', { 
    session: false, 
    scope: ['profile', 'email'] 
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect with token
    const { token, user } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.fullName || '')}&avatar=${encodeURIComponent(user.avatarUrl || '')}`);
  }
);

export default router;