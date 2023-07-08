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
const view_1 = require("../views/view");
const Admins_1 = __importDefault(require("../models/Admins"));
const redisClient_1 = require("../redisClient");
function getAdminTagsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cachedData = yield redisClient_1.redisClient.get("allTags");
            if (cachedData) {
                (0, view_1.statusOkay)(res, JSON.parse(cachedData));
                return;
            }
            const allTags = yield Admins_1.default.aggregate([
                { $group: { _id: null, names: { $addToSet: '$name' }, depts: { $addToSet: '$dept' } } },
                { $project: { _id: 0, allTags: { $concatArrays: ['$names', '$depts'] } } },
                { $unwind: '$allTags' },
                { $group: { _id: null, allTags: { $addToSet: '$allTags' } } }
            ]);
            if (allTags.length) {
                redisClient_1.redisClient.set("allTags", JSON.stringify(allTags[0].allTags));
                (0, view_1.statusOkay)(res, allTags[0].allTags);
            }
            else
                (0, view_1.statusOkay)(res, []);
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.default = getAdminTagsController;
