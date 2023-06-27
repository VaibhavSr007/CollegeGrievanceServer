import { Request, Response, NextFunction } from 'express';
import { unauthAccess } from '../views/view';
import jwt from 'jsonwebtoken';

interface jwtPayload {
    regNo: string | null,
    isAccessToken: boolean | null
}

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authrisationToken = req.headers.authorization;
        if (!authrisationToken) {
            unauthAccess(res);
            return;
        }
        const jwtToken = authrisationToken.split(' ')[1];
        const decodedjwt = (jwt.verify(jwtToken, (process.env.SECRET_KEY as string)) as jwtPayload)
        if (!decodedjwt || !decodedjwt.isAccessToken) {
            unauthAccess(res);
            return;
        }
        next();
    } catch (err) {
        unauthAccess(res);
    }
}