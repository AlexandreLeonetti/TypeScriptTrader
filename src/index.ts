/* index file */

import dotenv from "dotenv";
import * as fs from "fs";
import * as crypto from "crypto";
import * as schedule from "node-schedule";
import * as config from "./config/config";
import * as utils from "./utils/utils";
import * as ticker from "./exchangeApi/ticker";
import * as getDebt from "./exchangeApi/getIsolatedDebt";
import {isolatedBuyBor}     from "./exchangeApi/isolatedBuyBor";
import {isolatedBuyNorm}    from "./exchangeApi/isolatedBuyNorm";
import { isolatedShortBor } from "./exchangeApi/isolatedShortBor";
import { isolatedStopBuy} from "./exchangeApi/isolatedStopBuy";
import { isolatedCancelOrders } from "./exchangeApi/isolatedCancelOrds";
import { logCurrentDay } from "./logic/logic";
import { strat } from "./logic/logic";

dotenv.config();
const _apiKey    : string= process.env.BINANCE_API_KEY || "";
const _apiSecret : string= process.env.BINANCE_SECRET  || "";
const m1 = "58 * * * * * ";
const m5  = "57 4,9,14,19,24,29,34,39,44,49,54,59 * * * *";
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
async function single(logStream:any){
    const bitcoin= await strat(
         "BUY",
         100,
         "ENAUSDT",
         0.00500,
         0.0080,
         {highBound:200000, lowBound:0},
        logStream
    );
}

   console.log("Current directory:", __dirname);
let interval  = schedule.scheduleJob(m5, function (){
	const day = logCurrentDay();

    const logStream = fs.createWriteStream(`./src/logs/${day}.log`, {flags:'a'});

    single(logStream);

});
