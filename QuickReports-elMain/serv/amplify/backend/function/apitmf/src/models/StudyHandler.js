const reads = require('../daos/reads')
const inserts = require('../daos/inserts')
const updates = require('../daos/updates')
const dataAnalytics = require('../daos/dataAnalytics')
const {Study} = require('./objects/Study');
const { DataloggerProfile } = require('./objects/DataloggerProfile');
const { Reading } = require('./objects/Reading');
const {DateManager} = require('../dateManager');
// import Study from './objects/Study'

/**
 * This class handles all connections to the DAO's
 * @author Pablo Alfonzo Santiago Uriarte
 */
class StudyHandler {
    


    /**
     * Request Creation of New Study
     * - Takes Study as parameter
     * @param {Study} study
     * @param {Reporter} reporter
     * @returns {Promise<boolean>}
     */
      static create = (study , reporter) =>{
        return inserts.insertCompleteNewStudy(reporter , study)
    };
    
    /**
     * Get Studies attached to client
     * @param {string} client
     * @returns {Promise<Study[]>}
     */
    static getStudiesPerClient =  (client_name) => {
        return reads.getStudiesPerClient(client_name).then(studies => {
            return studies.map(study => {
                switch (study.status) {
                    case 0:
                        study.status= 'Created'
                        break;
                    case 1:
                        study.status= 'Agreement Form Completed'
                        break;
                    case 2:
                        study.status= 'In Progress'
                        break;
                    case 3:
                        study.status= 'Pending Approval'
                        break;
                    case 4:
                        study.status='Approved'
                        break;
                    case 5: 
                        study.status='Not Approved'
                        break;
                    default:
                        study.status= 'Rejected'
                        break;
                }
                return new Study(study)
            })
        })       
    };

    /**
     * 
     * @param {Study} study 
     */
     static getByName = ({cleanroomName , clientName , requestDate}) => {
        let reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertDateStringToObj(requestDate)); 
        return reads.getStudyByClientCleanroomReqDate(clientName , cleanroomName , reqDate).then(s => new Study(s))
    }

    /**
     * Get readings for a zone 
     * @param {Study} study 
     * @returns {Promise<Reading[]>}
     */
    static getReadingsForZone = ({clientName , cleanroomName , requestDate} , zone) => {
        let reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertDateStringToObj(requestDate)); 
        return reads.getZoneReadings(clientName , cleanroomName , reqDate , zone).then(readings => {
            return readings.map(reading => new Reading(reading))
        })
    }

    static getZonesForStudy = ({clientName , cleanroomName , requestDate}) => {
        // console.log('desde la linea 88')
        // console.log(requestDate)
        let reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertDateStringToObj(requestDate)); 
        return reads.getStudyZones(clientName , cleanroomName , reqDate)
    }

    static getNumberOfZonesInStudy = ({clientName , cleanroomName , requestDate}) => {
        // console.log('EN LA LINEA 93 del Handler')
        // console.log(requestDate)
        let reqDate = '';
        if (typeof requestDate=='string' && requestDate.length==24){
            reqDate=new Date(requestDate);
        }
        else{
            console.log('desde la linea 102')
            console.log(requestDate)
            reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj(requestDate)); 
        }
        return reads.getNumberOfZonesInStudy(clientName , cleanroomName , reqDate);
    }

    // static getDLtoZone = () => {
    //     return reads.getDataloggerToZoneForCleanroom
    // }
    /**
     * 
     * @param {Study} study 
     * 
     */
    static getZoneReadingsForOutOfRange = async ({clientName , cleanroomName , requestDate }) => {
        let reqDate='';
        if (typeof requestDate=='string' && requestDate.length==24){
            reqDate=new Date(requestDate);
        }
        else{
            reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj(requestDate));   
        }
        // console.log(requestDate)
        // console.log('desde la linea 109')
        // console.log(reqDate)
        let zones = await  reads.getZonesWithReadingsOutOfRange(clientName , cleanroomName , reqDate)
        let zoneReadings = []
        for( let i = 0 ; i < zones.length ; i++){
            let readings = await reads.getZoneReadings(clientName , cleanroomName , reqDate , zones[i].zone_number)
            let rhData = readings.map(r => {return {y:r.r_rh , x:r.r_ts}});
            let tempData = readings.map(r => {return {y:r.r_temp , x:r.r_ts}});
            zoneReadings.push({
                rhData,
                tempData,
                zoneNumber:zones[i]
            })
        }   
        return zoneReadings
    }


    static getReadingsPerZone = async ({clientName, cleanroomName, requestDate}) => {
        console.log('dsde la linea 140')
        let reqDate = '';
        if (typeof requestDate=='string' && requestDate.length==24){
            reqDate=new Date(requestDate);
        }
        else{
            reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj(requestDate)); 
        }
        let zones = await reads.getStudyZones(clientName, cleanroomName, reqDate);
        let zoneReadings = []
        for(let i = 0; i < zones.length; i++){
            let readings = await reads.getZoneReadings(clientName, cleanroomName, reqDate, zones[i].zone_number);
            let rhData = readings.map(r=>{return {y:r.r_rh, x:r.r_ts}});
            let tempData = readings.map(r=>{return {y:r.r_temp, x:r.r_ts}});
            zoneReadings.push({
                rhData,
                tempData,
                zoneNumber:zones[i]
            })
        }
        return zoneReadings
    }

    static getReadingsOutOfRange = async (study) => {
        return await dataAnalytics.getReadingsOutOfRange(study)
    }
    

    /**
     * 
     * @param {Study} study 
     * @returns 
     */
    static getDataloggerToZoneForCleanroom = ({clientName , cleanroomName , requestDate}) => {
        console.log('desde linea 179')
        console.log(requestDate)
        let reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj(requestDate)); 
        console.log(reqDate)
        return reads.getDataloggerToZoneForCleanroom(clientName , cleanroomName , reqDate);
    }


    /**
     * Get DLs attached to Study
     * @returns {DataloggerProfile[]}
     */
    static getDataloggersPerStudy =  (study) => {
        study = new Study(study)
        let reqDate = ''
        if (typeof study.requestDate == 'object'){
            reqDate = DateManager.convertReqDateObjectToDateString(study.requestDate); 
        } else{
            reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertDateStringToObj(study.requestDate)); 
        }
        return reads.getDataloggersPerStudy(study.clientName , study.cleanroomName , reqDate).then(dataloggers => {
            return dataloggers.map(dl => new DataloggerProfile(dl))
        })
    };

    /**
     * Get Studies attached to Reporter
     * @param {any} employeeID 
     * @returns {Promise<Study[]>}
     */
    static getStudiesPerReporter =  (employeeID) => {
        return reads.getStudiesPerReporter(employeeID).then(studies => {
            return studies.map(study => new Study(study))  
        })
    };

    /**
     * Request All Studies
     * 
     * @returns {Study[]}
     */
    static getAll =  () => {
        return reads.getAllStudies().then(resp=>{
            let studies = [];
            for(let i=0; i<resp.length; i++){
                // let req_date = resp[i].req_date.toDateString();
                let req_date = DateManager.formatDateToDisplay(resp[i].req_date).slice(0,10);
                studies.push(
                    {
                        id: resp[i].s_id,
                        // projectName: `${resp[i].c_name} ${req_date} ${resp[i].s_cleanroom}`,
                        clientName: resp[i].c_name,
                        cleanroomName: resp[i].s_cleanroom,
                        status: this.determineStatus(resp[i].s_status),
                        reporter: `${resp[i].r_first_name} ${resp[i].r_last_name}`,
                        requestDate: req_date,
                        maxTemp: resp[i].s_max_temp,
                        minTemp: resp[i].s_min_temp,
                        maxRH: resp[i].s_max_rh,
                        minRH: resp[i].s_min_rh,
                        dataloggersQty: resp[i].s_dl_quantity,
                        startDate: DateManager.formatDateToDisplay(resp[i].s_start_date),
                        duration: resp[i].s_duration_hours,
                        samplingFrequency: resp[i].s_sampling_frequency,
                        endDate: DateManager.formatDateToDisplay(this.getEndDate(resp[i].s_start_date, resp[i].s_duration_hours))
                    }
                )
            }
            return studies
        });
    };

    static getByDatalogger = (dl_name) => {
        return reads.getDlByName(dl_name).then(resp => {
            if(resp.length > 0){
                return new DataloggerProfile(resp[0])
            }else{
                return 'sorry'
            }
        })
    };


    static determineStatus = (status) => {
        // * 0 - created
        // * 1 - agreement form completed
        // * 2 - study in progress
        // * 3 - pending approval
        // * 4 - approved
        // * 5 - not approved
        switch(status){
            case 0:
                return "Created";
            case 1:
                return "Agreement Form Completed";
            case 2:
                return "In Progress";
            case 3:
                return "Pending Approval";
            case 4:
                return "Approved";
            case 5: 
                return "Not Approved";
            default:
                return "cannot be determined"
        }
    }

    static getStudyForApproverPage = () => {
        return reads.getStudyForApproverPage()
        .then(resp => {
            let studies = [];
            for(let i=0; i<resp.length; i++){
                let req_date = DateManager.formatDateToDisplay(resp[i].req_date).slice(0,10); 
                studies.push(
                    {
                        id: resp[i].s_id,
                        projectName: `${resp[i].c_name} ${req_date} ${resp[i].s_cleanroom}`,
                        client: resp[i].c_name,
                        status: this.determineStatus(resp[i].s_status),
                        reporter: `${resp[i].r_first_name} ${resp[i].r_last_name}`,
                        requestDate: req_date
                    }
                )
            }
            return studies
        })
    }

    /**
     * 
     * @param {Date} startDate 
     * @param {number} duration 
     * @returns 
     */
    static getEndDate = (startDate, duration) => {
        startDate = startDate.getTime()/1000;
        duration = duration * 3600;
        let endDate = startDate + duration;
        console.log('desde get end date')
        console.log(new Date(endDate*1000))
        return (new Date(endDate * 1000));
    }

    static getStudiesByReporterComplete = (id) => {
        // returns array

        return reads.getStudiesByReporterComplete(id).then(resp=>{
            let studies = [];
            // console.log(id)
            // console.log(resp)
            for(let i=0; i<resp.length; i++){
                let req_date = DateManager.formatDateToDisplay(resp[i].req_date).slice(0,10); 
                let startDate = '';
                if (typeof resp[i].s_start_date == 'string' && resp[i].s_start_date.length == 24){
                    startDate = DateManager.formatDateToDisplay(DateManager.convertFullDateStringToObj(resp[i].s_start_date))
                }
                else{
                    startDate = DateManager.formatDateToDisplay(resp[i].s_start_date);
                }
                // console.log(DateManager.formatDateToDisplay(resp[i].s_start_date))
                
                studies.push(
                    {
                        id: resp[i].s_id,
                        // projectName: `${resp[i].c_name} ${req_date} ${resp[i].s_cleanroom}`,
                        clientName: resp[i].c_name,
                        cleanroomName: resp[i].s_cleanroom,
                        status: this.determineStatus(resp[i].s_status),
                        reporter: `${resp[i].r_first_name} ${resp[i].r_last_name}`,
                        requestDate: req_date,
                        maxTemp: resp[i].s_max_temp,
                        minTemp: resp[i].s_min_temp,
                        maxRH: resp[i].s_max_rh,
                        minRH: resp[i].s_min_rh,
                        dataloggersQty: resp[i].s_dl_quantity,
                        // startDate: resp[i].s_start_date,
                        startDate: startDate,
                        duration: resp[i].s_duration_hours,
                        samplingFrequency: resp[i].s_sampling_frequency/60.0,
                        endDate: DateManager.formatDateToDisplay(this.getEndDate(resp[i].s_start_date, resp[i].s_duration_hours))
                    }
                )
            }
            return studies
        });
    }

    static getStudyById = async (id) => {
        let studies = await reads.getStudyById(id);
        let zonesQty = await reads.getNumberOfZonesInStudy(studies[0].c_name, studies[0].s_cleanroom, studies[0].req_date)
        
        // studies[0].s_start_date =  DateManager.formatDateToDisplay(studies[0].s_start_date);
        zonesQty = zonesQty[0].number_of_zones
        
        let endDate = DateManager.formatDateToDisplay(this.getEndDate(studies[0].s_start_date , studies[0].s_duration_hours));
        
        let studyToReturn = {
            id: id,
            clientName: studies[0].c_name,
            cleanroomName: studies[0].s_cleanroom,
            status: this.determineStatus(studies[0].s_status),
            reporter: `${studies[0].r_first_name} ${studies[0].r_last_name}`,
            requestDate: DateManager.formatDateToDisplay(studies[0].req_date).slice(0,10),
            maxTemp: studies[0].s_max_temp,
            minTemp: studies[0].s_min_temp,
            maxRH: studies[0].s_max_rh,
            minRH: studies[0].s_min_rh,
            dataloggersQty: studies[0].s_dl_quantity,
            startDate: DateManager.formatDateToDisplay(studies[0].s_start_date),
            duration: studies[0].s_duration_hours, 
            samplingFrequency: studies[0].s_sampling_frequency/60.0,
            endDate: DateManager.formatDateToDisplay(this.getEndDate(studies[0].s_start_date , studies[0].s_duration_hours)),
            zonesQty: zonesQty
        }
        
        
        return studyToReturn;
        
        // return studies.map(study => new Study({...study , zonesQty , endDate}));

    }

    /**
     * 
     * @param {Study} study 
     * @param {{
     *      startDate:Date,
     *      studyDuration:Number,
     *      maxTemp:Number,
     *      minTemp:Number,
     *      maxRH:Number,
     *      minRH:Number,
     *      samplingRate:Number,
     * }} params 
     * 
     * @returns {Boolean}
     */
    static addProgramParametersToStudy = (study , params) =>  {
        return inserts.addProgramDataloggerParams(study , params)
    }

    /**
     * 
     * @param {Study} study 
     */
    static getAnalyticsPerZone = (study) => {
        return dataAnalytics.getAnalyticsPerZone(study).then(data => {
            return data
        })
    }


    /**
     * Get ranges for study 
     */
    static getRangesForStudy = (studyName) => {
        return reads.getRangesForStudy(studyName).then(r => {return r})
    }

    /**
     * @param {Study} study
     * @param {DataloggerProfile} datalogger
     * @returns {Promise<Boolean>}
     */
    static attachDatalogger = (study , datalogger) => {
        return inserts.insertDataloggerToStudy(study , datalogger)
    }

    /**
     * 
     * @param {number} zone 
     * @param {DataloggerProfile} datalogger 
     * @param {Study} study 
     * @returns {Promise<Boolean>}
     */
    static attachDataloggerToZone = (zone , datalogger , study) => {
        return updates.addZoneToDatalogger(zone , datalogger , study )
    }

 

    /**
     * 
     * @param {Study} study 
     * @param {string[]} changes 
     * @returns {Promise<boolean>}
     * @deprecated
     */
    static oldUpdate = (study) => {
        let oldStudy = this.getByName(study)
        
      if(oldStudy.maxTemp != study.maxTemp
        ||oldStudy.minTemp != study.minTemp
        ||oldStudy.maxRh != study.maxRh
        ||oldStudy.minRh != study.minRh)
      {
          updates.updateStudyAlarms()
      }
        
        let promises = []
        changes.forEach(param => {
            switch (param) {
                case 'study_status':
                    promises.push(updates.changeStudyStatus(study , study.s_status))
                    break
                case 'cleanroom_name':
                    promises.push(updates.changeCleanroomName(study , study.cleanroomName))
                    break
                case 'datalogger_qty':
                    promises.push(updates.changeQtyOfDlInStudy(study , study.dataloggersQty))
                    break
                default:
                    break;
            }
        });
        return Promise.all(promises)
            .then(r => true)
            .catch(r => false)

    }

    static updateStatus = (study_id  , status) => {
        return updates.changeStudyStatus(study_id , status)
    }

    static formatDataForDataPerZoneView = async (study) => {
        let reqDate = '';
        if (typeof study.requestDate=='string' && study.requestDate.length==24){
            reqDate=new Date(study.requestDate);
        }else{
            reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertReqDateStringToObj(study.requestDate)); 
        }
        let zones = await reads.getStudyZones(study.clientName, study.cleanroomName, reqDate);
        let res = {};
        let j = 1;
        for (let i = 0; i<zones.length; i++){
            let readings = await reads.getZoneReadings(study.clientName, study.cleanroomName, reqDate, zones[i].zone_number);
            // console.log(readings)
            let studyReadings = readings.map(r=>{return {
                id:j++,
                temp:r.r_temp,
                rh:r.r_rh,
                ts: DateManager.formatDateToDisplay((new Date(r.r_ts)))
            }})
            ;
            res[zones[i].zone_number]=studyReadings;
        }
        console.log(res)
        return res;
    }

    /**
     * 
     * @param {Date} date1 
     * @param {Date} date2 
     * @returns the difference in hours between the two dates
     */
     static calculateStudyDuration = (date1, date2) => {
        date1 = new Date(Date.parse(date1))
        date2 = new Date(Date.parse(date2))
        const diffInMs = Math.abs(date2 - date1);
        let res =  diffInMs / (1000 * 60 * 60);
        return res.toFixed(1);
    }

     /**
     * 
     * @param {Study} study 
     * @returns {Promise<boolean>}
     */
      static update = async  (study) => {

        let og_study = (await reads.getStudyById(study.id))
        og_study = og_study[0]

        let new_study = new Study(study)

        new_study = new_study.getInDBAliases()
        new_study.req_date = DateManager.convertReqDateObjectToDateString(new_study.req_date);

        let updatesForStudy = {}

        Object.keys(new_study).forEach(key =>{
            updatesForStudy['s_duration_hours'] = this.calculateStudyDuration(new_study['s_start_date'], new_study['s_end_date'])
            if((typeof og_study[key] != 'object')){
                if(og_study[key] != new_study[key]){
                    if(key != 's_id'){
                        
                        updatesForStudy[key] = new_study[key]
                        // console.log(`${key} og: ${og_study[key]} new: ${new_study[key]}`)
                    }
                }
            }else{
                console.log('esto es lo que quiero ver')
                console.log(og_study[key])
                console.log(key)
                if(og_study[key].getTime() !== new_study[key] && (key != 's_end_date')){
                    // console.log(`${key} og: ${og_study[key].getTime()} new: ${new_study[key]}`)
                    console.log(`${key} og: ${og_study[key]} new: ${new_study[key]}`)
                    updatesForStudy[key] = new_study[key]
                }
            }
        })
        if(Object.keys(updatesForStudy).length == 0)return true;
        return updates.updateStudy(study.id , updatesForStudy)

    }
    
}

module.exports = {Study , StudyHandler}

