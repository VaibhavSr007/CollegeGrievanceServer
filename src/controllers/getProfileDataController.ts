import { Request, Response } from 'express';
import { serverError, statusOkay } from '../views/view';

export default async function getAdminTagsController(req: Request, res: Response) {
    try {
        if (res.locals.empNo) {
            const { name, empNo, isSuperUser, email, dept } = res.locals;
            statusOkay(res, { name, empNo, isSuperUser, email, dept });
        } else {
            const { name, regNo, email, year } = res.locals;
            statusOkay(res, { name, regNo, email, year });
        }
    } catch(err) {
        serverError(res, err);
    }
}