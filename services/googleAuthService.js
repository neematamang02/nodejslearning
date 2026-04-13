import User from "../models/userModel.js";
import { Createuser } from "../repositories/userRepository.js";

export const googleLoginService = async (profile) => {
    const email = profile?.emails?.[0]?.value?.toLowerCase();
    if (!email) {
        throw new Error("Google account email is missing or unavailable");
    }

    const displayName = profile.displayName || email.split("@")[0];
    let user = await User.findOne({ email });
    if(!user) {
        user = await Createuser({
            name: displayName,
            email,
            googleId: profile.id,
            authProvider: "google",
            avatar: profile.photos?.[0]?.value
        });
    }
    // If exists but no googleId → link account
    if (user && !user.googleId) {
        user.googleId = profile.id;
        user.authProvider = "google";
        await user.save();
    }
    return user;
};