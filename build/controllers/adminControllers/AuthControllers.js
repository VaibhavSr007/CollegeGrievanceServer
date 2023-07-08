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
exports.loginAdminController = exports.deleteAdminController = exports.registerAdminController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const hash_1 = require("../../utils/hash");
const view_1 = require("../../views/view");
const Admins_1 = __importDefault(require("../../models/Admins"));
const redisClient_1 = require("../../redisClient");
(0, dotenv_1.config)();
function registerAdminController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!res.locals.isSuperUser) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            const { name, empNo, dept, email, pass, isSuperUser } = req.body;
            if (!name || !empNo || !dept || !email || !pass || isSuperUser === undefined) {
                (0, view_1.badRequest)(res);
                return;
            }
            req.body.pass = yield (0, hash_1.encrypt)(req.body.pass);
            const newAdmin = new Admins_1.default(req.body);
            yield newAdmin.save();
            yield redisClient_1.redisClient.del("allTags");
            (0, view_1.statusOkay)(res, { message: "Admin Added Successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.registerAdminController = registerAdminController;
function deleteAdminController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const empNo = req.params.no.toUpperCase();
            if (!empNo || empNo === res.locals.empNo || empNo === "000001") {
                (0, view_1.badRequest)(res);
                return;
            }
            const response = yield Admins_1.default.deleteOne({ empNo });
            console.log(response);
            if (response.deletedCount === 0) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            yield redisClient_1.redisClient.del("allTags");
            (0, view_1.statusOkay)(res, { message: "Admin Deleted Successfully" });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.deleteAdminController = deleteAdminController;
function loginAdminController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { empNo, pass } = req.body;
            if (!pass) {
                (0, view_1.badRequest)(res);
                return;
            }
            const empData = yield Admins_1.default.findOne({ empNo }).select("_id name pass isSuperUser");
            if (!empData || !(yield (0, hash_1.compare)(pass, empData.pass))) {
                (0, view_1.wrongCredentials)(res);
                return;
            }
            const { _id, name, isSuperUser } = empData;
            const accessToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: true }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id, isAccessToken: false }, process.env.SECRET_KEY, { expiresIn: '10d' });
            (0, view_1.statusOkay)(res, { accessToken, refreshToken, name, empNo, isSuperUser });
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.loginAdminController = loginAdminController;
