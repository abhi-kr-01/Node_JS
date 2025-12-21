// In this part of code we learn how to generate the EMAIL

import Mailgen from 'mailgen';

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: " Welcome to our App! we are excited to have you on board",
            action: {
                instructions: "To Verify your email Please Click on the following button",
                button: {
                    color: "#22BC66",
                    text: "verify your email",
                    link: verificationUrl,
                }
            },
            outro: "Need help, or have question? just reply to this email, we'd love to help.",
        }
    }
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of your account",
            action: {
                instructions: "To reset your password. click on the button to reset password",
                button: {
                    color: "#22BC66",
                    text: "reset password",
                    link: passwordResetUrl,
                }
            },
            outro: "Need help, or have question? just reply to this email, we'd love to help.",
        }
    }
};



// ================> sending mail <==============================

import nodemailer from 'nodemailer';

// right now it doesn't send email it just preparing the email and then write the transporter to send email
const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Task Manager',
            link: "https://taskManagerlink.com"
        }        
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    })

    const mail = {
        from: "mail.taskmanager@exmaple.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    }

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Email service Failed silently. Make sure that  you have provided MAILTRAP credentials in .env file",error);
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}