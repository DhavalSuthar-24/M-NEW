import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
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
        //   required:true
        },
        image1:{
            type:String,
            default:null
        },
        image2:{
            type:String,
            default:null
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            // required:true
        },
        quantity:{
            type:Number,
            default:3
        },
        price:{
            type:Number,
            default:333
        },size:{
            type:String,
            default:'x'    
            
        }

        // isAdmin:{
        //     type:Boolean,
        //     default:false
        // }
    },{
        timestamps:true
    }
)
export const Product = mongoose.model("Product",productSchema)
