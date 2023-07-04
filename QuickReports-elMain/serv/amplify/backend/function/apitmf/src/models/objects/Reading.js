
/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{temp:float, rh:float, timestamp:Date}} 
 * the timestamp must be in the format 'YYYY-MM-DD HH:MM:SS'
 */
let Reading = function (params){
    this.temp = (params.temp) ? (params.temp) : params.r_temp
    this.rh = params.rh ? params.rh :params.r_rh
    this.ts = params.ts ? params.ts : params.r_ts
    this.zone = params.zone
}

module.exports = {Reading}