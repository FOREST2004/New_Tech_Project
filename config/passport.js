// server/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { OAuthService } from '../services/common/auth/oauth.service.js';

const prisma = new PrismaClient();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Google OAuth2 Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4321/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await OAuthService.findOrCreateUser(profile, 'google');
      return done(null, result);
    } catch (error) {
      return done(error, null);
    }
  }
));







// passport.serializeUser((user, done) => {
//   done(null, user.id); // Chỉ lưu user id vào session
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.user.findUnique({ 
//       where: { id },
//       select: {
//         id: true,
//         email: true,
//         fullName: true,
//         avatarUrl: true,
//         role: true
//       }
//     });
//     done(null, user);
//   } catch (error) {
//     console.error('Error in deserializeUser:', error);
//     done(error, null);
//   }
// });


export default passport;