/**
 * @author Fabiola Badillo Ramos
 * 
 * @param {{nistManuf:String , nistNumber:String , nistModel:String, nistSerNum:String, lowTemp:float, lowTempTs:timestamp, 
 * medTemp:float, medTempTs:timestamp, highTemp:float, highTempTs:timestamp, lowRh:float, lowRhTs:timestamp,
 * medRh:float, medRhTs:timestamp, highRh:float, highRhTs:timestamp}} 
 */

let CalibrationSess = function (params){
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
    this.id = params.id
}

// export {CalibrationSess}
module.exports ={CalibrationSess}

