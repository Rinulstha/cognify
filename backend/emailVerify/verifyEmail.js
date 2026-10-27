import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    const mailConfigurations = {

        // It should be a string of sender/server email
        from: process.env.MAIL_USER,

        to: email,

        // Subject of Email
        subject: 'Email Verification',

        // This would be the text of email body
        text: `Hi! There, You have recently visited 
        our website and registered with us. To complete your registration, we need to verify your email address.
        Please follow the given link to verify your email
        http://localhost:5173/verify/${token} 
        Thanks`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });
}



