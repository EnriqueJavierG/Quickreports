/**
 * @author Fabiola Badillo Ramos
 * @param {
 * zoneNumber
 * avgTemp
 * minTemp
 * maxTemp
 * avgRh
 * minRh
 * maxRh
 * } params 
 */
let ZoneSummary = function (params){
    this.zoneNumber = params.zoneNumber;
    this.avgTemp = params.avgTemp;
    this.minTemp = params.minTemp;
    this.maxTemp = params.maxTemp ;
    this.avgRh = params.avgRh;
    this.minRh  = params.minRh;
    this.maxRh  = params.maxRh;
}

// export {ZoneSummary}
module.exports = {ZoneSummary}