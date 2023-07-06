"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const grievanceSchema = new Schema({
    regNo: {
        type: String,
        uppercase: true
    },
    subject: String,
    complaint: String,
    relatedDepts: {
        type: Array,
        "default": []
    },
    status: String,
    remarks: {
        type: Array,
        "default": []
    },
});
const GrievanceModel = mongoose_1.default.model("Grievance", grievanceSchema);
exports.default = GrievanceModel;
