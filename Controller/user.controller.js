const User = require('../Model/user.mode');
const bcrypt = require('bcrypt');
const {createJWTToken} = require('../utill')
const jwt = require('jsonwebtoken');

const handleGetLogin = (req, res, next) => {
    if (req.cookies?.token) {
        return res.render("userProfile", { title: 'User Profile', pagelink: './userProfile' });
    }
    res.render('login', { title: 'Login' });
};

const handlePostLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = createJWTToken({ uID: user.id, email: user.email })
        return res.cookie("token", token).render("userProfile",{ message: "Login successful", userId: user._id });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "An error occurred during login." });
    }
};

const handleGetSignUp = (req, res, next) => {
    if (req.cookies?.token) {
        return res.render("userProfile", { title: 'User Profile', pagelink: './userProfile' });
    }
    res.render('signup', { title: 'Signup' });
};

const handlePostSignUp = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });
        return res.render('login', { title: 'Login' });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "An error occurred while registering the user." });
    }
};

module.exports = {
    handleGetLogin,
    handlePostLogin,
    handleGetSignUp,
    handlePostSignUp
};
