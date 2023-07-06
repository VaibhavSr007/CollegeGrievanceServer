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
exports.getAdminGrievancesController = void 0;
const view_1 = require("../../views/view");
const Grievance_1 = __importDefault(require("../../models/Grievance"));
function getAdminGrievancesController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, dept, isSuperUser } = res.locals;
            const options = isSuperUser ? {} : { relatedDepts: { $in: [dept, name, "any"] } };
            const grievances = yield Grievance_1.default.find(options);
            (0, view_1.statusOkay)(res, grievances);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.getAdminGrievancesController = getAdminGrievancesController;
