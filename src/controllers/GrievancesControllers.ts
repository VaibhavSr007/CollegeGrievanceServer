import {Request, Response} from 'express';
import { badRequest, serverError, statusOkay, wrongCredentials } from '../views/view';
import { getUserGrievancesController } from './userControllers/GrievancesControllers';
import { getAdminGrievancesController } from './adminControllers/GrievancesControllers';
import GrievanceModel from '../models/Grievance';


export async function getGrievancesController(req: Request, res: Response) {
    try {
        if (res.locals.empNo)
        	getAdminGrievancesController(req, res);
        else
        	getUserGrievancesController(req, res);
    } catch(err) {
        serverError(res, err);
    }
}


export async function changeGrievanceStatusController(req: Request, res: Response) {
    try {
        if (!res.locals.empNo) {
            wrongCredentials(res);
            return;
        }
        const { _id, status, remark } = req.body;
        if (!req.body._id) {
            badRequest(res);
            return;
        }
        if (status)
            await GrievanceModel.findOneAndUpdate({ _id }, { status: status });
        else
            await GrievanceModel.findOneAndUpdate({ _id }, { $push: { remarks: [res.locals.name, remark] }, $set: { status: "opened" } });
        statusOkay(res, { message: "Grievance status changed successfully" });
    } catch(err) {
        serverError(res, err);
    }
}