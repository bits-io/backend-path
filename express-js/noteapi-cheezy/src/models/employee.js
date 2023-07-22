const mongoose = require('mongoose');

const Employee = mongoose.Schema({

    name : {
        type : String
    },
    designation : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    age : {
        type : Number
    },
    avatar : {
        type : String
    }

}, {timestamps : true});

module.exports = mongoose.model('Employee', Employee);  