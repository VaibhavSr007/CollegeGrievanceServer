import {Request, Response} from 'express';
import { badRequest, serverError } from '../views/view';
import { getUserGrievancesController } from './userControllers/GrievancesControllers';
import { getAdminGrievancesController } from './adminControllers/GrievancesControllers';
import AdminModel from '../models/Admins';
import UserModel from '../models/Users';

export async function getGrievancesController(req: Request, res: Response) {
    try {
        const _id = res.locals._id;
        const { empNo } = (await AdminModel.findOne({ _id }).select("empNo") as {empNo: string}) || { empNo : "" };
        const { regNo } = (await UserModel.findOne({ _id }).select("regNo") as {regNo: string}) || { regNo : "" };

        if (empNo)
        	getAdminGrievancesController(req, res);
        else if (regNo){
            res.locals.regNo = regNo;
        	getUserGrievancesController(req, res);
        }
        else {
            badRequest(res);
            return;
        }
    } catch(err) {
        serverError(res, err);
    }
}