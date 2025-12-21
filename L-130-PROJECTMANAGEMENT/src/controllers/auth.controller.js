import { User } from "../models/user.model.js";
import { ApiResposne } from '../utils/api.response.js';
import { ApiError } from '../utils/api.error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import jwt from 'jsonwebtoken';


const generateAccessTokenAndRefreshTokens= async (userId) => {
    try {
       const user = await User.findById(userId);
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();

       user.refreshToken = refreshToken;
       await user.save({validateBeforeSave: false})
       return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something Went Wrong while generating accessToken")
    }
}


//register user
const registerUser = asyncHandler( async (req,res)=>{
    //importing data from frontend
    const { email, username, password, role } = req.body;

    //validating this user is already exist or not
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username aleady Exists", []);
    }

    //if user not register create it data in db
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    });

    // after set in db emailverification/generate temporarytoken is going on
    // to use all the methods make in schema we can access it from "user" not from "User"

    const {unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    //same token can be send to the user

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regestring user");
    }

    return res.status(201).json(
        new ApiResposne(200,{user: createdUser},"User Register Successfuly and verification Email has been send on your Email")
    )
})


//login user
const login = asyncHandler( async(req,res) => {
    const { username, email, password} = req.body;

    if(!email){
        throw new ApiError(400,"Email is required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400,"user doen't exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400,"password in  not correct");
    }

    const {accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    //cookies

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(new ApiResposne(200,{user: loggedInUser,
        accessToken,
        refreshToken,
    },"user loggedIn successfully"))

})


//logout user
const logoutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResposne(200, {} , "User logged out")
    )
})

const getCurrentUser = asyncHandler( async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResposne(200,req.user,"Current user fetch successfully")
    )
});



const verifyEmail = asyncHandler( async (req,res) => {
    const { verificationToken } = req.params

    if(!verificationToken){
        throw new ApiError(400,"Email verification Token is missing")
    }

    //hashed it again to obtain same hashed token
    let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex")

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {$gt : Date.now()}
    })

    if(!user){
        throw new ApiError(400, "Token is Invalid or expired")
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    User.isEmailVerified = true;
    await user.save({validateBeforeSave: false });

    return res
    .status(200)
    .json(
        new ApiResposne(200,
            {
                isEmailVerified: true
            },
            "Email is Verified"
        )
    )
});


const ResendEmailVerification = asyncHandler( async (req,res) => {
    const user = await User.findOne(req.user?._id);

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    if(user.isEmailVerified){
        throw new ApiError(409,"Email is already Verified")
    }

    //if not verified
    const {unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    //same token can be send to the user

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regestring user");
    }

    return res.status(201).json(
        new ApiResposne(200,{},"Mail has been send to your email id")
    )
})


const refreshAccessToken = asyncHandler( async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || read.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"UnAuthorised access")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id) 

        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

        User.refreshToken = newRefreshToken
        await user.save()

        return res
        .status(200)
        .cookies("accessToken",accessToken,options)
        .cookies("refreshToken",newRefreshToken,options)
        .json(
            new ApiResposne
            (
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access Token refreshed"
            )
        )
    }catch(err){
        throw new ApiError(401, "Invalid refreshToken");
    }
})


const forgotPassword = asyncHandler( async (req,res) => {
    const { email } = req.body 

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404," User does not Exists",[])
    }

    const { unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

    user.forgotPassword = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({
        validateBeforeSave: true
    })

    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}:/${unHashedToken}`
        )
    });

    return res
    .status(200)
    .json(
        new ApiResposne(
            200,
            {},
            "Password reset mail has been sent on your mail id"
        )
    )
});


const resetForgotPassword = asyncHandler( async (req,res) => {
    const {resetToken} = req.params
    const {newPassword} = req.body

    let hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    const user = await User.findOne({
        forgotPassword: hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    });

    if(!user){
        throw new ApiError(489,"Token is Invalid or expired")
    }

    user.forgotPassword = undefined
    user.forgotPasswordExpiry = undefined

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResposne(
            200,
            {},
            "Password reset successfully"
        )
    )
});


const changePassword = asyncHandler( async (req,res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid old Password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResposne(
            200,
            {},
            "Password Changed successfully"
        )
    )
});



export {registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    ResendEmailVerification,
    refreshAccessToken,
    forgotPassword,
    resetForgotPassword,
    changePassword
};