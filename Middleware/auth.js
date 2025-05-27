const { verifyToken } = require('../utill')

const verifyTokenfromCookies = (req, res, next) => {
    const token = req.cookies['token']

    if (!token) return next()

    try {
        const userPayload = verifyToken(token)
        req.user = userPayload;
        next()
    } catch (error) {
        next()
    }

}

module.exports=verifyTokenfromCookies;

