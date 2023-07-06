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
exports.issueToken = exports.loginController = exports.deleteController = exports.registerController = void 0;
const view_1 = require("../views/view");
const AuthControllers_1 = require("./adminControllers/AuthControllers");
const AuthControllers_2 = require("./userControllers/AuthControllers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const view_2 = require("../views/view");
const Users_1 = __importDefault(require("../models/Users"));
const Admins_1 = __importDefault(require("../models/Admins"));
(0, dotenv_1.config)();
function registerController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { regNo, empNo } = req.body;
            if (!regNo && !empNo) {
                (0, view_1.badRequest)(res);
                return;
            }
            if (regNo)
                (0, AuthControllers_2.registerUserController)(req, res);
            else
                (0, AuthControllers_1.registerAdminController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.registerController = registerController;
function deleteController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userNum = req.params.no;
            if (!userNum) {
                (0, view_1.badRequest)(res);
                return;
            }
            if (userNum.toLowerCase() === userNum.toUpperCase())
                (0, AuthControllers_1.deleteAdminController)(req, res);
            else
                (0, AuthControllers_2.deleteUserController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.deleteController = deleteController;
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { regNo, empNo } = req.body;
            if (!regNo && !empNo) {
                (0, view_1.badRequest)(res);
                return;
            }
            if (regNo)
                (0, AuthControllers_2.loginUserController)(req, res);
            else
                (0, AuthControllers_1.loginAdminController)(req, res);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.loginController = loginController;
function issueToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refreshTokenHeader = req.headers.authorization;
            if (!refreshTokenHeader) {
                (0, view_2.unauthAccess)(res);
                return;
            }
            const refreshJWTToken = refreshTokenHeader.split(' ')[1];
            if (!refreshJWTToken) {
                (0, view_2.unauthAccess)(res);
                return;
            }
            const decodedjwt = jsonwebtoken_1.default.verify(refreshJWTToken, process.env.SECRET_KEY);
            if (!decodedjwt._id || decodedjwt.isAccessToken) {
                (0, view_2.unauthAccess)(res);
                return;
            }
            const _id = decodedjwt._id;
            const accessToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: true }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: false }, process.env.SECRET_KEY, { expiresIn: '10d' });
            const userData = yield Users_1.default.findById({ _id }).select("name regNo");
            const empData = yield Admins_1.default.findById({ _id }).select("name empNo isSuperUser");
            if (userData) {
                const { name, regNo } = userData;
                (0, view_1.statusOkay)(res, { accessToken, refreshToken, name, regNo });
            }
            else if (empData) {
                const { name, empNo, isSuperUser } = empData;
                (0, view_1.statusOkay)(res, { accessToken, refreshToken, name, empNo, isSuperUser });
            }
            else
                (0, view_2.unauthAccess)(res);
        }
        catch (err) {
            (0, view_2.unauthAccess)(res);
        }
    });
}
exports.issueToken = issueToken;
