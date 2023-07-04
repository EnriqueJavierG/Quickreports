const { StudyServices } = require("../../../services/StudyServices")
const studyUrl = 'http://localhost:4000/study'
const axios = require('axios')
const {DateManager} = require('../../../dateManager');
/**
 * Services for connecting for dashboard functions 
 */
class DashboardServices {
    
    /**
     * 
     * @param {Study} study 
     * @param {number} zones
     * @returns {Promise<Reading[]>}
     */
    static getRhData = (study , zone) =>{
        return StudyServices.getReadingsPerZone(study , zone).then(readings => readings.map(r => {return {x:new Date(r.ts) , y:r.hum}} )) // todo find function for all readings for study    
    }

    /**
     * 
     * @param {Study} study 
     * @param {number} zone
     * @returns {Promise<Reading[]>}
     */
     static getTempData = (study , zone ) =>{
        return StudyServices.getReadingsPerZone(study , zone).then(readings => readings.map(r =>{return {x:new Date(r.ts), y:r.temp}})) // todo find function for all readings for study    
    }

    /**
     * 
     * @param {Study} study 
     * @returns {Promise<{zone:number , rhData:{x:Date , y:Number }[] , tempData:{x:Date , y:Number }[]}[]>}
     */
    static readingsFromErrorZones = (study) => {
       return axios.get(`${studyUrl}/getZoneReadingsForOutOfRange`, {
           params:{
               study:{...study},
            }
       }).then( r => r.data.zoneReadings.map( zr => {
            zr.tempData = zr.tempData.map(r => {return {x:new Date(r.x) , y:r.y}})
            zr.rhData = zr.rhData.map(r => {return {x:new Date(r.x) , y:r.y}})
            return zr;
       }))
    }

    /**
     * 
     * @param {Study} study 
     * @returns formatted readings for graphs per zone
     */
    static getFormattedReadings = (study) => {
        return axios.get(`${studyUrl}/getFormatedReadingsPerZone`, {
            params:{
                study:{...study},
            }
        })
        .then( r=>r.data.zoneReadings.map(zr => {
            zr.tempData = zr.tempData.map(r=>{return {x:new Date(r.x), y:r.y, }})
            zr.rhData = zr.rhData.map(r=>{return {x:new Date(r.x), y:r.y, }})
            // console.log(zr.rhData)
            return zr;
        }))
    }

    /**
     * 
     * @param {Study} study 
     * @returns Object of objects where the key is the zone number and the value is an array with the rh data {x:ts,y:rh}
     */
    static formatRhData = async (study) => {
        let readings = await this.getFormattedReadings(study);
        var myData = {};
        // console.log(readings.length)
        for (let i=0; i<readings.length; i++){
            myData[readings[i].zoneNumber.zone_number]=readings[i].rhData;
        }
        // console.log(myData)
        return myData;
    }

    /**
     * 
     * @param {Study} study 
     * @returns Object of objects where the key is the zone number and the value is an array with the temp data {x:ts,y:temp}
     */
    static formatTempData = async (study) => {
        let readings = await this.getFormattedReadings(study);
        var myData = {};
        for (let i=0; i<readings.length; i++){
            myData[readings[i].zoneNumber.zone_number]=readings[i].tempData;
        }
        return myData;
    }
     
    /**
     * 
     * @param {Study} study 
     * @returns {Promise<{
        id,
        dataloggerId,
        zoneNumber
        minTemp,
        maxTemp,
        avgTemp,
        minRh,
        maxRh,
        avgRh:
      }[]>}
     */
    static zoneSummariesList = (study) => {
        return axios.get(`${studyUrl}/getAnalyticsPerZone` , {
            params:{
                study:{...study}
            }
        }).then(r=> r.data.zoneSummariesList)
        
    }
    //constructor 
    static tempRanges = async (study) => {
        let res = []
        let summaries = await this.zoneSummariesList(study)
        
        for(let i =0 ; i < summaries.length ; i++){
            res.push({
                x:summaries[i].zone_number,
                y:[summaries[i].min_temp_per_zone , summaries[i].max_temp_per_zone]
            })
        }
        return res
    }
    //constructor 
    static rhRanges = async (study) => {
        let res = []
        let summaries = await   this.zoneSummariesList(study)
        for(let i =0 ; i < summaries.length ; i++){
            res.push({
                x:summaries[i].zone_number,
                y:[summaries[i].min_rh_per_zone , summaries[i].max_rh_per_zone]
            })
        }
        return res
    }

    /**
     * 
     * @param {Study} study 
     * @returns {Promise<{x:number , y:number}[]>}
     */
    static tempAvg = async (study) => {
        let summaries = await this.zoneSummariesList(study);
        let res = []
        for(let i = 0 ; i < summaries.length ;i++){
            res.push({
                x:summaries[i].zone_number,
                y:summaries[i].avg_temp_per_zone
            })
        }
        return res
    }

    /**
     * 
     * @param {Study} study 
     * @returns {Promise<{x:number , y:number}[]>}
     */
    static rhAvg = async (study) => {
        let summaries = await this.zoneSummariesList(study);
        let res = []
        for(let i = 0 ; i < summaries.length ;i++){
            res.push({
                x:summaries[i].zone_number,
                y:summaries[i].avg_rh_per_zone
            })
        }
        return res
    }

    static errorLog = async (study) => {
        let start = new Date()
        let readingsOutOfRange = await StudyServices.getReadingsOutOfRange(study)
        let end = new Date();
        let res = []
        let errorType = ''
        for(let i = 0 ; i < readingsOutOfRange.length ; i++){
            if(readingsOutOfRange[i].r_temp > study.maxTemp || readingsOutOfRange[i].r_temp <study.minTemp
                || readingsOutOfRange[i].r_rh > study.maxRh || readingsOutOfRange[i].r_rh < study.minRh){
                errorType="data out of range"
            }else if(readingsOutOfRange[i].r_temp==study.maxTemp||readingsOutOfRange[i].r_temp==study.maxTemp-1||
                readingsOutOfRange[i].r_temp==study.minTemp||readingsOutOfRange[i].r_temp==study.minTemp+1||
                readingsOutOfRange[i].r_rh==study.maxRh||readingsOutOfRange[i].r_rh==study.maxRh-0.5||
                readingsOutOfRange[i].r_rh==study.minRh||readingsOutOfRange[i].r_rh==study.minRh+0.5){
                errorType = 'near range limit'
            }else{
                errorType = "missing data"
            }
            let ts = '';
            if (typeof readingsOutOfRange[i].r_ts=='string' && readingsOutOfRange[i].r_ts.length==24){
                ts = DateManager.formatDateToDisplay(new Date(readingsOutOfRange[i].r_ts));
            }
            res.push({
                id: i+1,
                dataloggerId: readingsOutOfRange[i].dl_ID_number,
                zoneNumber:readingsOutOfRange[i].zone_number,
                temp:readingsOutOfRange[i].r_temp,
                rh:readingsOutOfRange[i].r_rh,
                //timestamp: new Date(readingsOutOfRange[i].r_ts).toUTCString().slice(4,22),
                // timestamp: new Date(readingsOutOfRange[i].r_ts).toLocaleString(),
                timestamp: ts,
                errorType: errorType
            })
        }
        return res;
    } 

    static formatDataForDataPerZoneView = (study) => {
        
        return axios.get(`${studyUrl}/formatDataForDataPerZoneView` , {
            params:{
                study:{...study}
            }
        }).then(r=> r.data)
    }




}

//export { DashboardServices}
module.exports = {DashboardServices}
