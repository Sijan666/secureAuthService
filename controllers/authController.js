const User = require('../models/userSchema');
const permission = require('../permission');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const transporter = require('../utils/transporter');
let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


registration
const registrationUser = async (req, res) => {
    try {
        let { username, email, password, role = 'student' } = req.body;

        // check empty fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all the fields"
            });
        }

        // username validation
        if (username.length < 5 || username.length > 20) {
            return res.status(400).json({
                success: false,
                message: "username must be in between 5 to 20 character",
            });
        }

        // existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "user already exists",
            });
        }

        // email validation
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "please enter a valid email",
            });
        }

        // password validation
        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                success: false,
                message: "password must contain a lowercase, uppercase, number, special character and minimum 8 characters",
            });
        }

        // get permission
        let per;
        permission.map(item => {
            if (item.role == role) {
                per = item.permission;
            }
        });

        // password hashing
        const hash = bcrypt.hashSync(password, 10);

        // create user
        const user = new User({
            username: username,
            email: email,
            password: hash,
            role: role,
            permission: per
        });
        
        // save to database
        await user.save();

        return res.status(201).json({
            success: true,
            message: "registration successful",
            data: user
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "registration failed", 
            error 
        });
    }
};


// sendotp
const sendOtp = async (req, res) => {
    try {
        let { email, password } = req.body;

        // check empty fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all the field"
            });
        }

        // existing user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        // check password
        const isMatch = await bcrypt.compareSync(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "invalid password"
            });
        }

        // generate otp
        const otp = otpGenerator.generate(6);

        // update otp in database
        await User.findOneAndUpdate({ email }, { otp: otp });

        // send otp via email
        const info = await transporter.sendMail({
            from: `"Sijan" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "This is your OTP",
            html: `<body style="margin:0;padding:40px 0;background:#f5f5f7;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;padding:48px 40px;"><tr><td align="center" style="font-size:28px;font-weight:bold;color:#111827;">Your OTP</td></tr><tr><td align="center" style="padding-top:16px;font-size:15px;line-height:24px;color:#6b7280;">Use the verification code below to continue.</td></tr><tr><td align="center" style="padding:36px 0;"><table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#111827;color:#fff;font-size:34px;font-weight:bold;letter-spacing:10px;padding:18px 40px;border-radius:12px;">${otp}</td></tr></table></td></tr><tr><td align="center" style="font-size:14px;color:#9ca3af;line-height:22px;">This code expires in <strong style="color:#111827;">10 minutes</strong>.<br>Never share your OTP with anyone.</td></tr><tr><td align="center" style="padding-top:40px;font-size:12px;color:#c0c0c0;">© 2026 Your Company</td></tr></table></td></tr></table></body>`,
        });

        return res.status(200).json({
            success: true,
            message: "password matched, otp sent to email"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "login failed",
            error
        });
    }
};


// verify otp and login
const login = async (req, res) => {
    try {
        let { email, otp } = req.body;

        // existing user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        // check login status
        if (existingUser.isLogin) {
            return res.status(400).json({
                success: false,
                message: "already logged in"
            });
        }

        // check otp validation
        if (!existingUser.otp || existingUser.otp === "") {
            return res.status(400).json({
                success: false,
                message: "otp expired or invalid"
            });
        }

        // verify otp and generate token
        if (existingUser.otp == otp) {
            await User.findOneAndUpdate({ email }, { otp: "", isLogin: true });

            // jwt token
            // jwt.sign({data,secret,expire})
            let token = jwt.sign({
                _id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
                permission: existingUser.permission
            }, process.env.JWT_SECRET_ACCESS, {
                expiresIn: '1h'
            });

            return res.status(200).json({
                success: true,
                message: "login successful",
                accessToken: token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "otp not matched"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "verification failed",
            error
        });
    }
};


// private data
const getPrivateData = async (req, res) => {
    res.send('This is secured private data');
};

module.exports = { registrationUser, sendOtp, login, getPrivateData };