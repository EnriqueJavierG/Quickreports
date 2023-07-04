const reads = require('../../daos/reads');

/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{dlName:String with numerical chars, dlSerialNumber:String, dlOffset:float}} 
 * 
 */
let DataloggerProfile = function (params) {
    this.dlName = (params.dlName) ? params.dlName : params.dl_ID_number; //dl_ID_number
    this.dlSerialNumber = (params.dlSerialNumber) ? params.dlSerialNumber : params.dl_serial_number; //dl_serial_number
    this.dlOffset = (params.dlOffset) ? (params.dlOffset) : params.dl_offset; //dl_offset
    this.dlInTolerance = (params.dlInTolerance) ? (params.dlInTolerance) : (params.dl_in_tolerance);  // dl_in_tolerance
}

module.exports = {DataloggerProfile}