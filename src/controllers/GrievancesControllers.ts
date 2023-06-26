import {Request, Response} from 'express';
import GrievanceModel from '../models/Grievance';
import { badRequest, serverError } from '../views/view';

export async function getGrievancesController(req: Request, res: Response) {
    try {
        if (!req.params.regno) {
            badRequest(res);
            return;
        }
        const regNo = req.params.regno.toUpperCase();
        const grievances = await GrievanceModel.find({ regNo: regNo });
        res.json(grievances);
    } catch(err) {
        serverError(res, err);
    }
}

export async function postGrievancesController(req: Request, res: Response) {
    try {
        const { regNo, subject, complaint, relatedDepts } = req.body;
        if (!regNo || !subject || !complaint || !relatedDepts) {
            badRequest(res);
            return;
        }
        const status = 'pending';
        const grievanceObj = new GrievanceModel({ regNo, subject, complaint, relatedDepts, status  });
        await grievanceObj.save();
        res.json({ message: 'Grievance submitted successfully' });
    } catch(err) {
        serverError(res, err);
    }
}