import * as crypto from "crypto";

async function sleep(ms:number) : Promise<void>{
    return new Promise((resolve)=> {
        setTimeout(resolve, ms);
    });
}

function formatter(s : string, factor : number, precision : number):number{
    let n = factor*parseFloat(s);
    let p = Math.pow(10, precision);
    n=Math.trunc(n*p)/p;
    n=parseFloat(n.toFixed(precision));
    return n;
}
/*
function generateQueryString(symbol: string, timestamp: number, apiSecret: string): string {
    const params = { symbols: symbol, timestamp };
    let queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    const signature = crypto.createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');

    return `${queryString}&signature=${signature}`;
}

*/
type debtParams = {
    symbols : string;
    timestamp : number;
}


type isoBuyParams = {
    symbol : string;
    isIsolated : string;
    side : string;
    type : string;
    quantity : number;
    newOrderRespType : string;
    sideEffectType : string;
    timestamp : number;
}

type isoStopParams = {
    symbol : string;
    isIsolated : string;
    side : string;
    type : string;
    quantity : number;
    stopPrice : number;
    price : number;
    sideEffectType : string;
    timeInForce : string;
    timestamp : number;
}

type cancelOrds = {
    symbol : string;
    isIsolated: string;
    timestamp : number;
}

type typeParam = debtParams | isoBuyParams | isoStopParams | cancelOrds;

function generateQueryString(params:typeParam, apiSecret: string): string {
    console.log(params);
    let queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    const signature = crypto.createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');

    return `${queryString}&signature=${signature}`;
}

export {
    sleep,
    formatter,
    generateQueryString
};



