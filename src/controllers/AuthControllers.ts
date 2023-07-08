import { Request, Response } from 'express';
import { badRequest, serverError, statusOkay } from '../views/view';
import { deleteAdminController, loginAdminController } from './adminControllers/AuthControllers';
import { deleteUserController, loginUserController } from './userControllers/AuthControllers';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { unauthAccess } from '../views/view';
import { ObjectId } from 'mongodb';
import UserModel from '../models/Users';
import AdminModel from '../models/Admins';
config();


interface jwtPayload {
    _id: ObjectId,
    isAccessToken: boolean
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
        const refreshJWTToken = refreshTokenHeader.split(' ')[1];
        if (!refreshJWTToken) {
            unauthAccess(res);
            return;
        }
        const decodedjwt = (jwt.verify(refreshJWTToken, (process.env.SECRET_KEY as string)) as jwtPayload);
        if (!decodedjwt._id || decodedjwt.isAccessToken){
            unauthAccess(res);
            return;
        }
        const _id = decodedjwt._id;
        const accessToken = jwt.sign({ _id, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ _id, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'});
    
        const userData = await UserModel.findById({ _id }).select("name regNo");
        const empData = await AdminModel.findById({ _id }).select("name empNo isSuperUser");
        if (userData) {
            const { name, regNo } = userData;
            statusOkay(res, { accessToken, refreshToken, name, regNo })  
        }
        else if (empData) {
            const { name, empNo, isSuperUser } = empData;
            statusOkay(res, { accessToken, refreshToken, name, empNo, isSuperUser })  
        }
        else
            unauthAccess(res);
    } catch(err) {
        unauthAccess(res);
    }
}