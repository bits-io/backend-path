const mongoose = require("mongoose");

const imageScheme = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Image', imageScheme);