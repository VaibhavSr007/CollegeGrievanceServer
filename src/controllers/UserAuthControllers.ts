import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { compare, encrypt } from '../utils/hash';
import { badRequest, serverError, statusOkay, wrongCredentials } from '../views/view';
import UsersModel from '../models/Users';
config();


export async function registerUsersController(req: Request, res: Response) {
    try {
        const { name, regNo, year, email, pass } = req.body;
        if (!name || !regNo || !year || !email || !pass) {
            badRequest(res);
            return;
        }
        req.body.pass = await encrypt(req.body.pass);
        const newUser = new UsersModel(req.body);
        await newUser.save();
        statusOkay(res, {message: "User Added Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function loginUsersController(req: Request, res: Response) {
    try {
        const { regNo, pass } = req.body;
        if (!regNo || !pass) {
            badRequest(res);
            return;
        }
        const regData = await UsersModel.findOne({regNo: regNo});
        if (!regData || !await compare(pass, regData.pass!)) {
            wrongCredentials(res);
            return;
        }
        const { name, year, email } = regData;
        const accessToken = jwt.sign({ name, email, regNo, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ regNo, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, year, email, regNo });
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function changePasswordController(req: Request, res: Response) {
    try {
        const { regNo, pass, newPass } = req.body;
        if (!regNo || !pass || !newPass) {
            badRequest(res);
            return;
        }
        const regData = await UsersModel.findOne({regNo: regNo});
        if (!regData || !regData.pass){
            serverError(res, { message: "User Not Found" });
            return;
        }
        if (!await compare(pass, regData.pass)) {
            wrongCredentials(res);
            return;
        }
        regData.pass = await encrypt(newPass);
        await regData.save();
        statusOkay(res, {message: "Password Updated Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}