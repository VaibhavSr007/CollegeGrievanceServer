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
            if (status)
                yield Grievance_1.default.findOneAndUpdate({ _id }, { status: status });
            else
                yield Grievance_1.default.findOneAndUpdate({ _id }, { $push: { remarks: [res.locals.name, remark] }, $set: { status: "opened" } });
            (0, view_1.statusOkay)(res, { message: "Grievance status changed successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.changeGrievanceStatusController = changeGrievanceStatusController;
