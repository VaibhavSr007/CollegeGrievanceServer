import {Request, Response} from 'express';
import { badRequest, serverError } from '../views/view';
import { getUserGrievancesController } from './userControllers/GrievancesControllers';
import { getAdminGrievancesController } from './adminControllers/GrievancesControllers';

export async function getGrievancesController(req: Request, res: Response) {
    try {
        const num = req.params.no;
        if (!num) {
            badRequest(res);
            return;
        }
        if (num.toLowerCase() === num.toUpperCase())
            getAdminGrievancesController(req, res);
        else
            getUserGrievancesController(req, res);
    } catch(err) {
        serverError(res, err);
    }
}