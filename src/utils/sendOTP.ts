import sendMail from './sendMail';

export default async function sendOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendMail(email, 'OTP for login', `Your OTP is ${otp}`, "");
    return otp;
}