import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import UserModel from '../../models/Users';
import { encrypt } from '../../utils/hash';
import { badRequest, serverError, wrongCredentials, statusOkay, notFound } from '../../views/view';
import sendOTP from '../../utils/sendOTP';
import { redisClient } from '../../redisClient';


export async function changeUserPasswordController(req: Request, res: Response) {
    try {
        const { regNo, pass, newPass } = req.body;
        if (!regNo || !pass || !newPass) {
            badRequest(res);
            return;
        }
        const regData = await UserModel.findOne({regNo: regNo});
        if (!regData || !regData.pass){
            serverError(res, { message: "User Not Found" });
            return;
        }
        if (!await compare(pass, regData.pass)) {
            wrongCredentials(res);
            return;
        }
        regData.pass = await encrypt(newPass);
        await regData.save();
        statusOkay(res, {message: "Password Updated Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function sendUserOTPController(req: Request, res: Response) {
    try {
        const regNo = req.params.no;
        if (!regNo) {
            badRequest(res);
            return;
        }
        const isOtpExists = await redisClient.exists(regNo + 'otp');
        if (isOtpExists) {
            statusOkay(res, { message: "OTP Already Sent" });
            return;
        }
        const regData = await UserModel.findOne({ regNo });
        if (!regData) {
            notFound(res);
            return;
        }
        const { email } = regData;
        if (!email) {
            notFound(res);
            return;
        }
        const otp = await sendOTP(email);
        await redisClient.setEx(regNo + 'otp', 5 * 60, otp + '');
        statusOkay(res, { message: "OTP Sent Successfully" });
    } catch(err) {  
        serverError(res, err);
    }
}