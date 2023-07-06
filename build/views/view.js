"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusOkay = exports.notFound = exports.serverError = exports.wrongCredentials = exports.unauthAccess = exports.badRequest = void 0;
function badRequest(res) {
    res.status(400).json({ message: 'Bad Request' });
}
exports.badRequest = badRequest;
function unauthAccess(res) {
    res.status(401).json({ message: 'Unauthorised Access' });
}
exports.unauthAccess = unauthAccess;
function wrongCredentials(res) {
    res.status(403).json({ message: 'Wrong Credentials' });
}
exports.wrongCredentials = wrongCredentials;
function serverError(res, err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
}
exports.serverError = serverError;
function notFound(res) {
    res.status(404).json({ message: 'Not Found' });
}
exports.notFound = notFound;
function statusOkay(res, message) {
    res.status(200).json(message);
}
exports.statusOkay = statusOkay;
