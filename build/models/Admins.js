"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const adminSchema = new Schema({
    name: String,
    empNo: {
        type: String,
        unique: true,
        uppercase: true
    },
    dept: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    pass: String,
    isSuperUser: Boolean
});
const AdminModel = mongoose_1.default.model("Admin", adminSchema);
exports.default = AdminModel;
