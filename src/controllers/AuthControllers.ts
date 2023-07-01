import { Request, Response } from 'express';
import { badRequest, serverError } from '../views/view';
import { changeAdminPasswordController, deleteAdminController, issueAdminToken, loginAdminController, registerAdminController } from './adminControllers/AdminAuthControllers';
import { changeUserPasswordController, deleteUserController, issueUserToken, loginUserController, registerUserController } from './userControllers/UserAuthControllers';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { unauthAccess } from '../views/view';
config();


interface jwtPayload {
    regNo: string,
    empNo: string,
    isAccessToken: boolean | null
    name: string,
    year: number,
    email: string,
    dept: number,
}


export async function registerController(req: Request, res: Response) {
    try {
        const { regNo, empNo } = req.body;
        if (!regNo && !empNo) {
            badRequest(res);
            return;
        }
        if (regNo)
            registerUserController(req, res);
        else
            registerAdminController(req, res);
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function deleteController(req: Request, res: Response) {
    try {
        const userNum = req.params.no;
        if (!userNum) {
            badRequest(res);
            return;
        }
        if (userNum.toLowerCase() === userNum.toUpperCase())
            deleteAdminController(req, res);
        else
            deleteUserController(req, res);
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function loginController(req: Request, res: Response) {
    try {
        const { regNo, empNo } = req.body;
        if (!regNo && !empNo) {
            badRequest(res);
            return;
        }
        if (regNo)
            loginUserController(req, res);
        else
        loginAdminController(req, res);
    } catch(err) {
        serverError(res, err);
    }
}


export async function issueToken(req: Request, res: Response) {
    try {
        const refreshTokenHeader = req.headers.authorization;
        if (!refreshTokenHeader) {
            unauthAccess(res);
            return;
        }
        const userNum = refreshTokenHeader.split(' ')[1];
        const refreshJWTToken = refreshTokenHeader.split(' ')[2];
        if (!refreshJWTToken) {
            unauthAccess(res);
            return;
        }
        const decodedjwt = (jwt.verify(refreshJWTToken, (process.env.SECRET_KEY as string)) as jwtPayload);
        if ((!decodedjwt.empNo && !decodedjwt.regNo) || decodedjwt.isAccessToken){
            unauthAccess(res);
            return;
        }
        if ((decodedjwt.regNo && decodedjwt.regNo !== userNum) || (decodedjwt.empNo && decodedjwt.empNo !== userNum)){
            unauthAccess(res);
            return;
        }

        if (decodedjwt.regNo)
            issueUserToken(req, res, decodedjwt)
        else
            issueAdminToken(req, res, decodedjwt)
    } catch(err) {
        unauthAccess(res);
    }
}


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