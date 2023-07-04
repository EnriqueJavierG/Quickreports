// const repository = require('../dao/repository')
// const axios = require('axios');

const { response } = require("express");
const { Reading } = require("./objects/Reading");



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
 let DataloggerParams =  function (params){
    this.startTime = params.startTime;
    this.maxTemp = params.maxTemp;
    this.minTemp = params.minTemp;
    this.maxRH = params.maxRH;
    this.minRH = params.minRH;
    this.studyDuration = params.studyDuration;
    this.samplingFrequency = params.samplingFrequency;
}

const DataloggerConnection = function (){
   
    /**
     * 
     * @returns Configuration block stored on the Datalogger
     */
    this.getDetails = () => {
        return axios.get('localhost:4000/getConfigurationBlock').then (r => {
            return r.data; 
        })
    }
    
    
    /**
     * 
     * @returns {Promise<Reading[]>}
     */
    this.getReadings = () => {
        return axios.get('localhost:4000/readings').then(response => {
           return response.data.readings.map(reading => new Reading(reading))
        })
        
    }

    /**
     * 
     * @param {Parameters to be programmed in the datalogger} details 
     */
    this.setConfiguration = async (details) => {
        await axios.post('localhost:4000/program' , details).then(r => {
            return r.data;
        })
    }

}

module.exports = {DataloggerParams, DataloggerConnection}