import mongoose,{ Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto,{createHmac} from 'node:crypto'

const userschema = new Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String,
            },
            default: {
                url: 'https://placehold.co/200x200',
                localPath:"",
            }
        },
        username: {
            type: String,
            required: [true,"username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String
        },
        forgotPassword: {
            type: String
        },
        forgotPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// preHooks

userschema.pre("save", async function(next) {

    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
})

// matching password from existing password from db 

userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}
// it return true/false password same or not ?

//json web token -- with data

userschema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

//refresh token

userschema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
        _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
)
}

//json web token without token - for password reset/verifying user

userschema.methods.generateTemporaryToken = function (){
   const unHashedToken =  crypto.randomBytes(20).toString("hex");

   const hasheToken = crypto.createHmac('sha256').update(unHashedToken).digest('hex');

   const tokenExpiry = Date.now() + (20*60*1000)  // 20 min

   return { unHashedToken, hasheToken, tokenExpiry};
}

export const User = mongoose.model('Users',userschema);
