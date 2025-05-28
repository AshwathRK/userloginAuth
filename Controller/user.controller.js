const User = require('../Model/user.mode');
const bcrypt = require('bcrypt');
const { generateTokens, verifyRefreshToken } = require('../utill')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const handleGetLogin = async (req, res, next) => {
    if (!req.user) {
        return res.render('login', {
            title: 'login',
            pagelink: './signup',
            page: "SignUp",
            message: null,
            error: null
        });
    }
    var useremail = req.user.email
    const user = await User.findOne({ email: useremail });
    return res.render("userProfile",
        {
            title: 'User Profile',
            userDetails: user
        });
}

const handlePostLogin = async (req, res, next) => {
    const deviceId = uuidv4();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                title: 'Login',
                pagelink: './signup',
                page: "SignUp",
                message: null,
                error: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).render('login', {
                title: 'Login',
                pagelink: './signup',
                page: "SignUp",
                message: null,
                error: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('login', {
                title: 'Login',
                pagelink: './signup',
                page: "SignUp",
                message: null,
                error: "Invalid email or password."
            });
        }

        const { accessToken, refreshToken } = generateTokens(
            { uID: user.id, email: user.email },
            deviceId
        );

        // ✅ Make sure this is the only response
        return res
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000,
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .cookie('deviceId', deviceId, {
                httpOnly: false,
                sameSite: 'Strict',
            })
            .render("userProfile",
                {
                    title: 'User Profile',
                    userDetails: user
                });

    } catch (error) {
        console.error("Login error:", error);
        if (!res.headersSent) {
            return res.status(500).render('login', {
                title: 'Login',
                pagelink: './signup',
                page: "SignUp",
                message: null,
                error: "An error occurred during login."
            });
        }
    }
};

const handleGetSignUp = (req, res, next) => {
    if (!req.user) {
        return res.render('signup', {
            title: 'signup',
            pagelink: './',
            page: "Login",
            message: null,
            error: null
        });
    }
    return res.render("userProfile",
        {
            title: 'User Profile',
            userDetails: user
        });

};

const handlePostSignUp = async (req, res, next) => {

    debugger
    try {
        const { fullname, email, dob, gender, password, confirmpassword } = req.body;
        if (!fullname || !email || !password || !dob || !gender || !confirmpassword) {

            return res.status(400).render('signup', {
                title: 'SignUp',
                pagelink: './',
                page: "Login",
                message: null,
                error: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {

            return res.status(400).render('signup', {
                title: 'SignUp',
                pagelink: './',
                page: "Login",
                message: null,
                error: "Email is already in use."
            });
        }
        const matchedpassword = password === confirmpassword
        if (!matchedpassword) {
            return res.status(400).render('signup', {
                title: 'SignUp',
                pagelink: './',
                page: "Login",
                message: null,
                error: "Please make sure the Password and Confirm Password fields match."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            dateofbirth: new Date(dob),
            gender,
            password: hashedPassword
        });
        return res.render('login', {
            title: 'login',
            pagelink: './signup',
            page: "SignUp",
            message: null,
            error: null
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).render('signup', {
            title: 'SignUp',
            pagelink: './',
            page: "Login",
            message: null,
            error: "An error occurred while registering the user."
        });
    }
}

const getUserDetails = async (req, res, next) => {
    if (!req.user) {
        return res.render('404', { title: '404' })
    }

    var useremail = req.user.email
    const user = await User.findOne({ email: useremail });
    return res.render("userProfile",
        {
            title: 'User Profile',
            userDetails: user
        });
}

const logoutUser = (req, res, next) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('deviceId');
    res.redirect('/');
}

module.exports = {
    handleGetLogin, handlePostLogin, handleGetSignUp, handlePostSignUp, getUserDetails, logoutUser
};
