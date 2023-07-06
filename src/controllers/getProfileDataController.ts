import { Request, Response } from 'express';
import { serverError, statusOkay } from '../views/view';

export default async function getAdminTagsController(req: Request, res: Response) {
    try {
        if (res.locals.empNo) {
            const { email, dept } = res.locals;
            statusOkay(res, { email, dept });
        } else {
            const { email, year } = res.locals;
            statusOkay(res, { email, year });
        }
    } catch(err) {
        serverError(res, err);
    }
}