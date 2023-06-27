import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { statusOkay, unauthAccess } from '../views/view';
import UsersModel from '../models/Users';
config();

interface jwtPayload {
    regNo: string | null,
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
        if (!decodedjwt.regNo || decodedjwt.isAccessToken){
            unauthAccess(res);
            return;    
        }
        const regData = await UsersModel.findOne({regNo: decodedjwt.regNo});
        if (!regData) {
            unauthAccess(res);
            return;
        }
        const { name, year, regNo, email } = regData;
        const accessToken = jwt.sign({ name, email, regNo, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '60s'});
        const refreshToken = jwt.sign({ regNo, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, year, email, regNo })
    } catch(err) {
        unauthAccess(res);
    }
}