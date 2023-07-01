import {Request, Response} from 'express';
import { badRequest, serverError } from '../views/view';
import { getUserGrievancesController } from './userControllers/UserGrievancesControllers';
import { getAdminGrievancesController } from './adminControllers/AdminGrievancesControllers';

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