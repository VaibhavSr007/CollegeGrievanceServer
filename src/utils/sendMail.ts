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


export default async function sendMail(email: string, subject: string, text: string, html: string) {
    const mailOptions = {
        from: process.env.EMAIL,    
        to: email,
        html,
        subject,
        text,
    }
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}