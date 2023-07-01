import { Request, Response, NextFunction } from 'express';
import { unauthAccess } from '../views/view';
import jwt from 'jsonwebtoken';

interface jwtPayload {
    regNo: string,
    empNo: string,
    isAccessToken: boolean | null
}

export function AuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authrisationToken = req.headers.authorization;
        if (!authrisationToken) {
            unauthAccess(res);
            return;
        }
        const userNo = authrisationToken.split(' ')[1];
        const jwtToken = authrisationToken.split(' ')[2];
        const decodedjwt = (jwt.verify(jwtToken, (process.env.SECRET_KEY as string)) as jwtPayload)
        if (!decodedjwt || !decodedjwt.isAccessToken) {
            unauthAccess(res);
            return;
        }
        if ((decodedjwt.regNo && decodedjwt.regNo !== userNo) || (decodedjwt.empNo && decodedjwt.empNo !== userNo)){
            unauthAccess(res);
            return;    
        }
        next();
    } catch (err) {
        unauthAccess(res);
    }
}