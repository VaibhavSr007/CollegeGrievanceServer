"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const AuthMiddleware_1 = require("./middleware/AuthMiddleware");
const GrievancesControllers_1 = require("./controllers/GrievancesControllers");
const view_1 = require("./views/view");
const AuthControllers_1 = require("./controllers/AuthControllers");
const GrievancesControllers_2 = require("./controllers/userControllers/GrievancesControllers");
const PasswordControllers_1 = require("./controllers/PasswordControllers");
const getAdminTagsController_1 = __importDefault(require("./controllers/getAdminTagsController"));
const getProfileDataController_1 = __importDefault(require("./controllers/getProfileDataController"));
const compression_1 = __importDefault(require("compression"));
const AuthControllers_2 = require("./controllers/userControllers/AuthControllers");
const AuthControllers_3 = require("./controllers/adminControllers/AuthControllers");
const redisClient_1 = require("./redisClient");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Uncomment in the final commit
// app.use(cors({
//     origin: "https://vitb-grievances.aayush65.com/"
// }));
app.use((0, compression_1.default)({ level: 6, threshold: 1024 }));
app.get('/ping', (_, res) => (0, view_1.statusOkay)(res, { message: "Server Running" }));
app.get('/accesstoken', AuthControllers_1.issueToken);
app.get('/forget-password/:no', PasswordControllers_1.sendOTPController);
app.post('/otp-check', PasswordControllers_1.checkOTPController);
app.post('/login', AuthControllers_1.loginController);
app.post('/register', AuthControllers_2.registerUserController);
app.get('/tags', getAdminTagsController_1.default);
app.use(AuthMiddleware_1.AuthMiddleWare);
app.get('/grievances', GrievancesControllers_1.getGrievancesController);
app.post('/grievances', GrievancesControllers_2.postUserGrievancesController);
app.post('/grievances/change-status/', GrievancesControllers_1.changeGrievanceStatusController),
    app.delete('/grievances/:no', AuthControllers_1.deleteController);
app.get('/profile', getProfileDataController_1.default);
app.post('/register-admins', AuthControllers_3.registerAdminController);
app.post('/change-password', PasswordControllers_1.changePasswordController);
app.delete('/delete/:no', AuthControllers_1.deleteController);
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => {
    console.clear();
    console.log(`Connected to MongoDB and Listening on Port ${process.env.PORT}`);
    app.listen(process.env.PORT);
})
    .then(() => redisClient_1.redisClient.on('error', err => console.log('Redis Client', err)))
    .then(() => redisClient_1.redisClient.connect())
    .then(() => console.log('Connected to Redis'))
    .catch((err) => {
    console.clear();
    console.log("Can't connect to the MongoDB");
    console.log(err);
});
