const { verifyToken } = require('../utill');

const verifyTokenfromCookies = (req, res, next) => {
    const token = req.cookies['token'];
    // console.log("Cookie token:", token);

    if (!token) {
        // console.log("No token found in cookies");
        return next();
    }

    try {
        const userPayload = verifyToken(token);
        // console.log("Token verified, userPayload:", userPayload);
        req.user = userPayload;
        next();
    } catch (error) {
        // console.error("Token verification failed:", error.message);
        next();
    }
};

module.exports = verifyTokenfromCookies;
