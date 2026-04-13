import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleLoginService } from '../services/googleAuthService.js';
import config from './index.js';

passport.use(new GoogleStrategy({
    clientID: config.oauth.googleClientId,
    clientSecret: config.oauth.googleClientSecret,
    callbackURL: '/api/auth/google/callback'
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await googleLoginService(profile);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

export default passport;