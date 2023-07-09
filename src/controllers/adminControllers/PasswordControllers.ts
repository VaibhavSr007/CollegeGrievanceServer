import { Request, Response } from 'express';
import { badRequest, notFound, serverError, statusOkay, wrongCredentials } from '../../views/view';
import { compare } from 'bcryptjs';
import AdminModel from '../../models/Admins';
import { encrypt } from '../../utils/hash';
import sendOTP from '../../utils/sendOTP';
import { redisClient } from '../../redisClient';


export async function changeAdminPasswordController(req: Request, res: Response) {
    try {
        const { empNo, pass, newPass } = req.body;
        if (!empNo || !pass || !newPass) {
            badRequest(res);
            return;
        }
        const empData = await AdminModel.findOne({empNo: empNo});
        if (!empData || !empData.pass){
            serverError(res, { message: "Admin Not Found" });
            return;
        }
        if (!await compare(pass, empData.pass)) {
            wrongCredentials(res);
            return;
        }
        empData.pass = await encrypt(newPass);
        await empData.save();
        statusOkay(res, {message: "Password Updated Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function sendAdminOTPController(req: Request, res: Response) {
    try {
        const empNo = req.params.no;
        if (!empNo) {
            badRequest(res);
            return;
        }
        const isOtpExists = await redisClient.exists(empNo + 'otp');
        if (isOtpExists) {
            statusOkay(res, { message: "OTP Already Sent" });
            return;
        }
        const regData = await AdminModel.findOne({ empNo });
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
        const hashedOTP = await encrypt(otp + '');
        await redisClient.setEx(empNo + 'otp', 5 * 60, hashedOTP);
        statusOkay(res, { message: "OTP Sent Successfully" });
    } catch(err) {  
        serverError(res, err);
    }
}