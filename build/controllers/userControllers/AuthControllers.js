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
exports.loginUserController = exports.deleteUserController = exports.registerUserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const hash_1 = require("../../utils/hash");
const view_1 = require("../../views/view");
const Users_1 = __importDefault(require("../../models/Users"));
(0, dotenv_1.config)();
function registerUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, year, email, pass } = req.body;
            if (!name || !year || !email || !pass) {
                (0, view_1.badRequest)(res);
                return;
            }
            req.body.pass = yield (0, hash_1.encrypt)(req.body.pass);
            const newUser = new Users_1.default(req.body);
            yield newUser.save();
            (0, view_1.statusOkay)(res, { message: "User Added Successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.registerUserController = registerUserController;
function deleteUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const regNo = req.params.no.toUpperCase();
            yield Users_1.default.deleteOne({ regNo: regNo });
            (0, view_1.statusOkay)(res, { message: "User Deleted Successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.deleteUserController = deleteUserController;
function loginUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { regNo, pass } = req.body;
            if (!pass) {
                (0, view_1.badRequest)(res);
                return;
            }
            const regData = yield Users_1.default.findOne({ regNo }).select("_id name pass");
            if (!regData || !(yield (0, hash_1.compare)(pass, regData.pass))) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            const { _id, name } = regData;
            const accessToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: true }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: false }, process.env.SECRET_KEY, { expiresIn: '10d' });
            (0, view_1.statusOkay)(res, { accessToken, refreshToken, name, regNo });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.loginUserController = loginUserController;
