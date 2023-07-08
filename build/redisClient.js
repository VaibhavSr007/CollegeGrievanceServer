"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const options = {
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
};
exports.redisClient = (0, redis_1.createClient)(options);
