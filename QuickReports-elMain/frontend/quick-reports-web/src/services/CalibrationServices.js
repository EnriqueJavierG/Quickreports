const axios = require('axios')
const { DataloggerProfile } = require('./objects/DataloggerProfile')
const {CalibrationSess} = require('./objects/CalibrationSess')
const { DataloggerConnection } = require('./DLConnection')
const baseUrl = 'http://localhost:4000/calSess'
// const baseUrl = 'https://e797ohq9qg.execute-api.us-east-1.amazonaws.com/staging/study'
const localUrl = 'http://localhost:4001'

/**
 * services
 */
class CalibrationServices {

    static getAllCalSess = () => {
        return axios.get(`${baseUrl}/getAll`)
        .then(res => {
            return res.data
        })
    }

    static getById = (id) => {
        return axios.get(`${baseUrl}/getById`,{
            params:{
                id
            }
        }).then(r=>r.data)
    }

    /**
     * 
     * @param {DataloggerProfile} datalogger 
     * @param {CalibrationSess} calibrationSession
     * @returns {Promise<boolean> | Promise<[Boolean , String]} boolean corresponding and string if failed
     */
    static calibrate = async (calibrationSessionId) => {

        let block  = await DataloggerConnection.getDetails();
        console.log('block')
        console.log(block)
        let readings = await DataloggerConnection.getReadings();
        console.log('readings')
        console.log(readings)

        let calibrationSession = await this.getById(calibrationSessionId)
        console.log('calibrationSession')
        console.log(calibrationSession)
        
        
        let forCalibration = {
            lowTemp:this.findReadingWithTimestamp(calibrationSession[0].nom_low_temp_ts,readings),
            highTemp:this.findReadingWithTimestamp(calibrationSession[0].nom_med_temp_ts,readings),
            medTemp:this.findReadingWithTimestamp(calibrationSession[0].nom_high_temp_ts,readings),
            highRh:this.findReadingWithTimestamp(calibrationSession[0].nom_low_rh_ts,readings),
            lowRh:this.findReadingWithTimestamp(calibrationSession[0].nom_med_rh_ts,readings),
            medRh:this.findReadingWithTimestamp(calibrationSession[0].nom_high_rh_ts,readings),
        }
        console.log('forCalibration');
        console.log(forCalibration);

        let foundReadings = true;
        console.log(foundReadings)

        Object.keys(forCalibration).forEach(key => {
            if(forCalibration[key] == null){
                console.log('no lo encontro')
                console.log(key)
                // return [false , `could not locate timestamp for ${key} in this particular datalogger , make sure this datalogger was calibrated using this session`]
                foundReadings = false;
                //return;
            }
            console.log('lo encontro')
            console.log(key)
            console.log('FOUND READINGS? ',foundReadings)
            
        })
        console.log()
        if (!foundReadings) return false;


        forCalibration = {
            lowTemp:forCalibration.lowTemp.temp,
            highTemp:forCalibration.highTemp.temp,
            medTemp:forCalibration.medTemp.temp,
            highRh:forCalibration.highRh.rh,
            lowRh:forCalibration.lowRh.rh,
            medRh:forCalibration.medRh.rh,
        }
        

        console.log('los for calibration')
        console.log(forCalibration)

        return axios.post(`${baseUrl}/calibrate` ,{
            datalogger:{...new DataloggerProfile({dlName:block.name})},
            forCalibration,
            calibrationSessionId
        }).then( r=>r.data)
        .catch(false)
        
    }

    /**
     * 
     * @author Fabiola Badillo Ramos
     * @param {String} ts - must be in the format 'YYYY-MM-DD HH:MM:SS'
     * @param {*} readings - list of datalogger readings at six timestamps 
     * @returns object with temperature, relative humidity and timestamp 
     */
    static findReadingWithTimestamp = (ts, readings) => {
        let datum = (Date.parse(ts))/1000;
        //console.log(datum)
        for (let i = 0; i<readings.length; i++){
            // console.log(`datum ${datum}  r_ts ${new Date(readings[i].ts).getTime()}`)
            if (new Date(readings[i].ts).getTime() == datum) {
                return readings[i];
            }
        }
        return null
    }
    /**
     * 
     * @param {CalibrationSess} calibrationSession 
     */
    static update = (calibrationSession) => {
        return axios.put(`${baseUrl}/update` , {calibrationSession:{...calibrationSession}}).then(r => r.data)
    }
    
    static addNewCalSess = (calSess) => {
        return axios.post(`${baseUrl}/newCalSess`, {calSess})
        .then(r=>r.data)
    }

    static getReportInfo = (dlName) => {
        return axios.get(`${baseUrl}/getReport`,{
            params:{
                dlName
            }
        }).then(r => r.data.info)
    }

}
// export {CalibrationServices}
module.exports = {CalibrationServices}