"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsoDebt = void 0;
/* get isolated debt from margin account on binance */
const utils_1 = require("../utils/utils");
/* change getBtcDebt into getFdusdDebt */
async function getIsoDebt(symbol, apiKey, apiSecret) {
    try {
        const timestamp = Date.now();
        const endpoint = "https://api.binance.com/sapi/v1/margin/isolated/account";
        const params = { symbols: symbol, timestamp };
        const queryString = (0, utils_1.generateQueryString)(params, apiSecret);
        const url = `${endpoint}?${queryString}`;
        const request = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (!request.ok) {
            throw new Error(`Failed to fetch isolated margin account info: ${request.statusText}`);
        }
        const response = await request.json();
        const respArr = response.assets;
        const assetInfo = respArr[0].baseAsset; /*respArr.find((e) => e.asset === "FDUSD");*/
        const usdInfo = respArr[0].quoteAsset; //respArr.find((e) => e.asset === "BTC");
        const usdBorrowed = (0, utils_1.formatter)(usdInfo.borrowed, 1, 2);
        const assetBorrowed = (0, utils_1.formatter)(assetInfo.borrowed, 1, 5);
        const freeUsd = (0, utils_1.formatter)(usdInfo.free, 1, 2);
        const assetFree = (0, utils_1.formatter)(assetInfo.free, 1, 5);
        return { error: false, borUsd: usdBorrowed, freeUsd: freeUsd, freeAsset: assetFree, borAsset: assetBorrowed };
    }
    catch (err) {
        console.log("err in getting balance", err);
        return { error: true, reason: err };
    }
}
exports.getIsoDebt = getIsoDebt;
