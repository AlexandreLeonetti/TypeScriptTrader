"use strict";
/* index file */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const schedule = __importStar(require("node-schedule"));
const logic_1 = require("./logic/logic");
const logic_2 = require("./logic/logic");
dotenv_1.default.config();
const _apiKey = process.env.BINANCE_API_KEY || "";
const _apiSecret = process.env.BINANCE_SECRET || "";
const m1 = "58 * * * * * ";
const m5 = "57 4,9,14,19,24,29,34,39,44,49,54,59 * * * *";
/*
const pair = {
    side : "BUY",
    qty  : 0.03,
    name : "BTCFDUSD",
    asset: "BTC",
    stop : 0.00035,
    limit: 0.00038,
    range: {
        highBound : 167334,
        lowBound  :69860
    }
}
*/
async function single(logStream) {
    const bitcoin = await (0, logic_2.strat)("BUY", 100, "ENAUSDT", 0.00500, 0.0080, { highBound: 200000, lowBound: 0 }, logStream);
}
console.log("Current directory:", __dirname);
let interval = schedule.scheduleJob(m5, function () {
    const day = (0, logic_1.logCurrentDay)();
    const logStream = fs.createWriteStream(`./src/logs/${day}.log`, { flags: 'a' });
    single(logStream);
});
