const uuid = require('uuid')
/**
 * @author Pablo A Santiago Uriarte
 * - Study object 
 * - client
 *  - req date
 *  - description
 *  - dataloggerQty
 *  -  dataloggers 
 *  - cleanroom_name
 * @param {{id:Number , clientName:String , reqDate:Date, reporterFname:String, reporterLname:String, cleanroom:String, numDatalogger:Number}} details 
 */
 let Study =  function (details){
    this.id = details.id ? details.id : details.s_id
    this.clientName =(details.clientName) ? details.clientName : details.c_name
    this.requestDate = (details.requestDate)?  new Date(details.requestDate) : new Date(details.req_date);
    this.maxTemp = (details.maxTemp)? details.maxTemp : details.s_max_temp;
    this.minTemp = (details.minTemp) ? details.minTemp : details.s_min_temp;
    this.maxRH = (details.maxRH) ? details.maxRH : details.s_max_rh;
    this.minRH =(details.minRH) ? details.minRH : details.s_min_rh;
    this.dataloggersQty = (details.dataloggersQty) ? details.dataloggersQty : details.s_dl_quantity;
    this.isApproved = (details.isApproved) ? details.isApproved : details.s_is_approved;
    this.cleanroomName = (details.cleanroomName) ? details.cleanroomName: details.s_cleanroom;
    this.samplingFrequency = (details.samplingFrequency) ? details.samplingFrequency : details.s_sampling_frequency;
    this.reporter_first_name = (details.reporter_first_name) ? details.reporter_first_name : details.r_first_name;
    this.reporter_last_name = (details.reporter_last_name) ? details.reporter_last_name : details.r_last_name;
    this.status = (details.status) ? details.status : details.s_status;
    this.startDate =  (details.startDate) ? details.startDate : details.s_start_date
    this.endDate = (details.endDate) ? details.endDate : details.s_end_date
    this.projectName = this.clientName + this.requestDate
    this.reporter = `${this.reporter_first_name} ${this.reporter_last_name}`
    this.zonesQty = details.zonesQty;
    this.duration = details.duration ? details.duration : details.s_duration_hours;

    this.getInDBAliases = () => {
        return{
            c_name:this.clientName,
            req_date:this.requestDate,
            s_max_temp:this.maxTemp,
            s_min_temp:this.minTemp,
            s_max_rh:this.maxRH,
            s_min_rh:this.minRH,
            s_dl_quantity:this.dataloggersQty,
            s_cleanroom:this.cleanroomName,
            s_sampling_frequency:this.samplingFrequency,
            s_start_date:this.startDate,
            s_end_date:this.endDate,
        }
            
    }
}



module.exports = {Study}


