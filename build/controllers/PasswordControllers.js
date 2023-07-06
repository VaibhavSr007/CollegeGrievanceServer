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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPController = exports.changePasswordController = void 0;
const view_1 = require("../views/view");
const PasswordControllers_1 = require("./adminControllers/PasswordControllers");
const PasswordController_1 = require("./userControllers/PasswordController");
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
