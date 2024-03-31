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

dotenv.config();
const _apiKey    : string= process.env.BINANCE_API_KEY || "";
const _apiSecret : string= process.env.BINANCE_SECRET || "";
const m1 = "58 * * * * * ";

async function test(): Promise<void> {

   await utils.sleep(1000);
    //let debt = await getDebt.getIsoDebt("BTCUSDT", _apiKey, _apiSecret);
    //console.log(debt);
    //let price = await ticker.getTickerPrice("BTCUSDT");
   //let bought = isolatedBuyBor("BTCUSDT", 0.001, _apiKey, _apiSecret);
   //console.log(bought);
}



test();
