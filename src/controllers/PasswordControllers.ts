import { Request, Response } from 'express';
import { badRequest, serverError } from "../views/view";
import { changeAdminPasswordController, sendAdminOTPController } from './adminControllers/PasswordControllers';
import { changeUserPasswordController, sendUserOTPController } from './userControllers/PasswordController';


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