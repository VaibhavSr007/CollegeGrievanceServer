import { Request, Response } from 'express';
import { badRequest, serverError } from "../views/view";
import { changeAdminPasswordController } from './adminControllers/PasswordControllers';
import { changeUserPasswordController } from './userControllers/PasswordController';


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