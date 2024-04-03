"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatedCancelOrders = void 0;
const utils_1 = require("../utils/utils");
async function isolatedCancelOrders(symbol, apiKey, apiSecret) {
    try {
        const timestamp = Date.now();
        const endpoint = "https://api.binance.com/sapi/v1/margin/openOrders";
        const params = {
            symbol,
            isIsolated: "TRUE",
            timestamp
        };
        const queryString = (0, utils_1.generateQueryString)(params, apiSecret);
        const url = `${endpoint}?${queryString}`;
        const request = await fetch(url, {
            method: "DELETE",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const response = await request.json();
        return response;
    }
    catch (error) {
        console.log("error", error);
        throw error;
    }
}
exports.isolatedCancelOrders = isolatedCancelOrders;
