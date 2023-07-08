"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUserGrievancesController = exports.getUserGrievancesController = void 0;
const Grievance_1 = __importDefault(require("../../models/Grievance"));
const view_1 = require("../../views/view");
const redisClient_1 = require("../../redisClient");
function getUserGrievancesController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cachedData = yield redisClient_1.redisClient.get(res.locals.regNo);
            if (cachedData) {
                (0, view_1.statusOkay)(res, JSON.parse(cachedData));
                return;
            }
            const regNo = res.locals.regNo;
            const grievances = yield Grievance_1.default.find({ regNo });
            yield redisClient_1.redisClient.setEx(res.locals.regNo, 30 * 60, JSON.stringify(grievances));
            (0, view_1.statusOkay)(res, grievances);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.getUserGrievancesController = getUserGrievancesController;
function postUserGrievancesController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { subject, complaint, relatedDepts, isAnonymous } = req.body;
            const regNo = res.locals.regNo;
            if (!subject || !complaint || !relatedDepts) {
                (0, view_1.badRequest)(res);
                return;
            }
            const status = 'pending';
            const complaintDetails = { subject, complaint, relatedDepts, status, regNo };
            if (isAnonymous)
                complaintDetails.regNo = '';
            const grievanceObj = new Grievance_1.default(complaintDetails);
            yield grievanceObj.save();
            yield redisClient_1.redisClient.del(regNo);
            (0, view_1.statusOkay)(res, { message: 'Grievance submitted successfully' });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.postUserGrievancesController = postUserGrievancesController;
