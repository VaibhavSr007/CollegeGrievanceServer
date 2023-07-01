import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import UserModel from '../../models/Users';
import { encrypt } from '../../utils/hash';
import { badRequest, serverError, wrongCredentials, statusOkay, unauthAccess } from '../../views/view';
import { sendOTP } from '../../utils/sendOTP';


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
    const regNo = req.params.no;
    const regData = await UserModel.findOne({ regNo });
    if (!regData) {
        unauthAccess(res);
        return;
    }
    const { email } = regData;
    if (!email) {
        unauthAccess(res);
        return;
    }
    sendOTP(email);
}