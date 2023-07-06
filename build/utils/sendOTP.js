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
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
function sendOTP(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(process.env.EMAIL, email);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for login',
            text: `Your OTP is ${otp}`
        };
        try {
            yield transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.log(error);
        }
        return otp;
    });
}
exports.default = sendOTP;
