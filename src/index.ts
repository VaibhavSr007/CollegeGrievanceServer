import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { changePasswordController, loginUsersController, registerUsersController } from './controllers/UserAuthControllers';
import { AuthMiddleWare } from './middleware/AuthMiddleware';
import { getGrievancesController, postGrievancesController } from './controllers/GrievancesControllers';
import { issueToken } from './controllers/AccessTokenIssueController';
import { statusOkay } from './views/view';


config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/ping', (req: Request, res: Response) => statusOkay(res, {message: "Server Running"}));

// For normal users
app.get('/accesstoken', issueToken);
app.post('/register', registerUsersController);
app.post('/login', loginUsersController);

//  For Admins


app.use(AuthMiddleWare);
app.get('/grievances/:regno', getGrievancesController);
app.post('/grievances', postGrievancesController);
app.post('/change-password', changePasswordController);

mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.clear();
    console.log(`Connected to MongoDB and Listening on Port ${process.env.PORT}`);
    app.listen(process.env.PORT);
}).catch((err) => {
    console.clear();
    console.log("Can't connect to the MongoDB");
    console.log(err);
})