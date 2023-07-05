import express from 'express';
import { createClient } from 'redis';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthMiddleWare } from './middleware/AuthMiddleware';
import { changeGrievanceStatusController, getGrievancesController } from './controllers/GrievancesControllers';
import { statusOkay } from './views/view';
import { deleteController, issueToken, loginController, registerController } from './controllers/AuthControllers';
import { postUserGrievancesController } from './controllers/userControllers/GrievancesControllers';
import { changePasswordController, sendOTPController } from './controllers/PasswordControllers';
import getAdminTagsController from './controllers/getAdminTagsController';

config();
const app = express();
app.use(express.json());
app.use(cors());
const client = createClient();


app.get('/ping', (_, res: Response) => statusOkay(res, {message: "Server Running"}));
app.get('/accesstoken', issueToken);
app.get('/forget-password', sendOTPController);
app.post('/login', loginController);
app.post('/register', registerController);
app.get('/tags', getAdminTagsController);

app.use(AuthMiddleWare);
app.get('/grievances', getGrievancesController);
app.post('/grievances', postUserGrievancesController);
app.post('/grievances/change-status/', changeGrievanceStatusController),
app.delete('/grievances/:no', deleteController);
app.post('/change-password', changePasswordController);

mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        console.clear();
        console.log(`Connected to MongoDB and Listening on Port ${process.env.PORT}`);
        app.listen(process.env.PORT);
    })
    // .then(() => client.on('error', err => console.log('Redis Client', err)))
    // .then(() => client.connect())
    .catch((err) => {
        console.clear();
        console.log("Can't connect to the MongoDB");
        console.log(err);
    })