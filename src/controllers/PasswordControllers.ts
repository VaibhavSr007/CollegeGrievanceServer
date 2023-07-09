import { Request, Response } from 'express';
import { badRequest, notFound, serverError, statusOkay, wrongCredentials } from "../views/view";
import { changeAdminPasswordController, sendAdminOTPController } from './adminControllers/PasswordControllers';
import { changeUserPasswordController, sendUserOTPController } from './userControllers/PasswordController';
import { redisClient } from '../redisClient';
import UserModel from '../models/Users';
import AdminModel from '../models/Admins';
import { encrypt } from '../utils/hash';


export async function changePasswordController(req: Request, res: Response) {
    try {
        const { regNo, empNo } = req.body;
        if (!regNo && !empNo) {
            badRequest(res);
            return;
        }
        if (regNo)
            changeUserPasswordController(req, res);
        else
            changeAdminPasswordController(req, res);
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function sendOTPController(req: Request, res: Response) {
    try {
        const userNum = req.params.no;
        if (!userNum) {
            badRequest(res);
            return;
        }
        if (userNum.toLowerCase() === userNum.toUpperCase())
            sendAdminOTPController(req, res);
        else
            sendUserOTPController(req, res);
    } catch(err) {
        serverError(res, err);
    }
}


export async function checkOTPController(req: Request, res: Response) {
    try {
        const { otp, userNum, newPass } = req.body;
        if (!otp || !userNum) {
            badRequest(res);
            return;
        }
        const realOTP = await redisClient.get(userNum + 'otp');
        if (!realOTP) {
            notFound(res);
            return;
        }
        if (otp === realOTP) {
            const pass = await encrypt(newPass);
            await redisClient.del(userNum + 'otp');
            if (userNum.toLowerCase() === userNum.toUpperCase())
                await AdminModel.updateOne({ empNo: userNum },{ $set: { pass } });
            else
                await UserModel.updateOne({ regNo: userNum }, { $set: { pass } });
            statusOkay(res, { message: "Password Changed Successfully" });
        }
        else
            wrongCredentials(res);
    } catch(err) {
        serverError(res, err);
    }
}