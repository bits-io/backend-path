const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const featureScheme = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    qty : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    itemId : {
        type : ObjectId,
        ref : 'Item'
    }
});

module.exports = mongoose.model('Feature', featureScheme);