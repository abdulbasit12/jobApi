let mongoose = require('mongoose');

// User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    gender:{
        type:String,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    profession:{
        type:String,
        required: true
    },
    role:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});

const User = module.exports = mongoose.model('User', userSchema);