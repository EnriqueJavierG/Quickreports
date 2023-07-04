const inserts = require('../daos/inserts')
const reads = require('../daos/reads')
const updates = require('../daos/updates')
const calibrationDao  = require('../daos/calibrationSess')
const {CalibrationSess} = require('./objects/CalibrationSess')
const { Reading } = require('./objects/Reading')
const {DateManager} = require('../dateManager');

/**
 * Class for interactinh with the data acesss objects
 * @author Pablo Santigao
 * 
 */
class CalibrationHandler {

    /**
     * 
     * @param {CalibrationSess} calibration_session 
     * @returns {Promise<any[]}
     */
    static getReadingsPerCalibration = (calibration_session) => {
        return reads.getReadingsPerCalibration(calibration_session)
        // .then(readings => {
        //     return readings.map(reading => new Reading(reading))
        // })
    }

    /**
     * 
     * @param {Number} id 
     * @returns the calibration session result from the database
     */
    static getById = async (id) => {
        let r =  await calibrationDao.getCalSessByPk(id)
        console.log(id)
        console.log('=====')
        console.log(r)
        return r
    } 

    static getReportInfo = (dlName) => {
        console.log(dlName)
        return reads.getInfoForCalibrationReport(dlName)
    }
    /**
     * 
     * @param {string} datalogger_name 
     * @returns {Promise<CalibrationSess>}
     */
     static getCalibrationSessPerDatalogger = (datalogger_name) => {
        return reads.getCalibrationSessPerDatalogger(datalogger_name).then((calibration_session) => {
            return new CalibrationSess(calibration_session)
        })
    }

    /**  
     * 
     * @param {number} employeeID
     * @returns {Promise<CalibrationSess>}
     */
    static getCalibrationSessPerReporter = (employeeID) => {
        return reads.getCalibrationSessPerReporter(employeeID).then((calibration_session) => {
            return new CalibrationSess(calibration_session)
        })   
    }

    /**
     * 
     * @param {CalibrationSess} calibrationSess 
     * @param {Reading[]} readings 
     * @param {DataloggerProfile} datalogger 
     */
    static updateProfile = (calibrationSess , readings , datalogger) => {
        return calibrationDao.updateDlProfile(calibrationSess , readings  , datalogger)
    }

    /**
     * 
     * @param {CalibrationSess} calibrationSess 
     * @returns boolean indicating if the operation was successful
     */
    static create = (calibrationSess) => {
        return inserts.insertNewCalibrationSess(calibrationSess)
    }

    /**
     * 
     * @returns every calibration session on the system
     */
    static getAllCalSess = async () => {
        let calSessions = await reads.getAllCalSess();
        // console.log(calSessions)
        let cals = []
        // console.log(calSessions[0].nom_low_temp_ts)
        for (let i = 0; i<calSessions.length; i++){
            let calDate = DateManager.formatDateToDisplay(calSessions[i].nom_low_temp_ts)
            if (calDate.length == 18) {calDate.slice(0,11)}
            else {calDate.slice(0,10)}
            cals.push(
                {
                    id: i+1,
                    sessionNumber: calSessions[i].cal_id,
                    manufacturer: calSessions[i].nist_manufacturer,
                    model: calSessions[i].nist_model,
                    serialNum: calSessions[i].nist_serial_number,
                    calibrationDate: calDate,
                    nominalTemp: calSessions[i].nom_med_temp,
                    nominalRh: calSessions[i].nom_med_rh
                }
            )
        }
        return cals
    };

    /**
     * 
     * @param {CalibrationSess} calSess 
     */
    static addNewCalSess = (calSess) => {
        return inserts.insertNewCalibrationSess(calSess);
    }

    /**
     * @param {CalibrationSess} calibrationSesssion
     */
    static update = async  (calibrationSession) => {
        let og_sess = (await calibrationDao.getCalSessByPk(calibrationSession.id))
        let new_sess = calibrationSession.getInDBAliases()
        let updates = {}
        og_sess = og_sess[0]
        Object.keys(og_sess).forEach(key =>{
            
            if(typeof og_sess[key] != 'object'){
                if(og_sess[key] != new_sess[key]){
                    if(key != 'cal_id'){
                        updates[key] = new_sess[key]
                    }
                }
            }else{
                if(og_sess[key].getTime() !== new_sess[key].getTime()){
                    // console.log(`${key} og: ${og_sess[key].getTime()} new: ${new_sess[key].getTime()}`)
                    updates[key] = new_sess[key]
                }
            }
        })
        if(Object.keys(updates).length == 0)return true;
        return calibrationDao.update(calibrationSession.id , updates)

    }
}

module.exports= {CalibrationHandler}
