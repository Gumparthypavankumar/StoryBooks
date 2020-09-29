const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'public'
    },
    allowComments:{
        type:Boolean,
        default:true
    },
    body:{
        type:String,
        required:true
    },
    comments:[{
        commentBody:{
            type:String,
            required:true
        },
        commentDate:{
            type:Date,
            default:Date.now
        },
        commentUser:{
            type: Schema.Types.ObjectId,
            ref:'users'
        }
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    date:{
        type:Date,
        default:Date.now
    }
});
//The third parameter is indicating that i dont want the default name which can be storys instead it should always be stories
mongoose.model('stories',StorySchema,'stories');