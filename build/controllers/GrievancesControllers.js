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
exports.changeGrievanceStatusController = exports.getGrievancesController = void 0;
const view_1 = require("../views/view");
const GrievancesControllers_1 = require("./userControllers/GrievancesControllers");
const GrievancesControllers_2 = require("./adminControllers/GrievancesControllers");
const Grievance_1 = __importDefault(require("../models/Grievance"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const Users_1 = __importDefault(require("../models/Users"));
function getGrievancesController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.empNo)
                (0, GrievancesControllers_2.getAdminGrievancesController)(req, res);
            else
                (0, GrievancesControllers_1.getUserGrievancesController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.getGrievancesController = getGrievancesController;
function changeGrievanceStatusController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!res.locals.empNo) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            const { _id, status, remark } = req.body;
            if (!req.body._id) {
                (0, view_1.badRequest)(res);
                return;
            }
            const mailOptions = { subject: "", body: "", html: "" };
            const options = [{ _id }];
            if (status) {
                options.push({ status });
                options.push({ new: true });
                mailOptions.subject = `Your complaint status has changed`;
                mailOptions.body = `Your complaint status of id:${_id} changed to ${status}`;
                mailOptions.html = `<p>Your complaint status of id:${_id} changed to ${status}</p><br /><p>Click <a href="${'https://vitb-grievances.aayush65.com/'}">here</a> for more details</p>`;
            }
            else {
                options.push({ $push: { remarks: [res.locals.name, remark] }, $set: { status: "opened" } });
                options.push({ new: true });
                mailOptions.subject = `A new remark added to your grievance`;
                mailOptions.body = `A new remark has been added to your grievance of id:${_id} \n Latest Remark:  ${remark}`;
                mailOptions.html = `<p>A new remark has been added to your grievance of id:${_id}<br/><p>Latest Remark:  ${remark}<br/>Visit for more information: <a href="${'https://vitb-grievances.aayush65.com/'}">here</a></p>`;
            }
            const response = yield Grievance_1.default.findOneAndUpdate(...options);
            if (!response) {
                (0, view_1.notFound)(res);
                return;
            }
            const { regNo } = response;
            if (regNo) {
                const userData = yield Users_1.default.findOne({ regNo }).select("email");
                if (!userData) {
                    (0, view_1.notFound)(res);
                    return;
                }
                const { email } = userData;
                (0, sendMail_1.default)(email, mailOptions.subject, mailOptions.body, mailOptions.html);
            }
            (0, view_1.statusOkay)(res, { message: "Grievance status changed successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.changeGrievanceStatusController = changeGrievanceStatusController;
