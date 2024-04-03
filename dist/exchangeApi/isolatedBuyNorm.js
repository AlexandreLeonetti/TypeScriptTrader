"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatedBuyNorm = void 0;
/* buy on isolated margin without borrowing */
const utils_1 = require("../utils/utils");
async function isolatedBuyNorm(symbol, quantity, apiKey, apiSecret) {
    try {
        const timestamp = Date.now();
        const endpoint = "https://api.binance.com/sapi/v1/margin/order";
        const params = {
            symbol,
            isIsolated: "TRUE",
            side: "BUY",
            type: "MARKET", /*MARKET*/
            /*quoteOrderQty,*/
            quantity: quantity,
            /*price : 40000,*/
            newOrderRespType: "FULL",
            sideEffectType: "NO_SIDE_EFFECT",
            /*timeInForce : "GTC", */ /* mandatory for limit orders */
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
exports.isolatedBuyNorm = isolatedBuyNorm;
