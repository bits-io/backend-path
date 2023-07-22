const mongoose = require('mongoose')
const crypto = require('crypto')

// User Scheme
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    name:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt:{
        type: String
    },
    role:{
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink:{
        data: String,
        default: ''
    }
},{
    timestamps: true
});

// Virtual Password
userSchema.virtual('password').set(function(password){
    this.password = this.password;
    this.salt = this.makesalt();
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
});

// Call method
userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password){
        if (!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
            // Now we need update the password
            .update(password)
            .digest('hex');
        } catch(error) {
            return ''
        }
    },

    makesalt: function(){
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }

}

module.exports = mongoose.model('User', userSchema);