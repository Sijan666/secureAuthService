const User = require('../models/userSchema');
const permission = require('../permission');
const jwt = require('jsonwebtoken');

// regstration
const registrationUser = async (req, res) => {
    try {
        let { role = 'student', email } = req.body;
        let per;

        permission.map(item => {
            if (item.role == role) {
                per = item.permission;
            }
        });

        const user = await new User({
            email: email,
            role: role,
            permission: per
        }).save();

        res.status(201).json({
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Registration failed", 
            error });
    }
};

// login
const loginUser = async (req, res) => {
    try {
        let { email } = req.body;
        const existingUser = await User.findOne({ email: email });

        console.log(existingUser);
    
        // jwt.sign({data,secret,expire})
        let token = jwt.sign({
            _id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            permission: existingUser.permission
        }, process.env.JWT_SECRET_ACCESS, {
            expiresIn: '1h'
        });

        res.json({
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

// private data
const getPrivateData = async (req, res) => {
    res.send('This is secured private data');
};


module.exports = {registrationUser,loginUser,getPrivateData};