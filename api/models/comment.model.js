import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },postId:{
        type:String,
        ref:"Post",
        required:true

    },
    userId:{
        type:String,
        required:true,

    },
    stars:{
        type:Number,
        default:0
    },
    likes:{
        type:Array,
        default:[],
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})
export const Comment = mongoose.model("Comment",commentSchema)