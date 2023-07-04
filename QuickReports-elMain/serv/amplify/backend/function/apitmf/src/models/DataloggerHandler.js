const reads = require('./../daos/reads')
const inserts = require('./../daos/inserts')
const updates = require('./../daos/updates');
const calibrationDAO = require('./../daos/calibrationSess')
const { DataloggerProfile } = require('./objects/DataloggerProfile');
const { Reading } = require('./objects/Reading');
const { CalibrationSess } = require('./objects/CalibrationSess');
const {DateManager} = require('../dateManager');

/**
 * @author Pablo A Santiago Uriarte
 * - 
 * @param {{id:Number , name:String , c:Date, reporterFname:String, reporterLname:String, cleanroom:String, numDatalogger:Number}} details 
 */
let Datalogger =  function (details){
    // let reqDate='';
    // if(typeof details.requestDate == 'string' && details.requestDate.lenght==24){
    //     reqDate=new Date(requestDate);
    // }
    // else if (typeof details.requestDate == 'string' && details.requestDate.length<24){
    //     reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj());
    // }

    this.datalogger_id = details.id;
    this.client = details.client;
    this.requestDate = reqDate;
    this.description = details.description;
    this.dataloggersQty = details.dataloggersQty;
    this.dataloggers = [];
    this.cleanroom_name = details.cleanroom_name;
}


/**
 * This class handles all connections to the DAO's
 * @author Pablo Alfonzo Santiago Uriarte
 */
class DataloggerHandler {
    
    /**
     * Create New Datalogger Profile
     * @param {DataloggerProfile} datalogger
     */
    static create = (datalogger) => {
        //console.log(datalogger)
        return inserts.insertNewDatalogger(datalogger)
    };

    static changeName = (datalogger , name) => {
        return updates.changeDlName(datalogger , name)
    }

    /**
     * 
     * @param {Reading[]} readings 
     * @param {DatloggerProfile} datalogger
     * @param {Study} study
     */
    static addReadings = async (readings , datalogger , study) => {
        for( let i =0 ; i < readings.length ; i++){
            let s = await inserts.insertReadingsToValidationStudy(readings[i] , datalogger , study)
            console.log(`Added reading: ${i}`)
            if(!s)throw `Could not add readings for ${datalogger.dlName}`
        }
        return true
    }

    /**
     * Get Datalogger by its name 
     * @param {string} datalogger_name 
     */
    static getDataloggerByName = (datalogger_name) => {
        return reads.getDlByName(datalogger_name).then(dl => {
            return new DataloggerProfile(dl[0])
        })
    }

    /**
     * Get Dataloggers attach to readings
     * 
     * @param {string} name 
     */
    static getReadingsPerDatalogger = (name) => {
        return reads.getReadingsPerDatalogger(name).then(readings=> {
            return readings.map(reading => new Reading(reading))
        })
    }

    /**
     * Get DLs attached to Study
     * @param {String} cleanroom
     * @returns {Datalogger[]}
     */
    static getDataloggersPerStudy =  (cleanroom) => {
       return reads.getDataloggersPerStudy(cleanroom).then(dataloggers => {
           return dataloggers.map(dl => new Datalogger(dl))
       })
    };

    /**
     * 
     * @param {Number} flag 
     * @returns the tolerance flag string to display
     */
    static inToleranceFlagToString = (flag) => {
        if (flag==1){
            return "In tolerance";
        }
        else{
            return "Out of tolerance";
        }
    }

    /**
     * Request All Datalogger
     * @returns {Promise<DataloggerProfile[]>}
     */
    static getAll = () => {
       return reads.getAllDataloggers().then(async (dataloggers) => {
            let dls = [];
            for (let i = 0; i < dataloggers.length; i++){
                dataloggers[i].dl_in_tolerance = this.inToleranceFlagToString(dataloggers[i].dl_in_tolerance);
                let calDueDate = await calibrationDAO.getCalDateDueDateForDatalogger(dataloggers[i].dl_ID_number);
                if (dataloggers[i].dl_offset == 0){
                    dataloggers[i].dl_offset = '0';
                }
                let dl = {
                    id: dataloggers[i].dl_ID_number,
                    dlName:dataloggers[i].dl_ID_number,
                    dlSerialNumber:dataloggers[i].dl_serial_number,
                    dlOffset: dataloggers[i].dl_offset,
                    dlInTolerance:dataloggers[i].dl_in_tolerance,
                    calibrationDate: calDueDate
                }
                dls.push(dl);
            }
            console.log(dls);
            return dls;
       });
    };

    /**
     * @param {Number} offset
     * @param {DataloggerProfile} datalogger 
     * @returns {Promise<Boolean>}
     */
    static setCalibration= (offset , datalogger) => {
        return updates.editDLOffset(datalogger , offset).then(() => {
            return true
        })
        .catch(() => {
            return false
        })
    }

    /**
     * Get Dataloggers currently associated to a client 
     * @param {string} clientName
     * @returns {Promise<DataloggerProfile[]>}
     */
    static getDataloggerPerClient = (clientName) => {
        return reads.getDataloggersPerClient(clientName).then(dls => {
            return dls.map(dl => new DataloggerProfile(dl))
        })
    }

    /**
     * 
     * @param {string} datalogger_name 
     * @returns {Promise<DatloggerProfile[]>}
     */
    static getReadingsPerDatalogger = (datalogger_name) => {
        return reads.getReadingsPerDatalogger(datalogger_name).then(readings => {
            return readings.map(reading => new Reading(reading))
        })
    }

    /**
     * Returns all readings associated to study 
     */
    static getAllReadingsOnStudy = (studyName) => {
        return reads.getReadingsPerStudy(studyName)
    }

    /**
     * 
     * @param {List of readings} readings 
     * @param {Study} study 
     * @param {Datalogger} datalogger 
     * @returns 
     */
    static insertBulkReadings = (readings , study , datalogger) => {
        return inserts.insertMultipleReadingsToValidationStudy(readings , datalogger , study)
    }

    /**
     * 
     * @param {Datalogger} datalogger 
     * @param {Number} calibrationSessionId 
     * @param {Readings} readings 
     * calculates the offsets for the dataloggers given the calibration session
     */
    static calibrate = async (datalogger , calibrationSessionId , readings)=> {
        console.log('desde el handler del datalogger')
        console.log('los parametros que recibo')
        console.log('el DL', datalogger)
        console.log('el calibration session id', calibrationSessionId)
        console.log('los readings', readings)
        let cal = await calibrationDAO.getCalSessByPk(calibrationSessionId);
        console.log('get cal by pk', cal)
               
        let updateDLProf = await calibrationDAO.updateDlProfile(cal[0] , readings , datalogger)
        console.log(updateDLProf);
        return updateDLProf
    }

}


module.exports = {DataloggerHandler}

