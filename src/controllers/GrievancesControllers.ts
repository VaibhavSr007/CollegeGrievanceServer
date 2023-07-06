import {Request, Response} from 'express';
import { badRequest, notFound, serverError, statusOkay, wrongCredentials } from '../views/view';
import { getUserGrievancesController } from './userControllers/GrievancesControllers';
import { getAdminGrievancesController } from './adminControllers/GrievancesControllers';
import GrievanceModel from '../models/Grievance';
import sendMail from '../utils/sendMail';
import UserModel from '../models/Users';


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
        const mailOptions = { subject: "", body: "", html: "" };
        const options: any[] = [{ _id }];
        if (status){
            options.push({ status });
            options.push({ new: true });
            mailOptions.subject = `Your complaint status has changed`;
            mailOptions.body = `Your complaint status of id:${_id} changed to ${status}`;
            mailOptions.html = `<p>Your complaint status of id:${_id} changed to ${status}</p><br /><p>Click <a href="${'https://vitb-grievances.aayush65.com/'}">here</a> for more details</p>`;
        } else {
            options.push({ $push: { remarks: [res.locals.name, remark] }, $set: { status: "opened" } })
            options.push({ new: true });
            mailOptions.subject = `A new remark added to your grievance`;
            mailOptions.body = `A new remark has been added to your grievance of id:${_id} \n Latest Remark:  ${remark}`;
            mailOptions.html = `<p>A new remark has been added to your grievance of id:${_id}<br/><p>Latest Remark:  ${remark}<br/>Visit for more information: <a href="${'https://vitb-grievances.aayush65.com/'}">here</a></p>`;
        }
        const response = await GrievanceModel.findOneAndUpdate(...options);
        if (!response) {
            notFound(res);
            return;
        }
        const { regNo } = response;
        if (regNo) {
            const userData = await UserModel.findOne({ regNo }).select("email");
            if (!userData) {
                notFound(res);
                return;
            }
            const { email } = userData;
            sendMail((email as string), mailOptions.subject, mailOptions.body, mailOptions.html);
        }
        statusOkay(res, { message: "Grievance status changed successfully" });
    } catch(err) {
        serverError(res, err);
    }
}