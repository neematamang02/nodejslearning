export const auth = (req, res, next) => {
    const loggedIn = false;
    if (!loggedIn) {
        return res.send("Not authorized to this user");
    }
    next();
}