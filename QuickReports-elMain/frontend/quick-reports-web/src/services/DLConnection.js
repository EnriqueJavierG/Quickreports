const axios = require('axios');
const { Reading } = require("./objects/Reading");
const  StudyServices  = require('./StudyServices');
const baseurl = 'http://localhost:4001';
/**
 * @author Fabiola Badillo Ramos
 * @param {{dlSerialNumber:Number, dlName:string, dlOffset:Number}} params 
 * 
 */
// let DataloggerProfile = function (params) {
//     this.dlName = params.dlName;
//     this.dlSerialNumber = params.dlSerialNumber;
//     this.dlOffset = params.dlOffset;
// }

/**
 * @author Fabiola Badillo Ramos
 * Datalogger Parameter Object
 *  - start time
 *  - max temp
 *  - min temp
 *  - max rh
 *  - min rh
 *  - study duration
 *  - sampling frequency
 * @param {{startTime:Datetime , maxTemp:float , minTemp:float, maxRH:float, minRH:float, studyDuration:Number, samplingFrequency:Number}}  
 */
 let DataloggerConfiguration =  function (params){
    this.startTime = params.startTime;
    this.maxTemp = params.maxTemp;
    this.minTemp = params.minTemp;
    this.maxRH = params.maxRH;
    this.minRH = params.minRH;
    this.studyDuration = params.studyDuration;
    this.samplingFrequency = params.samplingFrequency;
    this.serialNumber = params.serial_number;
    this.name = params.name;
}

/**
 * @author Pablo A Santiago Uriarte
 */
class DataloggerConnection {
    
    /**
     * 
     * @returns Get Datalogger Configuration and Details
     */
    static getDetails = () => {
        return axios.get(baseurl+'/getConfigurationBlock').then(r => {
            return r.data;
        })
        .catch(() => {
            console.log('catched block error')
            return false
        });
    };

   
    static fakeProgram = (params) => {
        return axios.post(baseurl+'/testProgram' , params).then(r => {
            return r.data;
        });
    };


    /**
     * 
     * @param {{}} params 
     * @returns {Promise<Boolean}
     */
    static Oldprogram = (params) => {
        return axios.post(`${baseurl}/program` , params).then(r => r.data)
    }
    /**
     * 
     * @returns readings in DL and configuration block 
     * @todo test with DLs
     */
    static getComplete = async (study) => {
       // result = { configBlock , readings}
        // let result = await axios.get(baseurl+'/getDatalogger').then(resp => resp.data.dataloggers);
        let result = 
            {
                block:{
                    name:'14'
                }
            }
        
        
        let dataloggerStudy =  await StudyServices.getDataloggersInStudy(study);
        // dataloggerStudy.forEach((dl , index)  => {
        //     if(dl.dlName === result[index].block.name)return result;
        // })

        for(let i = 0 ; i < dataloggerStudy.length ; i++){
            if (dataloggerStudy[i].dlName == result.block.name) return result;
        }
        return false
    }

    /**
     *Get Readings From datalogger 
     * @returns {Promise<Reading[]>}
     */
    static getReadings = () => {
        return axios.get(baseurl+'/readings').then(response => {
            return response.data.readings.map(reading => new Reading(reading));
        });

    };

    /**
     * Programs current datalogger
     * @param {DataloggerConfiguration} details 
     * @returns {ConfigurationBlock}
     */
    static program = async (details) => {
        // console.log('los details')
        // console.log(details)
        await  axios.post(baseurl+'/programDatalogger', details).then(r => {
            return r.data;
        });
        return axios.get(`${baseurl}/getConfigurationBlock`).then(r => r.data)
    };

    
}

// export  {DataloggerConfiguration ,  DataloggerConnection}
module.exports = { DataloggerConfiguration  , DataloggerConnection}