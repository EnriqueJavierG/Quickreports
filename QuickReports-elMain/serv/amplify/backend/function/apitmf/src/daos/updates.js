// // development environment
// const {runQuery} = require('../database')

// Testing environment
const {runQuery} = require('../testing/DaoTesting/databaseTestingInstance');


const reads = require('./reads');

/**
 * @author Fabiola Badillo Ramos
 * change status for study 
 * @param {Study} study_id 
 * @param {Number} status 
 * 0 - created
 * 1 - agreement form completed
 * 2 - study in progress
 * 3 - pending approval
 * 4 - approved
 * 5 - not approved
 */
const changeStudyStatus = async (study_id, status) => {
    try {
        // // deconstructing studyObj
        // let clientName = studyObj.clientName;
        // let cleanroomName = studyObj.cleanroomName;
        // let reqDate = studyObj.requestDate.toISOString().slice(0,10);
        // find PK of study
        // const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = study_id
        
        // update the status
        let updateStatusQuery = 'update Study set s_status = ? where s_id = ?;';
        await runQuery(updateStatusQuery, [status, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @param {Number} approval 
 * either 0 (not approved) or 1 (approved)
 */
const approveStudy = async (studyObj, approval) => {
    try {
        // deconstructing object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);

        // find PK of study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // set study as approved
        let approveStatusQuery = 'update Study set s_is_approved = ? where s_id = ?;';
        await runQuery(approveStatusQuery, [approval, studyPK]);
        return true;
    }
    catch(e) {
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {DataloggerProfile} dlProfObj 
 * @param {float} newOffset
 */
const editDLOffset = async (dlProfObj, newOffset) => {
    try {
        // deconstructing datalogger profile object 
        let dlName = dlProfObj.dlName;
        // let newOffset = dlProfObj.dlOffset;

        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        let editOffsetQuery = 'update Datalogger set dl_offset = ? where dl_id = ?;';
        await runQuery(editOffsetQuery, [newOffset, dlPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};

/**
 * 
 */
const updateStudy = async (studyId , updates) => {
    let updateQuery = `UPDATE Study SET `
    let args = []
    Object.keys(updates).forEach(async(key) => {
        
        if(key == 'req_date'){
            await runQuery(`update Requests set req_date=? where study=?;`, [updates[key],studyId ]);
        }
        else if(key == 's_end_date'){
            
        }else{
            updateQuery += ` ${key} = ? ,`
            args.push(updates[key])
        }
    })
    
    updateQuery =updateQuery.substring(0,updateQuery.length - 1) // delete extra comma
    updateQuery += ` WHERE s_id = ?`
    args.push(studyId)
    // console.log(updateQuery)
    // console.log(args)
    try {
        await runQuery(updateQuery , args)
        return true
    }catch(e){
        console.error(e)
        return false;
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {Number} zoneNumber 
 * @param {DataloggerProfile} dlProfObj 
 * @param {Study} studyObj 
 * adds zone number to records in the Participates relationship
 * if you want to add a datalogger to study it must be done with an insert operation (inserts.js)
 */
const addZoneToDatalogger = async (zoneNumber, dlProfObj, studyObj) => {
    try {
        console.log(zoneNumber)

        // destructing objects
        dlName = dlProfObj.dlName;
        console.log(dlName)
        clientName = studyObj.clientName;
        cleanroomName = studyObj.cleanroomName;
        reqDate = new Date(studyObj.requestDate);
        
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        let zoneToDLquery = 'update Participates set zone_number = ? where study = ? and dl = ?;';
        await runQuery(zoneToDLquery, [zoneNumber, studyPK, dlPK]);
        return true;
    } 
    catch(e) {
        console.error(e);
        return false;
    }
};

/**
 * @author Fabiola Badillo Ramos
 * change the number of dataloggers associated to a study
 * @param {Study} studyObj 
 * @param {Number} newDlQty 
 */
const changeQtyOfDlInStudy = async (studyObj, newDlQty) => {
    try {
        // deconstruct the object 
        clientName = studyObj.clientName;
        cleanroomName = studyObj.cleanroomName;
        reqDate = studyObj.requestDate;
        // get PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;
        // query for changing the number of dataloggers per zone 
        let changeQtyDlQuery = 'update Study set s_dl_quantity = ? where s_id = ?';
        await runQuery(changeQtyDlQuery, [newDlQty, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * changes the reporter associated to a study
 * @param {Study} studyObj 
 * @param {Reporter} reporterObj 
 */
const changeStudyReporter = async (studyObj, reporterObj) => {
    try{
        // deconstruct the object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);
        let reporterFname = reporterObj.fname;
        let reporterLname = reporterObj.lname;

        // get reporter PK from name and last name
        const repRes = await reads.getReporterByName(reporterFname, reporterLname);
        let repPK = repRes[0].r_id;

        // get PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query for changing the reporter associated to the project
        let changeStudyReporterQuery = 'update Validates set reporter = ? where study = ?;';
        await runQuery(changeStudyReporterQuery, [repPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};

/**
 * @author Fabiola Badillo Ramos
 * remove DL from study 
 * @param {Study} studyObj 
 * @param {DataloggerProfile} dlProfObj 
 */
const removeDLFromStudy = async (studyObj, dlProfObj) => {
    try{
        // deconstruct object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;
        let dlName = dlProfObj.dlName;

        // get PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // get PK for DL
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        // query to remove datalogger from study
        let removeDLfromStudyQuery = 'delete from Participates where dl = ? and study = ?;';
        await runQuery(removeDLfromStudyQuery, [dlPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};

/**
 * @author Fabiola Badillo Ramos
 * change the request date for a study
 * @param {Study} studyObj 
 * @param {Date} newReqDate 
 * the date must be in the format 'YYYY-MM-DD'
 */
const updateRequestDateForStudy = async (studyObj, newReqDate) => {
    try {
        // deconstruct objects
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // get client PK
        const clientRes = await reads.getClientByName(clientName);
        let clientPK = clientRes[0].c_id;

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to update the request date for given study
        changeStudyReqDate = 'update Requests set req_date = ? where clients = ? and study = ?;';
        await runQuery(changeStudyReqDate, [newReqDate, clientPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change cleanroom name of existing project
 * @param {Study} studyObj 
 * @param {String} newCleanroomName 
 */
const changeCleanroomName = async (studyObj, newCleanroomName) => {
    try {
        // decostruct object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to change cleanroom name
        changeCRnameQuery = 'update Study set s_cleanroom = ? where s_id = ?;';
        await runQuery(changeCRnameQuery, [newCleanroomName, studyPK]);
        return true;
    }
    catch (e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change study alarms for an existing study
 * @param {Study} studyObj 
 * @param {float} newMaxTemp 
 * @param {float} newMinTemp 
 * @param {float} newMaxRh 
 * @param {float} newMinRh 
 */
const updateStudyAlarms = async (studyObj, newMaxTemp, newMinTemp, newMaxRh, newMinRh) => {
    try {
        // deconstruct object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to update study alarms
        let changeStudyAlarmsQuery = 'update Study set s_max_temp = ?, s_min_temp = ?, s_max_rh = ?, s_min_rh = ? \
        where s_id = ?;';
        await runQuery(changeStudyAlarmsQuery, [newMaxTemp, newMinTemp, newMaxRh, newMinRh, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @param {Number} newDuration 
 * newDuration -> study duration in hours 
 * must be converted to hours if user inputs it in other unit
 */
const changeStudyDuration = async (studyObj, newDuration) => {
    try {
        // deconstruct object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to change study duration 
        changeStudyDurationQuery = 'update Study set s_duration_hours = ? where s_id = ?;';
        await runQuery(changeStudyDurationQuery, [newDuration, studyPK]);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @param {Number} newSamplingFreq 
 * newSamplingFreq is in seconds (ie every 5 minutes = every 300 seconds)
 */
const changeStudySamplingFrequency = async (studyObj, newSamplingFreq) => {
    try {
        // deconstruct object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to change sampling frequency
        let changeSamplingFreqQuery = 'update Study set s_sampling_frequency = ? where s_id = ?;';
        await runQuery(changeSamplingFreqQuery, [newSamplingFreq, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * 
 * @param {Study} studyObj 
 * @param {Date} newStartDate 
 * the date must be in the format 'YYYY-MM-DD HH:MM'
 */
const changeStudyStartDate = async (studyObj, newStartDate) => {
    try {
        // deconstruct object
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);

        // get study PK
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // query to change start time
        let changeStartDateQuery = 'update Study set s_start_date = ? where s_id = ?;';
        await runQuery(changeStartDateQuery, [newStartDate, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {DataloggerProfile} dlProfObj 
 * @param {String} newName 
 * newName must be a string with only numerical values
 * this method must only be used if the name was entered incorrectly the first time
 * the user must not be able to edit de Datalogger name 
 */ 
const changeDlName = async (dlProfObj, newName) => {
    try {
        // deconstructing object 
        let dlName = dlProfObj.dlName;

        // get PK for DL
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        // change dl name query
        changeDlNameQuery = 'update Datalogger set dl_ID_number = ? where dl_id = ?;';
        await runQuery(changeDlNameQuery, [newName, dlPK]);
        return true;

    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {DataloggerProfile} dlProfObj 
 * @param {String} newSerialNumber 
 * this method must only be used if the serial number was entered incorrectly the first time
 * the user must not be able to edit de Datalogger serial number 
 */
const changeDlSerialNumber = async (dlProfObj, newSerialNumber) => {
    try {
        // deconstructing object 
        let dlName = dlProfObj.dlName;

        // get PK for DL
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        // change dl name query
        changeDlSerialNumQuery = 'update Datalogger set dl_serial_number = ? where dl_id = ?;';
        await runQuery(changeDlSerialNumQuery, [newSerialNumber, dlPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nist manufacturer for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newNistMan 
 */
const changeCalSessNistManuf = async (calSessObj, newNistMan) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNistManufQuery = 'update Calibration_Sess set nist_manufacturer = ? where cal_id = ?;';
        await runQuery(changeNistManufQuery, [newNistMan, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nist number for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newNistNum 
 */
const changeCalSessNistNumber = async (calSessObj, newNistNum) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNistNumberQuery = 'update Calibration_Sess set nist_number = ? where cal_id = ?;';
        await runQuery(changeNistNumberQuery, [newNistNum, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nist model for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newNistModel 
 */
 const changeCalSessNistModel = async (calSessObj, newNistModel) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNistModelQuery = 'update Calibration_Sess set nist_model = ? where cal_id = ?;';
        await runQuery(changeNistModelQuery, [newNistModel, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nist serial number for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newNistSerNum 
 */
 const changeCalSessNistSerNumber = async (calSessObj, newNistSerNum) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNistSerNumQuery = 'update Calibration_Sess set nist_serial_number = ? where cal_id = ?;';
        await runQuery(changeNistSerNumQuery, [newNistSerNum, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal low temperature for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newLowTemp 
 */
 const changeCalSessNomLowTemp = async (calSessObj, newLowTemp) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomLowTempQuery = 'update Calibration_Sess set nom_low_temp = ? where cal_id = ?;';
        await runQuery(changeNomLowTempQuery, [newLowTemp, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal med temperature for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newMedTemp 
 */
 const changeCalSessNomMedTemp = async (calSessObj, newMedTemp) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomMedTempQuery = 'update Calibration_Sess set nom_med_temp = ? where cal_id = ?;';
        await runQuery(changeNomMedTempQuery, [newMedTemp, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal high temperature for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newHighTemp 
 */
 const changeCalSessNomHighTemp = async (calSessObj, newHighTemp) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomHighTempQuery = 'update Calibration_Sess set nom_high_temp = ? where cal_id = ?;';
        await runQuery(changeNomHighTempQuery, [newHighTemp, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal low rh for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newLowRh
 */
 const changeCalSessNomLowRH = async (calSessObj, newLowRh) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomLowRHQuery = 'update Calibration_Sess set nom_low_rh = ? where cal_id = ?;';
        await runQuery(changeNomLowRHQuery, [newLowRh, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal med rh for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newMedRh
 */
 const changeCalSessNomMedRH = async (calSessObj, newMedRh) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomMedRHQuery = 'update Calibration_Sess set nom_med_rh = ? where cal_id = ?;';
        await runQuery(changeNomMedRHQuery, [newMedRh, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal high rh for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {float} newHighRh
 */
 const changeCalSessNomHighRH = async (calSessObj, newHighRh) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomHighRHQuery = 'update Calibration_Sess set nom_high_rh = ? where cal_id = ?;';
        await runQuery(changeNomHighRHQuery, [newHighRh, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal low temperature timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newLowTempTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomLowTempTs = async (calSessObj, newLowTempTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomLowTempTsQuery = 'update Calibration_Sess set nom_low_temp_ts = ? where cal_id = ?;';
        await runQuery(changeNomLowTempTsQuery, [newLowTempTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal med temperature timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newMedTempTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomMedTempTs = async (calSessObj, newMedTempTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomMedTempTsQuery = 'update Calibration_Sess set nom_med_temp_ts = ? where cal_id = ?;';
        await runQuery(changeNomMedTempTsQuery, [newMedTempTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal high temperature timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newHighTempTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomHighTempTs = async (calSessObj, newHighTempTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomHighTempTsQuery = 'update Calibration_Sess set nom_high_temp_ts = ? where cal_id = ?;';
        await runQuery(changeNomHighTempTsQuery, [newHighTempTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal low rh timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newLowRHTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomLowRHTs = async (calSessObj, newLowRHTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomLowRHTsQuery = 'update Calibration_Sess set nom_low_rh_ts = ? where cal_id = ?;';
        await runQuery(changeNomLowRHTsQuery, [newLowRHTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal med rh timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newMedRHTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomMedRHTs = async (calSessObj, newMedRHTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomMedRHTsQuery = 'update Calibration_Sess set nom_med_rh_ts = ? where cal_id = ?;';
        await runQuery(changeNomMedRHTsQuery, [newMedRHTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * change nominal high rh timestamp for calibration session by the time stamp of the low temperature measure 
 * @param {CalibrationSess} calSessObj 
 * @param {String} newHighRHTs 
 * timestamp must be in the format 'YYYY-MM-DD HH:MM'
 */
 const changeCalSessNomHighRHTs = async (calSessObj, newHighRHTs) => {
    try {
        // deconstruct object
        let lowTempTs = calSessObj.lowTempTs;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        // query to change nist manufacturer
        let changeNomHighRHTsQuery = 'update Calibration_Sess set nom_high_rh_ts = ? where cal_id = ?;';
        await runQuery(changeNomHighRHTsQuery, [newHighRHTs, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
    }
};

/**
 * @author Fabiola Badillo Ramos
 * @param {DataloggerProfile} dlProfObj 
 * @param {Number} flag - either 0 for false or 1 for true
 */
const editDlToleranceFlag = async (dlProfObj, flag) => {
    try {
        // get PK for datalogger
        let dlName = dlProfObj.dlName;
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;
        
        let dlToleranceQuery = 'update Datalogger set dl_in_tolerance = ? where dl_id = ?;';
        await runQuery(dlToleranceQuery, [flag, dlPK])
        return true;
    } 
    catch(e){
        console.error(e);
        return false;
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {Reporter} reporterPK 
 * @param {String} accountStatus - it must be one of three strings: 
 * pending
 * approved
 * denied
 */
const editReporterAccountStatus = async (repPK, accountStatus) => {
    try{
        // let reporterEmployeeId = reporterObj.employeeId;
        // get reporter PK from employee id
        // const repRes = await reads.getReporterByEmployeeId(reporterEmployeeId);
        // let repPK = reporterObj;

        // query for updating the account status for the reporter
        let changeAccountStatusQuery = 'update Reporter set r_account_status = ? where r_id=?';
        await runQuery(changeAccountStatusQuery, [accountStatus, repPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {Client} clientObj 
 * @param {String} accountStatus - it must be one of three strings: 
 * pending
 * approved
 * denied
 */
const editClientAccountStatus = async (clientObj, accountStatus) => {
    try {
        // get client PK from name
        let clientName = clientObj.clientName;
        // const clientRes = await reads.getClientByName(clientName);
        const clientPK = clientObj;

        // query for updating client account status
        let changeClientAccountStatusQuery = 'update Clients set c_account_status = ? where c_id=?;';
        await runQuery(changeClientAccountStatusQuery, [accountStatus, clientPK]);
        return true;
    }
    catch(e){
        console.error(e);
    }
};

/**
 * 
 * @param {Study} studyObj 
 * @param {boolean} isApproved 0 false 1 true
 */
const changeStudyApproval = async (studyObj, isApproved) => {
    try {
        let clientName = studyObj.clientName;
        let cleanroom = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroom, reqDate);
        let studyPK = studyRes[0].s_id

        let studyApprovalQuery = 'update Study set s_is_approved = ? where s_id=?; ';
        await runQuery(studyApprovalQuery, [isApproved, studyPK])
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}

const setCalibrationReporter = async (calSess, reporterObj) => {
    try{
        let lowTempTs = calSess.lowTempTs;
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;

        let repEmpId = reporterObj.employeeId;
        const repRes = await reads.getReporterByEmployeeId(repEmpId);
        let repPk = repRes[0].r_id;

        let addCalibratorQuery = 'insert into Works_On (rep, cal) \
        VALUES (?,?)';
        await runQuery(addCalibratorQuery, [repPk, calSessPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}


const matchDataloggerWithCalSess = async (dlObj, calSess, calReadings) => {
    try{

        console.log('calReadings')
        console.log(calReadings)

        // get PK for datalogger
        let dlName = dlObj.dlName;
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;
        // get PK for calSess
        let lowTempTs = calSess.nom_low_temp_ts;
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;
        // deconstruct object with real readings
        let realLowTemp = calReadings.lowTemp;
        let realMedTemp = calReadings.medTemp;
        let realHighTemp = calReadings.highTemp;
        let realLowRH = calReadings.lowRh;
        let realMedRH = calReadings.medRh;
        let realHighRH = calReadings.highRh;

        let calDate = lowTempTs;

        let calibratesQuery = 'INSERT INTO Calibrates (cal_sess, dl, cal_date, dl_r_low_temp, dl_r_med_temp, dl_r_high_temp, dl_r_low_rh, dl_r_med_rh, dl_r_high_rh) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
        let queryParams = [calSessPK, dlPK, calDate, realLowTemp, realMedTemp, realHighTemp, realLowRH, realMedRH, realHighRH]
        console.log('el query para la tabla de calibrates que nos ignora la bitch')
        console.log(calibratesQuery)
        console.log('los parametros que le estamos pasando')
        console.log(queryParams);
        let r = await runQuery(calibratesQuery, queryParams)
        console.log('el resilt del query que nos ignora')
        console.log(r)
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


const editReporterRole = async (reporterObj, status) => {
    try{
        let reporterEmployeeId = reporterObj.employeeId;
        // const repRes = await reads.getReporterByEmployeeId(reporterEmployeeId);
        let repPK = reporterObj;
        let validate = 0;
        let calibrate = 0;
        if (status == 'validate'){
            validate = 1;
        }
        else { // calibrate
            calibrate = 1;
        }
        let editRoleQuery = 'update Reporter set r_can_validate=? where r_id=?;';
        await runQuery(editRoleQuery, [validate ,repPK]);
        let editRoleQuery2 = 'update Reporter set r_can_calibrate=? where r_id=?;';
        await runQuery(editRoleQuery2, [calibrate ,repPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}


// --------- TEST ---------------
// let study = {
//     studyId: 0,
//     clientName: 'Bard',
//     requestDate: '2020-02-02',
//     description: 'desc',
//     dataloggersQty: 4,
//     dataloggers: [],
//     cleanroomName: 'CR23'
// }; 

// let study = {
//     studyId: 0,
//     clientName: 'Prueba de Aggregates',
//     requestDate: '2021-03-31',
//     description: 'desc',
//     dataloggersQty: 4,
//     dataloggers: [],
//     cleanroomName: 'Cuarto limpio'
// };

let study2 = {
    studyId: 0,
    clientName: 'Abbott',
    requestDate: '2021-10-10',
    description: 'desc',
    dataloggersQty: 4,
    dataloggers: [],
    cleanroomName: 'CR51'
};

let reporter = {
    employeeId: '546521',   
    fname: 'Jim',
    lname: 'Halpert',
    role: 'validate'
}

let dl = {
    dlName: '14',
    dlSerialNumber: 'rt8b1w78c63',
    dlOffset: 1.9
}

let calSess = {
    nistManuf : 'vaisala',
    nistNumber : 'nist number 1',
    nistModel : 'nist model 1',
    nistSerNum : 'ser num 1',
    lowTemp : 20.3,
    lowTempTs : new Date(2021, 9, 29, 12), // '2021-10-29 12:00:00'
    medTemp : 86.3,
    medTempTs : '2021-01-01 14:00:00',
    highTemp : 132.6,
    highTempTs : '2021-01-01 16:00:00',
    lowRh : 12.3,
    lowRhTs : '2021-09-09 02:00:00',
    medRh : 46.5,
    medRhTs : '2021-01-01 14:00:00',
    highRh : 67.3,
    highRhTs : '2021-01-01 16:00:00'
}

let client = {
    clientName: 'Abbott',
    email: 'abc',
    telephone: 'no importa'
}

let calReadings = {
    lowTemp:20,
    highTemp:60,
    medTemp:40,
    highRh:60,
    lowRh:20,
    medRh:40,
}


// editReporterRole(reporter, 'calibrate');

// let s = matchDataloggerWithCalSess(dl,calSess,calReadings)
// console.log(s)

// changeStudyApproval(study2, 1);

// changeCalSessNomHighRHTs(calSess, '2021-01-01 16:30:00');

// changeCalSessNomMedRHTs(calSess, '2021-01-01 14:30:00');

// changeCalSessNomLowRHTs(calSess, '2021-09-09 02:30:00');

// changeCalSessNomHighTempTs(calSess, '2021-01-01 16:30:00');

// changeCalSessNomMedTempTs(calSess, '2021-01-01 14:30:00');

// changeCalSessNomLowTempTs(calSess, '2021-01-01 12:30:00' );

// changeCalSessNomHighRH(calSess, 68.7);

// changeCalSessNomMedRH(calSess, 47.8);

// changeCalSessNomLowRH(calSess, 15.3);

// changeCalSessNomHighTemp(calSess, 133.9);

// changeCalSessNomMedTemp(calSess, 85.3);

// changeCalSessNomLowTemp(calSess, 20.5);

// changeCalSessNistSerNumber(calSess, 'SER NUM 1');

// changeCalSessNistModel(calSess, 'NIST MODEL 1');

// changeCalSessNistNumber(calSess, 'NIST NUMBER 1');

// changeCalSessNistManuf(calSess, 'VAISALA');

// changeDlSerialNumber(dl, 'ni8g1w8h5b');

// changeDlName(dl, 84);

// changeStudyStartDate(study, '2020-02-02 08:00:00');

// changeStudySamplingFrequency(study, 600);

// updateStudyDuration(study, 150);

// updateStudyAlarms(study, 90, 70, 70, 50);

// changeCleanroomName(study, 'CR4');

// updateRequestDateForStudy(study, '2021-03-04');

// removeDLFromStudy(study, dl);

// changeStudyReporter(study, reporter);

// changeQtyOfDlInStudy(study, 90);

// editDlToleranceFlag(dl, 0);

// editReporterAccountStatus(reporter, "pending");

// editClientAccountStatus(client, "pending");

module.exports = {changeStudyStatus,//study
    editDLOffset,//datalogger
    addZoneToDatalogger,//study creo que es addddltozone btw
    changeQtyOfDlInStudy, //study
    removeDLFromStudy,//study
    changeCleanroomName,//study
    updateStudyAlarms,//study
    changeStudyDuration,//study
    changeStudySamplingFrequency,//study
    changeStudyStartDate,//study
    changeDlSerialNumber,//datalogger
    updateRequestDateForStudy,//study
    changeCalSessNistManuf,//cal
    changeCalSessNistNumber,//cal
    changeCalSessNistModel,//cal
    changeCalSessNistSerNumber,//cal
    changeCalSessNomLowTemp,
    changeCalSessNomMedTemp, 
    changeCalSessNomHighTemp, 
    changeCalSessNomLowRH,
    changeCalSessNomMedRH,
    changeCalSessNomHighRH,
    changeCalSessNomLowTempTs,
    changeCalSessNomMedTempTs,
    changeCalSessNomHighTempTs,
    changeCalSessNomLowRHTs,
    changeCalSessNomMedRHTs,
    changeCalSessNomHighRHTs,
    changeDlName,//datalogger
    changeStudyReporter, // study
    editDlToleranceFlag,
    editReporterAccountStatus,
    editClientAccountStatus,
    changeStudyApproval,
    setCalibrationReporter,
    matchDataloggerWithCalSess,
    editReporterRole,
    updateStudy
}