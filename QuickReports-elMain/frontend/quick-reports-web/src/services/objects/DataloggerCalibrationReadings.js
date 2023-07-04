/**
 * @author Fabiola Badillo Ramos
 * @param {List of Reading Objects} params 
 * {temp: Number, rh: Number, ts: Number}
 */ 
let DataloggerCalibrationReadings = function (params) {
    // params readings is a list of reading objects
    this.readings = params.readings;
}

module.exports = {DataloggerCalibrationReadings}
// export{DataloggerCalibrationReadings}