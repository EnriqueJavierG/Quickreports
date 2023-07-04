/**
 * @author Fabiola Badillo Ramos
 * 
 * @param {{nistManuf:String , nistNumber:String , nistModel:String, nistSerNum:String, lowTemp:float, lowTempTs:Date, 
 * medTemp:float, medTempTs:Date, highTemp:float, highTempTs:Date, lowRh:float, lowRhTs:Date,
 * medRh:float, medRhTs:Date, highRh:float, highRhTs:Date}} params
 */

let CalibrationSess = function (params){
    this.id = params.id
    this.nistManuf = params.nistManuf;
    this.nistNumber = params.nistNumber;
    this.nistModel = params.nistModel;
    this.nistSerNum = params.nistSerNum;
    this.lowTemp = params.lowTemp;
    this.lowTempTs = params.lowTempTs;
    this.medTemp = params.medTemp;
    this.medTempTs = params.medTempTs;
    this.highTemp = params.highTemp;
    this.highTempTs = params.highTempTs;
    this.lowRh = params.lowRh;
    this.lowRhTs = params.lowRhTs;
    this.medRh = params.medRh;
    this.medRhTs = params.medRhTs;
    this.highRh = params.highRh;
    this.highRhTs = params.highRhTs;

    this.getInDBAliases = () => {
        return {
            nist_manufacturer:this.nistManuf,
            nist_number:this.nistNumber,
            nist_model:this.nistModel,
            nist_serial_number:this.nistSerNum,
            nom_low_temp:this.lowTemp,
            nom_med_temp:this.medTemp,
            nom_high_temp:this.highTemp,
            nom_low_rh:this.lowRh,
            nom_med_rh:this.medRh,
            nom_high_rh:this.highRh,
            nom_low_temp_ts:new Date(this.lowTempTs),
            nom_med_temp_ts:new Date(this.medTempTs),
            nom_high_temp_ts:new Date(this.highTempTs),
            nom_low_rh_ts:new Date(this.lowRhTs),
            nom_med_rh_ts:new Date(this.medRhTs),
            nom_high_rh_ts:new Date(this.highRhTs)
        }
    }

}

module.exports = {CalibrationSess}

