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
exports.sendUserOTPController = exports.changeUserPasswordController = void 0;
const bcryptjs_1 = require("bcryptjs");
const Users_1 = __importDefault(require("../../models/Users"));
const hash_1 = require("../../utils/hash");
const view_1 = require("../../views/view");
const sendOTP_1 = __importDefault(require("../../utils/sendOTP"));
function changeUserPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { regNo, pass, newPass } = req.body;
            if (!regNo || !pass || !newPass) {
                (0, view_1.badRequest)(res);
                return;
            }
            const regData = yield Users_1.default.findOne({ regNo: regNo });
            if (!regData || !regData.pass) {
                (0, view_1.serverError)(res, { message: "User Not Found" });
                return;
            }
            if (!(yield (0, bcryptjs_1.compare)(pass, regData.pass))) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            regData.pass = yield (0, hash_1.encrypt)(newPass);
            yield regData.save();
            (0, view_1.statusOkay)(res, { message: "Password Updated Successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.changeUserPasswordController = changeUserPasswordController;
function sendUserOTPController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const regNo = req.params.no;
            const regData = yield Users_1.default.findOne({ regNo });
            if (!regData) {
                (0, view_1.notFound)(res);
                return;
            }
            const { email } = regData;
            if (!email) {
                (0, view_1.notFound)(res);
                return;
            }
            const otp = yield (0, sendOTP_1.default)(email);
            (0, view_1.statusOkay)(res, { otp });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.sendUserOTPController = sendUserOTPController;
