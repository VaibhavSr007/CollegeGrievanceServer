import { Request, Response } from 'express';
import { badRequest, serverError, statusOkay, unauthAccess } from "../../views/view";
import GrievanceModel from '../../models/Grievance';
import AdminModel from '../../models/Admins';

export async function getAdminGrievancesController(req: Request, res: Response) {
    try {
        const empNo = req.params.no.toUpperCase();
        const empData = await AdminModel.findOne({ empNo: empNo }).select("name dept isSuperUser");
        if (!empData) {
            unauthAccess(res);
            return;
        }
        const { name, dept, isSuperUser } = empData;
        if (isSuperUser) {
            const grievances = await GrievanceModel.find();
            statusOkay(res, grievances);
        } else {
            const grievances = await GrievanceModel.find({ relatedDepts: { $in: [dept, name, "any"]} });
            statusOkay(res, grievances);
        }
    } catch(err) {
        serverError(res, err);
    }
}