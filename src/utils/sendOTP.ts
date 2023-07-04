import { config } from 'dotenv';
import nodeMailer from 'nodemailer';
config();

const transporter = nodeMailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export default async function sendOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(process.env.EMAIL, email);
    const mailOptions = {
        from: process.env.EMAIL,    
        to: email,
        subject: 'OTP for login',
        text: `Your OTP is ${otp}`
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
    return otp;
}