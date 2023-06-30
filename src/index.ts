import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthMiddleWare } from './middleware/AuthMiddleware';
import { getGrievancesController, postGrievancesController } from './controllers/GrievancesControllers';
import { statusOkay } from './views/view';
import { changePasswordController, issueToken, loginController, registerController } from './controllers/AuthControllers';


config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/ping', (_, res: Response) => statusOkay(res, {message: "Server Running"}));
app.get('/accesstoken', issueToken);
app.post('/login', loginController);
app.post('/register', registerController);

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