const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    image:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

mongoose.model('users',UserSchema);