const axios = require('axios')
const { Reading } = require('./objects/Reading')
const { Study } = require('./objects/Study')
const { DataloggerProfile } = require('./objects/DataloggerProfile')
const baseUrl = 'http://localhost:4000/study'
// const baseUrl = 'https://e797ohq9qg.execute-api.us-east-1.amazonaws.com/staging/study'
const localUrl = 'http://localhost:4001'
const {DataloggerConnection} = require('./DLConnection')
/**
 * @author Pablo A Santiago Uriarte
 * 
 * Class for communicating with AWS server
 */
class StudyServices{

    /**
     * Function to get all studies on database 
     * returns a promise
     * @returns Promise<Study[]>
     */
    static getAllStudies = () => {
        return axios.get(`${baseUrl}/getAll`).then(res => {
            // return res.data.studies.map(study =>{
            //     let s = new Study(study)
            //     return s
            //console.log(res.data.studies)
            return res.data.studies;
        })
    }

    static getStudyForApproverPage = () => {
        return axios.get(`${baseUrl}/getStudyForApproverPage`)
        .then(res=>{
            return res.data
        })
    }

    static getStudyById = (id) => {
        return axios.get(`${baseUrl}/getStudyById`,{
            params:{
                id
            }
        })
        .then(res=>{
            return res.data;
        })
    }

    /**
     * 
     * @param {Study} study 
     * @returns the complete study obj for the passes obj
     */
    static getStudyByName  = (study) => {
        return axios.get(`${baseUrl}/getByName`, {
            params:{
                study:{...study}
            }
        }).then( r => r.data.study)
    }

    /**
     * 
     * @param {Study} study 
     * @param {Datalogger} datalogger 
     * @deprecated
     * @returns {Promise<boolean>}
     */
    static attachDataloggerToStudy = (study , datalogger) => {
        return axios.post(`${baseUrl}/attachDatalogger` , {study:{...study} , datalogger:{...datalogger}}).then(r => r.data)
    }

    /**
     * 
     * @param {Study} study 
     * @returns 
     */
    static programAndAddToStudy = async (study) => {
        let sDate = new Date(study.startDate)
        // console.log(study)
        let configuration = await DataloggerConnection.program({
            highAlarmLevel:study.maxTemp,
            lowAlarmLevel:study.minTemp,
            channel2highAlarm:study.maxRH,
            channel2lowAlarm:study.minRH,
            sampleRate:study.samplingFrequency,
            startTimeOffset:0,
            startSec:0,
            startMin:sDate.getMinutes(),
            startHr:sDate.getHours(),
            startDay:sDate.getDate(),
            startMon:sDate.getMonth()+1,
            startYear:sDate.getFullYear() - 2000,

        });
        // console.log(configuration)
        if(configuration){
            await StudyServices.attachDataloggerToStudy(study , new DataloggerProfile({dlName:configuration.name}))
            return true;
        }else{
            return false;
        }
    }

    static getReadingsOutOfRange = (study) => {
        return axios.get(`${baseUrl}/getReadingsOutOfRange` , {
            params:{
                study,
            }
        }).then(resp => {
            return resp.data.readings
        })
    }

    /**
     * @author Pablo
     * @param {Study} study 
     * @returns {Promise<DataloggerProfile[]>}
     */
    static getDataloggersInStudy = (study) => {
        return axios.get(`${baseUrl}/getDataloggersInStudy`, {
            params:{
                study:{...study}
            }
        }).then(resp => {
            console.log(resp.data.dataloggers)
            return resp.data.dataloggers
        })
    }

    /**
     * 
     * @param {Study} study 
     * @param {DataloggerProfile} dataloggerProfile 
     * @returns {Promise<Boolean>}
     */
    static attachDataloggerToZone = (zone , study , datalogger) => {
        return axios.post(`${baseUrl}/attachDataloggerToZone` , {
            datalogger:{...datalogger},
            study:{...study},
            zone
            
        }).then(r => r.data)
    }


    /**
     * @param {string} clientname
     * @returns {Promise<Study[]>} 
     */
    static getStudiesByClient = (clientname) => {
        return axios.get(`${baseUrl}/getStudiesByClient`, {
            params:{
                client_name:clientname
            }
        }).then(res => {
            return res.data.studies.map(study => new Study(study))
        })
    }

    /**
     * @param {Number} employeeID
     * @returns {Promise<Study[]>} 
     */
    static getStudiesByReporter = (employeeID) => {
        return axios.get(`${baseUrl}/getStudiesPerReporter`)
    }

    /**
     * Returns the analaytics per zone for givenz study 
     * @param {Study} study 
     * @returns Promise<Object[]>
     */
    static getAnalyticsPerZoneForStudy = (study) => {
        return axios.get(`${baseUrl}/getAnalyticsPerZone`, {
            params:{
                study:{...study}
            }
        })
    }

    static getZonesInStudy = (study) => {
        return axios.get(`${baseUrl}/getZonesForStudy` , {
            params:{
                study:{...study}
            }
        }).then(resp => resp.data.zones)
    }

    static getZoneToDL = (study) => {
        console.log(`from the service we have ${study.clientName}`)
        return axios.get(`${baseUrl}/getDataloggerToZone` , {
            params:{
                study:{...study}
            }
        }).then( r => {
            let mappings= r.data.mappings
            console.log(mappings)
            return mappings
        })
    }

    static getNumberOfZones = (study) => {
        return axios.get(`${baseUrl}/getNumberOfZonesInStudy` , {
            params:{
                study:{...study}
            }
            
        }).then(r => r.data)
    }

    /**
     * 
     * @param {Study} study 
     * @param {Number} zone 
     * @returns {Promise<Reading[]>}
     */
    static getReadingsPerZone = (study,zone) => {
        return axios.get(`${baseUrl}/getReadingsForZone` , {
            params:{
                study,
                zone
            }
        }).then(resp => {
            return resp.data.readings.map(r => new Reading(r))
        })
    }
    /**
     * Creates a new study
     * @param {Study} study
     * @param {Reporter} reporter
     * @returns {Promise<boolean>}
     */
    static createNewStudy = (study , reporter) => {
        return axios.post(`${baseUrl}/create` , {
            study:{...study},
            reporter:{...reporter}
        }).then(res => res.data)
    }
    /**
     * Get analytics Per zone for a study 
     * @todo create analytic obj
     * @param {Study} study
     * @returns {Promise<any[]>}
     */
    static getAnalyticsPerZone = (study) => {
        return axios.get(`${baseUrl}/getAnalyticsPerZone`)
            .then(r => r.data)
            .catch(r => false)

    }

    static getStudiesByReporterComplete = (employeeID) => {
        return axios.get(`${baseUrl}/getStudiesByReporterComplete`,{
            params:{
                employeeId:employeeID
            }
        }).then(r => r.data.studies)
    }

    /**
     * 
     * @param {Study} study 
     * @param {any} configurations 
     * @returns {Promise<boolean>}
     */
    static updateProgramConfigurations = ( study , configurations) => {
        return axios.post(`${baseUrl}/updateStudyProgramConfigurations`,{study:{...study} , configurations:{...configurations}}).then(r => r.data)
    }

    static updateStatus = (study_id , status) => {
        return axios.post(`${baseUrl}/changeStatus`, {study_id , status} ).then(r => r.data)
    }
    
    /**
     * Returns true if the extracted readings were added to the DB 
     * false if not
     * @returns {Promise<boolean>}
     */
     static extractReadings = async (study) => {
       
        let noReadings = (study.duration * (3600 / study.samplingFrequency).toFixed(0)).toFixed(0);
        let details = await axios.get(`${localUrl}/getDatalogger`,{
            params:{
                rQty:noReadings
            }
        }).then(resp => resp.data)  
        .catch(() => {
            console.log('Failed to read')
            // fetch(`templates/validationReport`)
            return false;
        })
        
        for(let i = 0; i < details.readings.length ; i += 1000){
            let s = await axios.post(`${baseUrl}/insertBulkReadings`, {
                datalogger:{
                    dlName:details.configurationBlock.name
                },
                study:{...study},
                readings:details.readings.slice(i , i +  1000)               
            })
            if(!s)throw('could not insert');
        }
        return true
    }


    /**
     * 
     * @param {any[]} readings 
     * @returns {Promise<boolean>}
     */
    static insertReadings = async (readings , datalogger , study) => {
        for(let i = 0; i < readings.length ; i += 1000){
            let s = await axios.post(`${baseUrl}/insertBulkReadings`, {
                datalogger:{...datalogger},
                study:{...study},
                readings:readings.slice(i , i +  1000)               
            })
            if(!s)return false;
        }

        return true
    }


    static update = (study) => {
        // console.log(study)
        return axios.post(`${baseUrl}/update`, {study:{...study}}).then( r => r.data)
    }

}

// export {StudyServices}
module.exports = {StudyServices}