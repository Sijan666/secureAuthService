const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    email: {
        type: String,
    },
    role:{
        type: String,
        enum: ["student","teacher","admin"],
        default:"student"
    },
    permission:{
        type: [String],
    }
})

module.exports = mongoose.model('User',userSchema)