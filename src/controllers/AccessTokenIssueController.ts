import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { statusOkay, unauthAccess } from '../views/view';
import UserModel from '../models/Users';
import AdminModel from '../models/Admins';
config();

interface jwtPayload {
    regNo: string | null | undefined,
    empNo: string | null | undefined,
    isAccessToken: boolean | null
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
        if ((!decodedjwt.empNo && !decodedjwt.regNo) || decodedjwt.isAccessToken){
            unauthAccess(res);
            return;
        }
        
        if (decodedjwt.regNo) {
            // If The token request is from User Panel

            const regData = await UserModel.findOne({regNo: decodedjwt.regNo});
            if (!regData) {
                unauthAccess(res);
                return;
            }
            const { name, year, regNo, email } = regData;
            const accessToken = jwt.sign({ name, email, regNo, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
            const refreshToken = jwt.sign({ regNo, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
            statusOkay(res, { accessToken, refreshToken, name, year, email, regNo })  
        } else {
            // If The token request is from Admin Panel

            const empData = await AdminModel.findOne({empNo: decodedjwt.empNo});
            if (!empData) {
                unauthAccess(res);
                return;
            }
            const { name, dept, empNo, email, isSuperUser } = empData;
            const accessToken = jwt.sign({ name, dept, empNo, isSuperUser, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
            const refreshToken = jwt.sign({ empNo, isSuperUser, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
            statusOkay(res, { accessToken, refreshToken, name, dept, email, empNo, isSuperUser })
        }
    } catch(err) {
        unauthAccess(res);
    }
}