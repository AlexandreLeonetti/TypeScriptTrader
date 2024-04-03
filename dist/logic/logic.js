"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strat = exports.single = exports.multiFast = exports.multi = exports.logCurrentDay = void 0;
/* logic functions   */
const isolatedBuyBor_1 = require("../exchangeApi/isolatedBuyBor");
const isolatedShortBor_1 = require("../exchangeApi/isolatedShortBor");
const isolatedStopSell_1 = require("../exchangeApi/isolatedStopSell");
const isolatedStopBuy_1 = require("../exchangeApi/isolatedStopBuy");
const utils_1 = require("../utils/utils");
const ticker_1 = require("../exchangeApi/ticker");
const config_1 = require("../config/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _apiKey = process.env.BINANCE_API_KEY ?? "";
const _apiSecret = process.env.BINANCE_SECRET ?? "";
function logCurrentDay() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    return formattedDate;
}
exports.logCurrentDay = logCurrentDay;
async function buy(symbol, quantity, _apiKey, _apiSecret, logStream) {
    logStream.write(`Symbol : ${symbol}, quantity : ${quantity} \n`);
    let tx = "";
    tx = await (0, isolatedBuyBor_1.isolatedBuyBor)(symbol, quantity, _apiKey, _apiSecret);
    logStream.write(`isoBuy and Borrow. \n`);
    logStream.write(JSON.stringify(tx, null, 2) + `\n`);
    return tx;
}
async function sell(symbol, quantity, _apiKey, _apiSecret, logStream) {
    logStream.write(`Symbol : ${symbol}, quantity : ${quantity} \n`);
    let tx = "";
    tx = await (0, isolatedShortBor_1.isolatedShortBor)(symbol, quantity, _apiKey, _apiSecret);
    logStream.write(`isoBuy and Borrow. \n`);
    logStream.write(JSON.stringify(tx, null, 2) + `\n`);
    return tx;
}
async function handleBuyEntry(qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol) {
    logStream.write(`quantity ${qty}`);
    const str_bitcoin = qty.toString();
    const new_bitcoin = (0, utils_1.formatter)(str_bitcoin, 1, 5);
    const tx = await buy(symbol, new_bitcoin, _apiKey, _apiSecret, logStream);
    /* account has insufficient balance for requested action */
    logStream.write(JSON.stringify(tx, null, 2) + `\n`);
    let qtyStopLoss = (0, utils_1.formatter)(tx.executedQty, 0.997, sizePrecision);
    let avgPrice = parseFloat(/*avg bought price */ (tx.cummulativeQuoteQty / tx.executedQty).toFixed(precision));
    let stopPrice = (0, utils_1.formatter)(avgPrice, 1 - stopLoss, precision);
    let limit = (0, utils_1.formatter)(avgPrice, 1 - limitLoss, precision);
    console.log(stopPrice, limit);
    /* frequent error BTCFDUSD NaN NaN NaN */
    //console.log(symbol, bitcoin, stopPrice, limit);
    logStream.write(`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`);
    await (0, utils_1.sleep)(300);
    const stopLossTx = await (0, isolatedStopSell_1.isolatedStopSell)(symbol, qtyStopLoss, stopPrice, limit, _apiKey, _apiSecret);
    logStream.write(`placed stop loss\n`);
    logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
    if (Object.hasOwn(stopLossTx, "code")) {
        /* sleep 200ms */
        await (0, utils_1.sleep)(300);
        /* replace stop loss a bit wider */
        logStream.write(`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`);
        const stopLossTx2 = await (0, isolatedStopSell_1.isolatedStopSell)(symbol, qtyStopLoss, stopPrice, limit, _apiKey, _apiSecret);
        logStream.write(`placed stop loss 2nd trial\n`);
        logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
    }
}
async function handleSellEntry(qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol) {
    // side === "SELL"
    logStream.write(`quantity ${qty}`);
    const str_bitcoin = qty.toString();
    const new_qty = (0, utils_1.formatter)(str_bitcoin, 1, 5);
    const tx = await sell(symbol, new_qty, _apiKey, _apiSecret, logStream);
    logStream.write(JSON.stringify(tx, null, 2) + `\n`);
    let qtyStopLoss = (0, utils_1.formatter)(tx.executedQty, 0.997, sizePrecision);
    let avgPrice = parseFloat((tx.cummulativeQuoteQty / tx.executedQty).toFixed(precision));
    //console.log("avgPrice", avgPrice);
    let stopPrice = (0, utils_1.formatter)(avgPrice, 1 + stopLoss, precision);
    let limit = (0, utils_1.formatter)(avgPrice, 1 + limitLoss, precision);
    //console.log(stopPrice, limit);
    /* frequent error BTCFDUSD NaN NaN NaN */
    //console.log(symbol, bitcoin, stopPrice, limit);
    logStream.write(`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`);
    await (0, utils_1.sleep)(500);
    const stopLossTx = await (0, isolatedStopBuy_1.isolatedStopBuy)(symbol, qtyStopLoss, stopPrice, limit, _apiKey, _apiSecret);
    logStream.write(`placed stop loss\n`);
    logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
    if (Object.hasOwn(stopLossTx, "code")) {
        /* sleep 200ms */
        await (0, utils_1.sleep)(300);
        /* replace stop loss a bit wider */
        logStream.write(`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`);
        const stopLossTx2 = await (0, isolatedStopBuy_1.isolatedStopBuy)(symbol, qtyStopLoss, stopPrice, limit, _apiKey, _apiSecret);
        logStream.write(`placed stop loss on second attempt\n`);
        logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
    }
}
/* type the following function */
async function ENTRY(side, qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol) {
    if (side === "BUY") {
        handleBuyEntry(qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol);
    }
    else if (side === "SELL") {
        handleSellEntry(qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol);
    }
}
async function GET_PRICE(symbol) {
    try {
        const price = await (0, ticker_1.getTickerPrice)(symbol);
        return price;
    }
    catch (e) {
        console.log(e);
    }
}
function PARAMS(symbol) {
    // Assuming allParams is defined elsewhere in your code
    const all_params = config_1.allParams;
    const params = all_params.find(x => x.name === symbol);
    // Use optional chaining and nullish coalescing to handle undefined cases
    /* returns 0 if precision doesnt exist */
    const precision = params?.pricePrecision ?? 0;
    const sizePrecision = params?.sizePrecision ?? 0;
    return { precision, sizePrecision };
}
async function treshold(side, symbol, price, t) {
    if (side === "BUY") {
        return t == null ? false : (price >= t);
    }
    else if (side === "SELL") {
        return t == null ? false : (price <= t);
    }
    else {
        return false;
    }
}
async function rangeBoundaries(side, symbol, price, t) {
    if (side === "BUY") {
        return t == null ? false : (price <= t.highBound && price >= t.lowBound);
    }
    else if (side === "SELL") {
        return t == null ? false : (price <= t.highBound && price >= t.lowBound);
    }
    else {
        return false;
    }
}
async function strat(side, qty, symbol, stopLoss, limitLoss, range, logStream) {
    //async function strat({side,  qty, name, asset,  stop, limit, range=null}, logStream) {
    let tres = range;
    let p = PARAMS(symbol);
    //let {precision, sizePrecision} = p
    let sizePrecision = p?.sizePrecision ?? 0;
    let precision = p?.precision ?? 0;
    //console.log(` precision is ${precision}, sizePrecision is ${sizePrecision}`);
    const currentDate = new Date();
    const logMsg = `\n\n ***** ${currentDate} *****  \n`;
    logStream.write(logMsg);
    //    let  error=null, borUsd=null, freeUsd=null, borAsset=null, freeAsset=0 ;//= await TEST_BALANCE(symbol,  asset, _apiKey, _apiSecret, logStream );
    let price = await GET_PRICE(symbol);
    price = price ?? 0;
    //const c = await treshold(side, symbol, price, tres);// returns what ???
    const c = await rangeBoundaries(side, symbol, price, range);
    console.log("c");
    console.log(c);
    if (c === true) {
        const entry = await ENTRY(side, qty, precision, sizePrecision, stopLoss, limitLoss, _apiKey, _apiSecret, logStream, symbol);
    }
    else {
        const log2 = `\ndid not pass treshold condition on ${symbol}, price = ${price}, treshold = ${tres} \n`;
        logStream.write(log2);
    }
    setTimeout(() => {
        logStream.end();
        logStream.destroy();
    }, 9000);
}
exports.strat = strat;
async function multi(logStream) {
    //
    //const one = await strat("BUY", 0.060, "BTCFDUSD","BTC",  0.0025,0.0035,logStream,53500);
    //	await sleep(100);
    //await sleep(400);
    const two = await strat("BUY", 0.010, "BTCUSDT", 0.01, 0.0150, logStream, 70000);
    const sol = await strat("BUY", 1, "SOLUSDT", 0.025, 0.029, logStream, 143); //4.4
    //await sleep(500);
    //const link = await strat("BUY", 7, "LINKUSDT","LINK",0.015,0.019,logStream,20.8);
    //const ltc  = await strat("SELL",1 , "LTCBTC",  "LTC", 0.010,0.013,logStream, 0.00129);//1
    //const wld = await strat("BUY", 18, "WLDUSDT", "WLD", 0.020, 0.025, logStream, 9.5);	
    //const avax = await strat("BUY", 1, "AVAXUSDT", "AVAX", 0.005,0.006, logStream, 41);
    //const ustc = await strat("BUY", 2000, "USTCUSDT", "USTC", 0.025, 0.0299, logStream,0.0375);
    //const sei = await strat("BUY", 25, "SEIUSDT", "SEI", 0.01,0.013,logStream, 0.87);
    await (0, utils_1.sleep)(500);
    const stx = await strat("BUY", 20, "STXUSDT", 0.045, 0.050, logStream, 3.1);
    const fet = await strat("BUY", 25, "FETUSDT", 0.05, 0.055, logStream, 2.27);
    await (0, utils_1.sleep)(500);
    const eth = await strat("BUY", 0.15, "ETHUSDT", 0.01, 0.015, logStream, 3800);
    const pepe = await strat("BUY", 5000000, "PEPEUSDT", 0.050, 0.055, logStream, 0.000009);
    await (0, utils_1.sleep)(500);
    const paxgBtc = await strat("SELL", 0.1, "PAXGBTC", 0.01, 0.015, logStream, 0.033);
    const agix = await strat("BUY", 25, "AGIXUSDT", 0.05, 0.055, logStream, 1.25);
    //const fil = await strat("BUY", 2.5, "FILFDUSD", "FIL", 0.045, 0.050, logStream, 8.5);
    await (0, utils_1.sleep)(500);
    const shib = await strat("BUY", 1000000, "SHIBUSDT", 0.055, 0.059, logStream, 0.000034);
    const bnb = await strat("BUY", 0.6, "BNBUSDT", 0.010, 0.015, logStream, 505);
    await (0, utils_1.sleep)(500);
    const bch = await strat("BUY", 0.15, "BCHUSDT", 0.045, 0.05, logStream, 400);
    const doge = await strat("BUY", 1000, "DOGEUSDT", 0.035, 0.039, logStream, 0.17);
    //const usdc = await strat("BUY",0.04, "BTCUSDC","BTC", 0.006,0.007,logStream,53500);
}
exports.multi = multi;
async function multiFast(logStream) {
    //const one = await strat("BUY", 0.055, "BTCFDUSD","BTC",  0.0045,0.0055,logStream,53500);
    await (0, utils_1.sleep)(100);
}
exports.multiFast = multiFast;
async function single(logStream) {
    const usdc = await strat("SELL", 0.001, "BTCUSDC", 0.001, 0.0015, logStream, 66800);
}
exports.single = single;
