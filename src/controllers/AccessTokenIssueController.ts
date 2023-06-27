import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { unauthAccess } from '../views/view';
config();

export async function issueToken(req: Request, res: Response) {
    try {
        const refreshTokenHeader = req.headers.authorization;
        if (!refreshTokenHeader) {
            unauthAccess(res);
            return;
        }
        const refreshToken = refreshTokenHeader.split(' ')[1];
        if (!refreshToken) {
            unauthAccess(res);
            return;
        }
        const decodedjwt = jwt.verify(refreshToken, (process.env.SECRET_KEY as string));
        


    } catch(err) {
        unauthAccess(res);
    }
    const { email, password } = req.body;
    const token = jwt.sign({ email, password }, process.env.TOKEN_SECRET!, { expiresIn: '1h' });
    res.json(token);
}