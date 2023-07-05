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
        const empData = await AdminModel.findById({ _id: decodedjwt._id });
        const userData = await UserModel.findById({ _id: decodedjwt._id });
        if (!userData && !empData) {
            unauthAccess(res);
            return;
        }
        res.locals._id = decodedjwt._id;
        if (userData) {
            res.locals.name = userData.name;
            res.locals.regNo = userData.regNo;
            res.locals.email = userData.email;
            res.locals.year = userData.year;
        } 
        if (empData) {
            res.locals.name = empData.name;
            res.locals.empNo = empData.empNo;
            res.locals.email = empData.email;
            res.locals.dept = empData.dept;
            res.locals.isSuperUser = empData.isSuperUser;
        }
        next();
    } catch (err) {
        unauthAccess(res);
    }
}