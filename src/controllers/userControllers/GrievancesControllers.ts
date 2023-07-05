import {Request, Response} from 'express';
import GrievanceModel from '../../models/Grievance';
import { badRequest, statusOkay, serverError } from '../../views/view';


export async function getUserGrievancesController(req: Request, res: Response) {
    try {
        const regNo = res.locals.regNo;
        const grievances = await GrievanceModel.find({ regNo });
        statusOkay(res, grievances);
    } catch(err) {
        serverError(res, err);
    }
}


export async function postUserGrievancesController(req: Request, res: Response) {
    try {
        const { subject, complaint, relatedDepts, isAnonymous } = req.body;
        const regNo = res.locals.regNo;
        if (!subject || !complaint || !relatedDepts) {
            badRequest(res);
            return;
        }
        const status = 'pending';
        const complaintDetails = { subject, complaint, relatedDepts, status, regNo };
        if (isAnonymous)
            complaintDetails.regNo = '';
        const grievanceObj = new GrievanceModel(complaintDetails);
        await grievanceObj.save();
        statusOkay(res, { message: 'Grievance submitted successfully' });
    } catch(err) {
        serverError(res, err);
    }
}