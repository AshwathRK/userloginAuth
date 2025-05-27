const User = require('../Model/user.mode');
const bcrypt = require('bcrypt');
const { createJWTToken } = require('../utill')
const jwt = require('jsonwebtoken');

const handleGetLogin = (req, res, next) => {
    if (req.user) {
        return res.render("userProfile", { title: 'User Profile' });
    }
    res.render('login', {
        title: 'login',
        pagelink: './signup',
        page: "SignUp",
        message: null,
        error: null
    });
}

const handlePostLogin = async (req, res, next) => {
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

        const token = createJWTToken({ uID: user.id, email: user.email });

        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            })
            .render("userProfile", {
                message: "Login successful",
                userId: user._id,
                title: 'User Profile'
            });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "An error occurred during login." });
    }
};

const handleGetSignUp = (req, res, next) => {
    if (req.cookies?.token) {
        return res.render("userProfile", { title: 'User Profile' });
    }
    res.render('signup', {
        title: 'signup',
        pagelink: './',
        page: "Login",
        message: null,
        error: null
    });
};

const handlePostSignUp = async (req, res, next) => {
    
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {

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
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });
        return res.render('signup', {
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

const getUserDetails = (req, res, next) => {
    if (req.user) {
        return res.render('userProfile', { title: 'User Profile' })
    }

    return res.status(500).json(
        {
            message: "Token verification faild login again",
            status: "Failed"
        }
    )
}

module.exports = {
    handleGetLogin, handlePostLogin, handleGetSignUp, handlePostSignUp, getUserDetails
};
