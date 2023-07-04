import { Request, Response, NextFunction } from 'express';
import { serverError, unauthAccess } from '../views/view';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import AdminModel from '../models/Admins';
import UserModel from '../models/Users';

interface jwtPayload {
    _id: ObjectId,
    isAccessToken: boolean
}

export async function AuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authrisationToken = req.headers.authorization;
        if (!authrisationToken) {
            unauthAccess(res);
            return;
        }
        const jwtToken = authrisationToken.split(' ')[1];
        const decodedjwt = (jwt.verify(jwtToken, (process.env.SECRET_KEY as string)) as jwtPayload);

        if (!decodedjwt || !decodedjwt.isAccessToken) {
            unauthAccess(res);
            return;
        }
        const userData = await AdminModel.findById({ _id: decodedjwt._id }).select("empNo");
        const empData = await UserModel.findById({ _id: decodedjwt._id }).select("regNo");
        if (!userData && !empData) {
            unauthAccess(res);
            return;
        }
        res.locals._id = decodedjwt._id;
        next();
    } catch (err) {
        serverError(res, err);
    }
}