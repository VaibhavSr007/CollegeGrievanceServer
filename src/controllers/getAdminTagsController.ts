import { Request, Response } from 'express';
import { serverError } from '../views/view';
import AdminModel from '../models/Admins';


export default async function getAdminTagsController(req: Request, res: Response) {
    try {
        const allTags = await AdminModel.aggregate([
            { $group: { _id: null, names: { $addToSet: '$name' }, depts: { $addToSet: '$dept' }}},
            { $project: { _id: 0, allTags: { $concatArrays: ['$names', '$depts'] }}},
            { $unwind: '$allTags' },
            { $group: { _id: null, allTags: { $addToSet: '$allTags' }}}
          ]);

        res.json(allTags[0].allTags);
    } catch(err) {
        serverError(res, err);
    }
}