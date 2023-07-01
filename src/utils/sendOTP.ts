import { config } from 'dotenv';
import nodeMailer from 'nodemailer';
config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export function sendOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP for login',
        text: `Your OTP is ${otp}`
    }

    console.log("OTP:", otp);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error: ", error);
        } else {
            console.log("Email Sent");
        }
    })
}