"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    name: String,
    regNo: {
        type: String,
        unique: true,
        uppercase: true
    },
    year: Number,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    pass: String,
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
