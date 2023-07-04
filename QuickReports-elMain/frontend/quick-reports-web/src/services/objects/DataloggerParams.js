/**
 * @author Fabiola Badillo Ramos
 * Datalogger Parameter Object
 *  - start time -> hour at which study starts (YYYY-MM-DD HH:MM:SS)
 *  - max temp 
 *  - min temp
 *  - max rh
 *  - min rh
 *  - study duration -> number of hours 
 *  - sampling frequency -> in seconds
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

// export  {DataloggerParams}
module.exports = {DataloggerParams}