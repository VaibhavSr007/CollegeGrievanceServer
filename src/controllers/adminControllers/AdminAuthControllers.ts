import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { compare, encrypt } from '../../utils/hash';
import { badRequest, serverError, statusOkay, unauthAccess, wrongCredentials } from '../../views/view';
import AdminModel from '../../models/Admins';
config();

interface decodedTokenType {
    name: string,
    dept: number,
    email: string,
    empNo: string,
}


export async function registerAdminController(req: Request, res: Response) {
    try {
        const { name, empNo, dept, email, pass, isSuperUser} = req.body;
        if (!name || !empNo || !dept || !email || !pass || isSuperUser === undefined) {
            badRequest(res);
            return;
        }
        req.body.pass = await encrypt(req.body.pass);
        const newAdmin = new AdminModel(req.body);
        await newAdmin.save();
        statusOkay(res, {message: "Admin Added Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function deleteAdminController(req: Request, res: Response) {
    try {
        const empNo = req.params.no.toUpperCase();
        if (!empNo) {
            badRequest(res);
            return;
        }
        await AdminModel.deleteOne({empNo: empNo});
        statusOkay(res, {message: "Admin Deleted Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}


export async function loginAdminController(req: Request, res: Response) {
    try {
        const { empNo, pass } = req.body;
        if (!empNo || !pass) {
            badRequest(res);
            return;
        }
        const empData = await AdminModel.findOne({empNo: empNo});
        if (!empData || !await compare(pass, empData.pass!)) {
            wrongCredentials(res);
            return;
        }
        const { name, dept, email, isSuperUser } = empData;
        const accessToken = jwt.sign({ name, empNo, isSuperUser, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ empNo, isSuperUser, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, empNo, isSuperUser });
    }
     catch(err) {
        serverError(res, err);
    }
}


export async function issueAdminToken(req: Request, res: Response, decodedjwt: decodedTokenType) {
    try {
        const empData = await AdminModel.findOne({empNo: decodedjwt.empNo});
        if (!empData) {
            unauthAccess(res);
            return;
        }
        const { name, dept, empNo, email, isSuperUser } = empData;
        const accessToken = jwt.sign({ name, empNo, isSuperUser, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '1h'});
        const refreshToken = jwt.sign({ empNo, isSuperUser, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '10d'})
        statusOkay(res, { accessToken, refreshToken, name, empNo, isSuperUser })
    } catch(err) {
        unauthAccess(res);
    }
}


export async function changeAdminPasswordController(req: Request, res: Response) {
    try {
        const { empNo, pass, newPass } = req.body;
        if (!empNo || !pass || !newPass) {
            badRequest(res);
            return;
        }
        const empData = await AdminModel.findOne({empNo: empNo});
        if (!empData || !empData.pass){
            serverError(res, { message: "Admin Not Found" });
            return;
        }
        if (!await compare(pass, empData.pass)) {
            wrongCredentials(res);
            return;
        }
        empData.pass = await encrypt(newPass);
        await empData.save();
        statusOkay(res, {message: "Password Updated Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}