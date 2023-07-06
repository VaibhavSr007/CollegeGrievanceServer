import { Request, Response } from 'express';
import { serverError, statusOkay } from '../views/view';
import AdminModel from '../models/Admins';


export default async function getAdminTagsController(req: Request, res: Response) {
    try {
        const allTags = await AdminModel.aggregate([
            { $group: { _id: null, names: { $addToSet: '$name' }, depts: { $addToSet: '$dept' }}},
            { $project: { _id: 0, allTags: { $concatArrays: ['$names', '$depts'] }}},
            { $unwind: '$allTags' },
            { $group: { _id: null, allTags: { $addToSet: '$allTags' }}}
        ]);
        if (allTags.length)
            statusOkay(res, allTags[0].allTags);
        else
            statusOkay(res, []);
    } catch(err) {
        serverError(res, err);
    }
}