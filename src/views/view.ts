import { Response } from 'express'; 

export function badRequest(res: Response) {
    res.status(400).json({message: 'Bad Request'});
}

export function unauthAccess(res: Response) {
    res.status(401).json({message: 'Unauthorised Access'});
}

export function serverError(res: Response, err: unknown) {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'});
}

export function statusOkay(res: Response, message: any) {
    res.status(200).json(message);
}