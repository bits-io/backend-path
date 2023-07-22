const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const usersScheme = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

usersScheme.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
});

module.exports = mongoose.model('User', usersScheme);