import { Request, Response } from 'express';
import { serverError, statusOkay } from "../../views/view";
import GrievanceModel from '../../models/Grievance';


export async function getAdminGrievancesController(req: Request, res: Response) {
    try {
        const { name, dept, isSuperUser } = res.locals;
        const options = isSuperUser ? {} : { relatedDepts: { $in: [dept, name, "any"]} }
        const grievances = await GrievanceModel.find(options);
        statusOkay(res, grievances);
    } catch(err) {
        serverError(res, err);
    }
}