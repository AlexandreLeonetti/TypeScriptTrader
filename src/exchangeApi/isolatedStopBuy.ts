/* create a Stop Loss Buy Order */

import {generateQueryString} from "../utils/utils";

async function isolatedStopBuy(symbol:string,  quantity:number, stopPrice:number, price:number, apiKey:string, apiSecret:string){
        try{
                    const endpoint = "https://api.binance.com/sapi/v1/margin/order";
                    const timestamp= Date.now();
                    const params ={
                                    symbol,
                                    isIsolated: "TRUE",
                                    side : "BUY", 
                                    type : "STOP_LOSS_LIMIT",
                                    quantity,
                                    stopPrice,
                                    price,
                                    sideEffectType : "AUTO_BORROW_REPAY",
                                    timeInForce : "GTC",
                                    timestamp
                                };

                    const queryString = generateQueryString(params, apiSecret);
                    const url = `${endpoint}?${queryString}`;

                    const request = await  fetch(url, {
                                    method:"POST",
                                    headers:{
                                                        "X-MBX-APIKEY": apiKey,
                                                        "Content-Type": "application/x-www-form-urlencoded"
                                                    }
                                })

                    const response = await request.json();

                    return response;
                }catch(error){
                            console.log("Error", error)
                            throw error;
                }
}


export {
    isolatedStopBuy
}