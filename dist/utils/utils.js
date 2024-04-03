"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueryString = exports.formatter = exports.sleep = void 0;
const crypto = __importStar(require("crypto"));
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function formatter(s, factor, precision) {
    if (typeof s === "string") {
        let n = factor * parseFloat(s);
        let p = Math.pow(10, precision);
        n = Math.trunc(n * p) / p;
        n = parseFloat(n.toFixed(precision));
        return n;
    }
    else {
        // When s is a number, directly apply the factor and precision
        let n = s * factor;
        let p = Math.pow(10, precision);
        n = Math.trunc(n * p) / p;
        n = parseFloat(n.toFixed(precision));
        return n;
    }
}
exports.formatter = formatter;
function generateQueryString(params, apiSecret) {
    console.log(params);
    let queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    const signature = crypto.createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');
    return `${queryString}&signature=${signature}`;
}
exports.generateQueryString = generateQueryString;
