const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required : true,
    },
    role:{
        type: String,
        enum: ["student","teacher","admin"],
        default:"student"
    },
    permission:{
        type: [String]
    },
    otp:{
        type: String,
        default: ""
    },
    isLogin:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User',userSchema)