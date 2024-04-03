"use strict";
/* functions for isolated margin account api */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickerPrice = void 0;
async function getTickerPrice(symbol) {
    try {
        const priceFetch = await fetch(`http://binance.com/api/v3/ticker/price?symbol=${symbol}`);
        if (!priceFetch.ok) {
            throw new Error(`Failed to fetch price for symbol ${symbol}: ${priceFetch.statusText}`);
        }
        const priceBody = await priceFetch.json();
        if (!priceBody.price) {
            throw new Error(`Price data not found for symbol ${symbol}`);
        }
        return parseFloat(priceBody.price);
    }
    catch (error) {
        console.log("Error fetching ticker price", error);
        throw error;
    }
}
exports.getTickerPrice = getTickerPrice;
