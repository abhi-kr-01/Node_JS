import { Router } from'express'
import  {login, registerUser, logoutUser, verifyEmail, refreshAccessToken, forgotPassword, resetForgotPassword, getCurrentUser, changePassword, ResendEmailVerification}  from '../controllers/auth.controller.js';
const router = Router();
import { validate } from '../middlewares/validator.middleware.js';
import { userRegisterValidator, loginUserValidator, userForgotPasswordValidator, userResetForgotPassworddVAlidator, userChangeCurrentPasswordValidator } from '../validators/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

//unsecured routes
router.post('/register',userRegisterValidator(), validate, registerUser);
router.post('/login',loginUserValidator(), validate, login);
router.route('/verify-email/:verificationToken').get(verifyEmail);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/forgot-password').post(userForgotPasswordValidator(),validate,forgotPassword);
router.route('/reset-password/:resetToken').post(userResetForgotPassworddVAlidator(),validate,resetForgotPassword);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/current-user').post(verifyJWT,getCurrentUser);
router.route('/change-password').post(verifyJWT,userChangeCurrentPasswordValidator(),changePassword);
router.route('/resend-email-verification').post(verifyJWT,ResendEmailVerification);

export default router