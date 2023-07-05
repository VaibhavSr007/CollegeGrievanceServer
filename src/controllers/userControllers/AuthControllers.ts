import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { compare, encrypt } from '../../utils/hash';
import { badRequest, serverError, statusOkay, unauthAccess, wrongCredentials } from '../../views/view';
import UserModel from '../../models/Users';
config();


export async function registerUserController(req: Request, res: Response) {
    try {
        const { name, year, email, pass } = req.body;
        if (!name || !year || !email || !pass) {
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
        await UserModel.deleteOne({regNo: regNo});
        statusOkay(res, {message: "User Deleted Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function loginUserController(req: Request, res: Response) {
    try {
        const { regNo, pass } = req.body;
        if (!pass) {
            badRequest(res);
            return;
        }
        const regData = await UserModel.findOne({ regNo }).select("_id name pass");
        if (!regData || !await compare(pass, regData.pass!)) {
            wrongCredentials(res);
            return;
        }
        const { _id, name } = regData;
        const accessToken = jwt.sign({ _id, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ _id, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, regNo });
    }
     catch(err) {
        serverError(res, err);
    }
}