import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { compare, encrypt } from '../../utils/hash';
import { badRequest, serverError, statusOkay, unauthAccess, wrongCredentials } from '../../views/view';
import UserModel from '../../models/Users';
config();


interface decodedTokenType {
    name: string,
    year: number,
    email: string,
    regNo: string,
}


export async function registerUserController(req: Request, res: Response) {
    try {
        const { name, regNo, year, email, pass } = req.body;
        if (!name || !regNo || !year || !email || !pass) {
            badRequest(res);
            return;
        }
        req.body.pass = await encrypt(req.body.pass);
        const newUser = new UserModel(req.body);
        await newUser.save();
        statusOkay(res, {message: "User Added Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function deleteUserController(req: Request, res: Response) {
    try {
        const regNo = req.params.no.toUpperCase();
        if (!regNo) {
            badRequest(res);
            return;
        }
        await UserModel.deleteOne({regNo: regNo});
        statusOkay(res, {message: "User Deleted Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function loginUserController(req: Request, res: Response) {
    try {
        const { regNo, pass } = req.body;
        if (!regNo || !pass) {
            badRequest(res);
            return;
        }
        const regData = await UserModel.findOne({regNo: regNo});
        if (!regData || !await compare(pass, regData.pass!)) {
            wrongCredentials(res);
            return;
        }
        const { name, year, email } = regData;
        const accessToken = jwt.sign({ name, regNo, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ regNo, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, regNo });
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function issueUserToken(req: Request, res: Response, decodedjwt: decodedTokenType) {
    try {
        const regData = await UserModel.findOne({regNo: decodedjwt.regNo});
        if (!regData) {
            unauthAccess(res);
            return;
        }
        const { name, year, regNo, email } = regData;
        const accessToken = jwt.sign({ name, regNo, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ regNo, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, regNo })  
    } catch(err) {
        unauthAccess(res);
    }
}