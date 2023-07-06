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
exports.AuthMiddleWare = void 0;
const view_1 = require("../views/view");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admins_1 = __importDefault(require("../models/Admins"));
const Users_1 = __importDefault(require("../models/Users"));
function AuthMiddleWare(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authrisationToken = req.headers.authorization;
            if (!authrisationToken) {
                (0, view_1.unauthAccess)(res);
                return;
            }
            const jwtToken = authrisationToken.split(' ')[1];
            const decodedjwt = jsonwebtoken_1.default.verify(jwtToken, process.env.SECRET_KEY);
            if (!decodedjwt || !decodedjwt.isAccessToken) {
                (0, view_1.unauthAccess)(res);
                return;
            }
            const empData = yield Admins_1.default.findById({ _id: decodedjwt._id });
            const userData = yield Users_1.default.findById({ _id: decodedjwt._id });
            if (!userData && !empData) {
                (0, view_1.unauthAccess)(res);
                return;
            }
            res.locals._id = decodedjwt._id;
            if (userData) {
                res.locals.name = userData.name;
                res.locals.regNo = userData.regNo;
                res.locals.email = userData.email;
                res.locals.year = userData.year;
            }
            if (empData) {
                res.locals.name = empData.name;
                res.locals.empNo = empData.empNo;
                res.locals.email = empData.email;
                res.locals.dept = empData.dept;
                res.locals.isSuperUser = empData.isSuperUser;
            }
            next();
        }
        catch (err) {
            (0, view_1.unauthAccess)(res);
        }
    });
}
exports.AuthMiddleWare = AuthMiddleWare;
