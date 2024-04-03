"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatedBuyBor = void 0;
/* Buy on isolated margin, in borrow mode */
const utils_1 = require("../utils/utils");
async function isolatedBuyBor(symbol, quantity, apiKey, apiSecret) {
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
            sideEffectType: "AUTO_BORROW_REPAY",
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
exports.isolatedBuyBor = isolatedBuyBor;
