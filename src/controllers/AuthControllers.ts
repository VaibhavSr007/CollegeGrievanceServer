import {Request, Response} from 'express';
import UsersModel from '../models/Users';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { compare, encrypt } from '../utils/hash';
import { badRequest, serverError, statusOkay, unauthAccess } from '../views/view';
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
        const addUser = await newUser.save();
        statusOkay(res, addUser);
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
            unauthAccess(res);
            return;
        }
        const accessToken = jwt.sign({ regNo }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ regNo }, (process.env.SECRET_KEY as string), {expiresIn: '90d'})
        statusOkay(res, { accessToken, refreshToken });
    }
     catch {
        res.status(500).json({message: "Error"});
    }
    
}