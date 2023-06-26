import { Request, Response, NextFunction } from 'express';
import { unauthAccess } from '../views/view';
import jwt from 'jsonwebtoken';

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    const authrisationToken = req.headers.authorization;
    if (!authrisationToken) {
        unauthAccess(res);
        return;
    }
    const jwtToken = authrisationToken.split(' ')[1];
    if (!jwt.verify(jwtToken, (process.env.SECRET_KEY as string))) {
        unauthAccess(res);
        return;
    }
    next();
}