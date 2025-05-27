const jwt = require('jsonwebtoken');

const SECRET_ID = 'ASH$7010'

const createJWTToken = (payload) => {
    try {
        const token = jwt.sign(payload, SECRET_ID, {
            expiresIn: '1h'
        })
        return token
    } catch (error) {
        throw new error('payload missing or invalid', error)
    }
}

const verifyToken = (token) => {
    try {
        const retunPayload = jwt.verify(token, SECRET_ID)
        return retunPayload
    } catch (error) {
        throw new error('Token verification faild', error)
    }
}

module.exports = {
    createJWTToken,
    verifyToken,
    SECRET_ID
};