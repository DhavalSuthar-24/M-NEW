import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            unique:true
        },
        content:{
            type:String,
            required:true
        },
        slug:{
            type:String,
            required:true,
            unique:true
        },
        category:{
            type:String,
            default:"Uncategarized"
        },
        image:{
            type:String,
            default:'https://imgs.search.brave.com/b00UMjTmq2RRRWOIbJawgeyK3azovt_61Xde521EzRg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/YmxvZ3R5cmFudC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTkvMDcvZHJhZnQt/YS1wb3N0LmpwZw'
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            // required:true
        },
        // isAdmin:{
        //     type:Boolean,
        //     default:false
        // }
    },{
        timestamps:true
    }
)
export const Post = mongoose.model("Post",postSchema)
