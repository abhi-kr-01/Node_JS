import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is inValid"),

        body("username")
        .trim()
        .isEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("useername must be in Lowercase")
        .isLength({min: 3})
        .withMessage("username must be at least 3 characters long"),

        body("password")
        .trim()
        .isEmpty()
        .withMessage("passsword is required"),

        body("fullname")
        .optional()
        .trim()
    ]
}

const loginUserValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email must be required")
        .isEmail()
        .withMessage("Email is invalid"),

        body("passsword")
        .trim()
        .notEmpty()
        .withMessage("password dis required"),
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old Password is required"),

        body("newPassword")
        .notEmpty()
        .withMessage("new Password is required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Email is Invalid"),       
    ]
}

const userResetForgotPassworddVAlidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

export {
    userRegisterValidator,
    loginUserValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPassworddVAlidator
}