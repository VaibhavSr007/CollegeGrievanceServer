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
exports.checkOTPController = exports.sendOTPController = exports.changePasswordController = void 0;
const view_1 = require("../views/view");
const PasswordControllers_1 = require("./adminControllers/PasswordControllers");
const PasswordController_1 = require("./userControllers/PasswordController");
const redisClient_1 = require("../redisClient");
const Users_1 = __importDefault(require("../models/Users"));
const Admins_1 = __importDefault(require("../models/Admins"));
const hash_1 = require("../utils/hash");
function changePasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { regNo, empNo } = req.body;
            if (!regNo && !empNo) {
                (0, view_1.badRequest)(res);
                return;
            }
            if (regNo)
                (0, PasswordController_1.changeUserPasswordController)(req, res);
            else
                (0, PasswordControllers_1.changeAdminPasswordController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.changePasswordController = changePasswordController;
function sendOTPController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userNum = req.params.no;
            if (!userNum) {
                (0, view_1.badRequest)(res);
                return;
            }
            if (userNum.toLowerCase() === userNum.toUpperCase())
                (0, PasswordControllers_1.sendAdminOTPController)(req, res);
            else
                (0, PasswordController_1.sendUserOTPController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.sendOTPController = sendOTPController;
function checkOTPController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp, userNum, newPass } = req.body;
            if (!otp || !userNum) {
                (0, view_1.badRequest)(res);
                return;
            }
            const realOTP = yield redisClient_1.redisClient.get(userNum + 'otp');
            if (!realOTP) {
                (0, view_1.notFound)(res);
                return;
            }
            if (yield (0, hash_1.compare)(otp, realOTP)) {
                const pass = yield (0, hash_1.encrypt)(newPass);
                yield redisClient_1.redisClient.del(userNum + 'otp');
                if (userNum.toLowerCase() === userNum.toUpperCase())
                    yield Admins_1.default.updateOne({ empNo: userNum }, { $set: { pass } });
                else
                    yield Users_1.default.updateOne({ regNo: userNum }, { $set: { pass } });
                (0, view_1.statusOkay)(res, { message: "Password Changed Successfully" });
            }
            else
                (0, view_1.wrongCredentials)(res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.checkOTPController = checkOTPController;
