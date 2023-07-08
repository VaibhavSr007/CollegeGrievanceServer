import {Request, Response} from 'express';
import GrievanceModel from '../../models/Grievance';
import { badRequest, statusOkay, serverError } from '../../views/view';
import { redisClient } from '../../redisClient';


export async function getUserGrievancesController(req: Request, res: Response) {
    try {
        const cachedData = await redisClient.get(res.locals.regNo);
        if (cachedData) {
            statusOkay(res, JSON.parse(cachedData));
            return;
        }
        const regNo = res.locals.regNo;
        const grievances = await GrievanceModel.find({ regNo });
        await redisClient.setEx(res.locals.regNo, 30 * 60, JSON.stringify(grievances));
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
        await redisClient.del(regNo);
        statusOkay(res, { message: 'Grievance submitted successfully' });
    } catch(err) {
        serverError(res, err);
    }
}