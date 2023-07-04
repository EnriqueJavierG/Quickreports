/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{temp:float, rh:float, timestamp:Date}} 
 * the timestamp must be in the format 'YYYY-MM-DD HH:MM:SS'
 */
let Reading = function (params){
    this.temp = params.temp
    this.rh = params.rh
    this.ts = params.ts
    this.zone = params.zone
}

// export {Reading}
module.exports = {Reading}