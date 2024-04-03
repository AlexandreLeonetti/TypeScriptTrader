"use strict";
/* create a stopSell */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatedStopSell = void 0;
const utils_1 = require("../utils/utils");
async function isolatedStopSell(symbol, quantity, stopPrice, price, apiKey, apiSecret) {
    try {
        const endpoint = "https://api.binance.com/sapi/v1/margin/order";
        const timestamp = Date.now();
        const params = {
            symbol,
            isIsolated: "TRUE",
            side: "SELL",
            type: "STOP_LOSS_LIMIT",
            quantity,
            stopPrice,
            price,
            sideEffectType: "AUTO_BORROW_REPAY",
            timeInForce: "GTC",
            timestamp
        };
        const queryString = (0, utils_1.generateQueryString)(params, apiSecret);
        const url = `${endpoint}?${queryString}`;
        const request = await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const response = await request.json();
        return response;
    }
    catch (error) {
        console.log("Error", error);
        throw error;
    }
}
exports.isolatedStopSell = isolatedStopSell;
