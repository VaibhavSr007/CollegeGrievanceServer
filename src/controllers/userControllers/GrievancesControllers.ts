import {Request, Response} from 'express';
import GrievanceModel from '../../models/Grievance';
import { badRequest, statusOkay, serverError } from '../../views/view';

export async function getUserGrievancesController(req: Request, res: Response) {
    try {
        const regNo = req.params.no.toUpperCase();
        const grievances = await GrievanceModel.find({ regNo: regNo });
        statusOkay(res, grievances);
    } catch(err) {
        serverError(res, err);
    }
}

export async function postUserGrievancesController(req: Request, res: Response) {
    try {
        const { regNo, subject, complaint, relatedDepts } = req.body;
        if (!subject || !complaint || !relatedDepts) {
            badRequest(res);
            return;
        }
        const status = 'pending';
        const grievanceObj = new GrievanceModel({ regNo, subject, complaint, relatedDepts, status  });
        await grievanceObj.save();
        statusOkay(res, { message: 'Grievance submitted successfully' });
    } catch(err) {
        serverError(res, err);
    }
}