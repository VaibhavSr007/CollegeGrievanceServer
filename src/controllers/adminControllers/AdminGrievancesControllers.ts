import { Request, Response } from 'express';
import { badRequest, serverError, statusOkay, unauthAccess } from "../../views/view";
import GrievanceModel from '../../models/Grievance';
import AdminModel from '../../models/Admins';

export async function getAdminGrievancesController(req: Request, res: Response) {
    try {
        if (!req.params.no) {
            badRequest(res);
            return;
        }
        const empNo = req.params.no.toUpperCase();
        const empData = await AdminModel.findOne({ empNo: empNo }).select("name dept");
        if (!empData) {
            unauthAccess(res);
            return;
        }
        const { name, dept } = empData;
        const grievances = await GrievanceModel.find({ relatedDepts: { $in: [dept, name]} });
        statusOkay(res, grievances);
    } catch(err) {
        serverError(res, err);
    }
}