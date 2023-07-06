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
const view_1 = require("../views/view");
function getAdminTagsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.empNo) {
                const { email, dept } = res.locals;
                (0, view_1.statusOkay)(res, { email, dept });
            }
            else {
                const { email, year } = res.locals;
                (0, view_1.statusOkay)(res, { email, year });
            }
        }
        catch (err) {
            (0, view_1.serverError)(res, err);
        }
    });
}
exports.default = getAdminTagsController;
