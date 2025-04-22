import mongoose,{Schema,Model,Document} from "mongoose";


export interface Message extends Document{
    content:string,
    createAt:Date,
}

const MessageSchema:Schema<Message> =  new Schema({
    content:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})


export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpire:string,
    message:Message[],
    isVerified:boolean,
    isAcceptingMessage:Boolean
}
const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/.+\@.+\..+/,'Please use a valid email']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code  is required"]
    },
    verifyCodeExpire:{
        type:String,
        required:[true,"Verify Code Expire  is required"]

    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false,
    },
    message:[MessageSchema]
},{timestamps:true})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))


export default UserModel