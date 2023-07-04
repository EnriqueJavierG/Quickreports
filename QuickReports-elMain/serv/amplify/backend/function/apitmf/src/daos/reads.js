// // development environment
// const {runQuery} = require('../database')

// Testing environment
const {runQuery} = require('../testing/DaoTesting/databaseTestingInstance');

/**
 * @author Fabiola Badillo Ramos
 * @param {String} client_name 
 * @returns all the studies associated with that client
 * the client names must be unique in the system
 */
const getStudiesPerClient = async (client_name) => {
    try {
        let q = 'select s_id, c_id, c_name, req_date, s_cleanroom, s_start_date, \
        s_duration_hours, s_max_temp, s_min_temp, s_max_rh, s_min_rh, s_dl_quantity, \
         s_status, s_is_approved, s_sampling_frequency \
        from Clients inner join Requests on Clients.c_id = Requests.clients \
        inner join Study on Requests.study = Study.s_id \
        where c_name = ?;' ;
        return await runQuery(q, [client_name]);
    } 
    catch(e) {
        console.error(e);
    }
}

/**
 * 
 * @returns all dataloggers in the system
 */
const getAllDataloggers = async () => {
    try{
        let q = "select * from Datalogger"
        return await runQuery(q)
    }catch(e){
        console.error(e)
        return false
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate - must be in the format 'YYYY-MM-DD'
 * @returns information on the dataloggers associated to the study
 */
const getDataloggersPerStudy = async (clientName, cleanroomName, reqDate) => {
    try {
        // let date = reqDate.toISOString().slice(0,10);

        const studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let q = 'select s_id, s_cleanroom, dl_id, dl_ID_number, dl_serial_number, dl_offset, dl_in_tolerance \
        from Datalogger inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? ;'
        let s =  await runQuery(q, [studyPK]);
        console.log('desde el dao', s)
        return s
    }
    catch(e){
        console.error(e);
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @returns all calibration session records
 */
 const getAllCalSess = async () => {
    try{
        let q = 'select cal_id, nist_manufacturer, nist_number, nist_model, nist_serial_number, \
        nom_low_temp, nom_med_temp, nom_high_temp, nom_low_temp_ts, nom_med_temp_ts, nom_high_temp_ts, \
        nom_low_rh, nom_med_rh, nom_high_rh, nom_low_rh_ts, nom_med_rh_ts, nom_high_rh_ts \
        from Calibration_Sess;'
        return await runQuery(q);
    }
    catch(e){
        console.error(e);
    }
}


// dataloggers per client 
/**2
 * @author Fabiola Badillo Ramos
 * @param {String} client_name 
 * @returns information on the dataloggers that were at one moment rented to the specified client
 */
const getDataloggersPerClient = async (client_name) => {
    try {
        let q = 'select dl_id, c_id, dl_ID_number, s_start_date, c_name \
        from Datalogger inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        inner join Requests on Study.s_id = Requests.study \
        inner join Clients on Requests.clients = Clients.c_id \
        where c_name = ? \
        order by c_id;';
        return await runQuery(q, [client_name]);
    }
    catch(e) {
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} req_date - must be in the format 'YYYY-MM-DD'
 * @returns dataloggers deployed at the req_date
 */
const getDataloggersPerReqDate = async (req_date) => {
    try {
        let q = 'select dl_id, c_id, dl_ID_number, req_date, c_name \
        from Datalogger inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        inner join Requests on Study.s_id = Requests.study \
        inner join Clients on Requests.clients = Clients.c_id \
        where req_date = ? \
        order by c_id;';
        return await runQuery(q, [req_date]);
    }
    catch(e) {
        console.error(e);
    }
}

// studies per reporter by reporter name 
/**
 * @author Fabiola Badillo Ramos
 * @param {String} employeeId 
 * @returns all the studies associated to the reporter
 */
const getStudiesPerReporter = async (employeeId) => {
    try {
        let q = 'select r_id, r_first_name, r_last_name, r_employee_id, r_can_validate, s_id, s_cleanroom, s_start_date \
        from Reporter inner join Validates on Reporter.r_id = Validates.reporter  \
        inner join Study on Validates.study = Study.s_id \
        where r_employee_id = ? \
        order by r_id;';
        return await runQuery(q, [employeeId]);
    }
    catch(e){
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate - must be in the format 'YYYY-MM-DD'
 * @returns the zone to datalogger mapping information for the specified study
 */
const getDataloggerToZoneForCleanroom = async (clientName, cleanroomName, reqDate) => {
    try{
        console.log(`${cleanroomName} ${clientName} ${reqDate}`)
        //reqDate = new Date(reqDate)
        const studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;
        console.log(studyPK)
        let q = 'select dl_ID_number, zone_number, s_cleanroom, s_id, dl_id \
        from Datalogger inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? ;'
        let r =  await runQuery(q, [studyPK]);
        console.log(r)
        return r
    }
    catch(e){
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} dl_name - must be composed of only numerical values
 * @returns all the readings that have been gathered with the specific datalogger
 * it may contain readings from multiple studies
 */
const getReadingsPerDatalogger = async (dl_name) => {
    try {
        let q = 'select r_id, dl_ID_number, r_temp, r_rh, r_ts \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        where dl_ID_number = ? \
        order by dl_id;';
        return await runQuery(q, [dl_name]);
    }
    catch(e) {
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} employeeId 
 * @returns all the calibration sessions associated with the specified reporter
 */
const getCalibrationSessPerReporter = async (employeeId) => {
    try {
        let q = 'select r_id, cal_id, r_first_name, r_last_name, r_employee_id, r_can_calibrate, nist_manufacturer, nom_med_temp, nom_med_rh \
        from Reporter inner join Works_On on Reporter.r_id = Works_On.rep \
        inner join Calibration_Sess on Works_On.cal = Calibration_Sess.cal_id \
        where r_employee_id = ?;';
        return await runQuery(q, [employeeId]);
    }
    catch(e) {
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} dl_name - it must only contain numerical values
 * @returns the calibration session with which the specified datalogger was calibrated
 */
const getCalibrationSessPerDatalogger = async (dl_name) => {
    try {
        let q = 'select cal_id, dl_ID_number, cal_date, nom_med_temp, nom_med_rh, dl_id, dl_serial_number \
        from Calibration_Sess inner join Calibrates on Calibration_Sess.cal_id = Calibrates.cal_sess \
        inner join Datalogger on Calibrates.dl = Datalogger.dl_id \
        where dl_ID_number = ? \
        order by cal_id;';
        return await runQuery(q, [dl_name]);
    }
    catch(e){
        console.error(e);
    }
}

const getStudiesByReporterComplete = async (employeeId) => {
    try{
        // console.log('DESDE EL DAO')
        // console.log(employeeId)
        let getQ = `select s_id, c_name, s_cleanroom, req_date, s_status, r_first_name, r_last_name, s_duration_hours, s_max_temp, s_min_temp, s_max_rh, \
        s_min_rh, s_dl_quantity, s_sampling_frequency, s_start_date \
        from Clients inner join Requests on Clients.c_id=Requests.clients\
        inner join Study on Requests.study=Study.s_id\
        inner join Validates on Study.s_id=Validates.study\
        inner join Reporter on Validates.reporter=Reporter.r_id\
        where r_employee_id=?;`
        let studies = await runQuery(getQ , [employeeId])
        return studies
    }catch(e){
        console.error(e);
        return err
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {String} employeeId 
 * @returns all the studies that have been approved by the specified approver
 */
const getStudyByApprover = async (employeeId) => {
    try {
        let q = 'select a_id, a_first_name, a_last_name, a_employee_id, s_id, c_name, req_date, s_cleanroom \
        from Approver inner join Approves on Approver.a_id=Approves.approver \
        inner join Study on Approves.study=Study.s_id \
        inner join Requests on Study.s_id=Requests.study \
        inner join Clients on Requests.clients=Clients.c_id \
        where a_employee_id = ?;';
        return await runQuery(q, [employeeId]);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {String} cName 
 * @returns all the information on the specified client 
 */
const getClientByName = async (cName) => {
    try {
        let q = 'select * from Clients where c_name = ?;'
        return await runQuery(q, [cName]);
    }
    catch(e){
        console.error(e);
    }
}

const getAllClients = async () => {
    try{
        let q = 'select * from Clients'
        let clients = await runQuery(q , [])
        return clients
    }catch(e){
        console.error(e)
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {String} reporterFname 
 * @param {String} reporterLname 
 * @returns the information on the specified reporter
 * it may be the case that two reporters have the same name
 * getReporterByEmployeeId must be used instead
 */
const getReporterByName = async (reporterFname, reporterLname) => {
    try {
        let q = 'select * from Reporter where r_first_name = ? and r_last_name =?;';
        return await runQuery(q, [reporterFname, reporterLname]);
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {String} employeeId 
 * @returns the information on the specified employee
 */
const getReporterByEmployeeId = async (employeeId) => {
    try {
        let q = 'select * from Reporter where r_employee_id = ?;';
        return await runQuery(q, [employeeId]);
    }
    catch(e){
        console.error(e);
    }
};

/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate - must be in the format 'YYYY-MM-DD'
 * @returns information on the study identified by client, cleanroom and request date
 */
const getStudyByClientCleanroomReqDate = async (clientName, cleanroomName, reqDate) => {
    try {
        //console.log(reqDate)
        let q = 'select * from Study inner join Requests on Study.s_id = Requests.study \
        inner join Clients on Requests.clients = Clients.c_id \
        where c_name = ? and req_date = ? and s_cleanroom = ?;';
        return await runQuery(q, [clientName, reqDate, cleanroomName]);
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {String} dlName 
 * @returns information on the specified datalogger
 * datalogger names must be unique
 */
const getDlByName = async (dlName) => {
    try {
        let q = 'select * from Datalogger where dl_ID_number = ?;';
        return await runQuery(q, [dlName]);
    }
    catch(e){
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} nom_low_temp_ts - must be in the format 'YYYY-MM-DD HH:MM'
 * @returns information on the calibration session identified by the timestamp of the low temperature nominal reading
 */
const getCalibrationSessPerDate = async (nom_low_temp_ts) => {
    try {
        let q = 'select * \
        from Calibration_Sess \
        where nom_low_temp_ts = ?;'; 
        return await runQuery(q, [nom_low_temp_ts]);
    }
    catch(e){
        console.error(e);
    }
}


/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate 
 * @returns all the readings associated to a study
 */
const getReadingsPerStudy = async (clientName, cleanroomName, reqDate) => {
    try {
        let q = 'select r_id, c_name, s_cleanroom, req_date, r_ts, r_temp, r_rh, s_id, \
        s_start_date, s_duration_hours, s_max_temp, s_min_temp, s_max_rh, s_min_rh, \
        s_dl_quantity, s_sampling_frequency, c_id \
        from Readings inner join Study on Readings.study = Study.s_id \
        inner join Requests on Study.s_id = Requests.study \
        inner join Clients on Requests.clients = Clients.c_id \
        where c_name = ? and s_cleanroom = ? and req_date = ?;';
        return await runQuery(q, [clientName, cleanroomName, reqDate]);
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate 
 * @returns the alarm limits for the specified study
 */
const getRangesForStudy = async (clientName, cleanroomName, reqDate) => {
    try {
        let q = 'select s_max_temp, s_min_temp, s_max_rh, s_min_rh \
        from Study inner join Requests on Study.s_id = Requests.study \
        inner join Clients on Requests.clients = Clients.c_id \
        where c_name = ? and s_cleanroom = ? and req_date = ?;';
        return await runQuery(q, [clientName, cleanroomName, new Date(reqDate)]);
    }
    catch(e){
        console.error(e);
    }
};

/**
 * @author Fabiola Badillo Ramos
 * @returns information on all the studies stored in the system
 */
const getAllStudies = async () => {
    try{
        let q = 'select s_id, c_name, s_cleanroom, req_date, s_status, r_first_name, r_last_name, s_duration_hours, s_max_temp, s_min_temp, s_max_rh,  \
        s_min_rh, s_dl_quantity, s_sampling_frequency, s_start_date \
        from Clients inner join Requests on Clients.c_id = Requests.clients \
        inner join Study on Requests.study = Study.s_id \
        inner join Validates on Study.s_id = Validates.study \
        inner join Reporter on Validates.reporter = Reporter.r_id \
        order by c_name;'

        
        return await runQuery(q);
    }
    catch(e){
        console.error(e);
    }
};

/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate 
 * @returns the UNIX timestamp for the last valid reading for the study
 * readings with timestamp greater than the returned by this function are not part of the study
 */
const getTsOfLastValidReading = async (clientName, cleanroomName, reqDate) => {
    // get study information 
    let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
    // get study duration 
    let studyDuration = studyRes[0].s_duration_hours;
    // change study duration from hours to seconds
    let studyDurationSeconds = studyDuration * 3600;
    // get start time of study
    let studyStartTime = studyRes[0].s_start_date;
    // convert start time to unix timestamp
    let datum = (Date.parse(studyStartTime))/1000;
    // add start time and study duration to get the timestamp of the last reading 
    return datum + studyDurationSeconds;
};

/**
 * 
 * @param {String} clientName 
 * @param {String} cleanroomname 
 * @param {Date} reqDate 
 * @returns list of zones with readings out of range
 */
const getZonesWithReadingsOutOfRange = async (clientName, cleanroomName, reqDate) => {
    try {
        /// reqDate = new Date(reqDate);
        //console.log(reqDate)
        let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let zonesQuery = 'select distinct zone_number from \
        Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study=Study.s_id \
        inner join Requests on Study.s_id=Requests.study \
        inner join Clients on Requests.clients=Clients.c_id \
        where s_id=? \
        and  (r_temp > s_max_temp or r_temp < s_min_temp or r_rh > s_max_rh or r_rh < s_min_rh);';

        let zonesQueryWithOffset = 'select distinct zone_number from \
        Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study=Study.s_id \
        inner join Requests on Study.s_id=Requests.study \
        inner join Clients on Requests.clients=Clients.c_id \
        where s_id=? \
        and  (ROUND((r_temp+dl_offset),1) > s_max_temp or \
        ROUND((r_temp+dl_offset),1) < s_min_temp or \
        ROUND((r_rh+dl_offset),1) > s_max_rh or ROUND((r_rh+dl_offset),1) < s_min_rh);';
        return await runQuery(zonesQuery, [studyPK]);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {Date} reqDate - format 'YYYY-MM-DD'
 * @param {number} zoneNumber 
 * @returns 
 */
const getZoneReadings = async (clientName, cleanroomName, reqDate, zoneNumber) => {
    try {
        //reqDate = new Date(reqDate);
        let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let findDlPkQuery = 'select * from Participates where zone_number = ? and study=?;'
        let dlRes = await runQuery(findDlPkQuery, [zoneNumber, studyPK]);
        let dlPK = dlRes[0].dl;

        let readingsQuery = 'select r_ts, r_temp, r_rh from Readings where study=? and dl=?;'
        return await runQuery(readingsQuery, [studyPK, dlPK]);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * @author Fabiola Badillo Ramos
 * @param {String} employeeId 
 * @returns the account status for the reporter
 * it will be either pending|granted|denied
 */
const getReporterAccountStatus = async (employeeId) => {
    try{
        // get reporter PK
        let reporterRes = await getReporterByEmployeeId(employeeId);
        let reporterPK = reporterRes[0].r_id;

        let reporterAccountStatusQuery = 'select r_account_status from Reporter where r_id=?;';
        return await runQuery(reporterAccountStatusQuery, [reporterPK]);
    }
    catch(e){
        console.error(e);
    }
};

/**
 * @author Fabiola Badillo Ramos
 * @param {String} clientName 
 * @returns the account status for the client
 * it will be either pending|granted|denied
 */
const getClientAccountStatus = async (clientName) => {
    try {
        let clientRes = await getClientByName(clientName);
        let clientPK = clientRes[0].c_id;

        
        let clientAccountStatusQuery = 'select c_account_status from Clients where c_id=?;';
        return await runQuery(clientAccountStatusQuery, [clientPK]);
    }
    catch(e){
        console.error(e);
    }
}


const getApproverByEmployeeId = async (employeeId) => {
    try{
        let getApproverQuery = 'select * from Approver where a_employee_id=?';
        return await runQuery(getApproverQuery, [employeeId]);
    }
    catch(e){
        console.error(e);
    }
};

/**
 * 
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {Date} reqDate 
 * @returns a list with all the zones in the study
 */
const getStudyZones = async (clientName, cleanroomName, reqDate) => {
    try {
        // reqDate = new Date(reqDate);
        let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let studyZonesQuery = 'select distinct zone_number \
        from Study inner join Participates on Study.s_id=Participates.study \
        where s_id=?;'
        return await runQuery(studyZonesQuery, [studyPK])
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate 
 * @returns number of zones in the study
 */
const getNumberOfZonesInStudy = async (clientName, cleanroomName, reqDate) => {
    try{
        // reqDate = new Date(reqDate);
        let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let numberOfZonesQuery = 'select count(distinct zone_number) as number_of_zones \
        from Study inner join Participates on Study.s_id=Participates.study \
        where s_id=?;'
        return await runQuery(numberOfZonesQuery, [studyPK])
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @returns study object for approver page
 */
const getStudyForApproverPage = async () => {
    try{
        let getStudiesQuery = 'select s_id, s_cleanroom, c_name, s_status, r_first_name, r_last_name, req_date \
        from Clients inner join Requests on Clients.c_id=Requests.clients \
        inner join Study on Requests.study=Study.s_id \
        inner join Validates on Study.s_id=Validates.study \
        inner join Reporter on Validates.reporter=Reporter.r_id;';
        return await runQuery(getStudiesQuery);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @returns all reporters in the system
 */
const getAllReporters = async () => {
    try{
        let getReporterQuery = 'select * from Reporter;';
        return await runQuery(getReporterQuery);
    }
    catch(e){
        console.error(e);
    }
}

const getAllClientsForApprover = async () => {
    try{
        // let allClientsQuery = 'select distinct c_name, c_id, email_address, c_account_status, phone_num \
        // from Email inner join Clients on Email.clients=Clients.c_id \
        // inner join Phone on Clients.c_id=Phone.clients;'
        let allClientsQuery = 'select distinct c_name, c_id, email_address, c_account_status \
        from Email inner join Clients on Email.clients=Clients.c_id ;'
        return await runQuery(allClientsQuery);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {Number} id 
 * @returns the study information
 */
const getStudyById = async (id) => {
    try{
        let studyQuery = 'select c_name, s_cleanroom, req_date, s_status, r_first_name, r_last_name, s_duration_hours, s_max_temp, s_min_temp, s_max_rh,  \
        s_min_rh, s_dl_quantity, s_sampling_frequency, s_start_date \
        from Clients inner join Requests on Clients.c_id = Requests.clients \
        inner join Study on Requests.study = Study.s_id \
        inner join Validates on Study.s_id = Validates.study \
        inner join Reporter on Validates.reporter = Reporter.r_id \
        where s_id=?;';
        
        return await runQuery(studyQuery, [id]);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {DataloggerProfile} dlObj 
 * @returns the offset for the datalogger
 */
const getDlOffset = async (dlObj) => {
    try{
        let dlName = dlObj.dlName;

        let offsetQuery = 'select dl_offset from Datalogger where dl_ID_number=?;'

        return await runQuery(offsetQuery, [dlName]);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {String} dlName 
 * @returns the PK for the DL
 */
const getDlPkByName = async (dlName) => {
    try{
        let dlPkQuery = 'select dl_id from Datalogger where dl_ID_number=?;';
        let res = await runQuery(dlPkQuery, [dlName]);
        return res[0].dl_id;
    }
    catch(e){
        console.error(e);
    }
}

/**
 * 
 * @param {String} clientName 
 * @param {String} cleanroomName 
 * @param {String} reqDate 
 * @returns 
 */
const getDlsWithReadingsInStudy = async (clientName, cleanroomName, reqDate) => {
    try {
        if (typeof reqDate != 'object'){
            reqDate = new Date(reqDate);
        }
        let studyRes = await getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        let dlsWithReadingsQuery = 'select distinct dl from Readings where study = ?;';
        return await runQuery(dlsWithReadingsQuery, [studyPK]);
    }
    catch(e){
        console.error(e);
    }
}

const getInfoForCalibrationReport = async (dlName) => {
    console.log(dlName)
    try{
        let calRepInfoQuery = 'select dl_id, dl_ID_number, dl_offset, dl_in_tolerance, cal_date, dl_r_low_temp, dl_r_med_temp, dl_r_high_temp,\
        dl_r_low_rh, dl_r_med_rh, dl_r_high_rh, nist_manufacturer, nist_number, nist_model, nist_serial_number, \
        nom_low_temp, nom_med_temp, nom_high_temp, nom_low_rh, nom_med_rh, nom_high_rh\
        from Datalogger inner join Calibrates on Datalogger.dl_id=Calibrates.dl\
        inner join Calibration_Sess on Calibrates.cal_sess=Calibration_Sess.cal_id where dl_ID_number=?;';
        let r =  await runQuery(calRepInfoQuery, [dlName]);
        console.log(r)
        return r
    }
    catch(e){
        console.error(e);
    }
}

// ------------------------------------------------------------------------------------------------------------------------
// testing

let study = {
    studyId: 0,
    clientName: 'J&J',
    requestDate: '2021-03-03',
    description: 'desc',
    datalogersQty: 4,
    dataloggers: [],
    cleanroomName: 'CR3'
};

let dlProf =  {
    dlName :'166',
    dlSerialNumber:'',
    dlOffset :''}

 let date = new Date(2021, 0, 1);

// const test1 = async () => {
//     const res = await getDlsWithReadingsInStudy('Medtronic', 'CR1', new Date(2021, 0, 1));
//     console.log(res);
// }
// test1();


// const main = async ()=>{
//     const res = await getInfoForCalibrationReport('166');
//     console.log(res)
//     // or do whathever else con el
// }
// main();

module.exports = {
    getCalibrationSessPerDatalogger,//cal
    getCalibrationSessPerReporter,//cal
    getReadingsPerDatalogger,//not DL 
    getDataloggerToZoneForCleanroom,// study
    getStudiesPerReporter,//study
    getDataloggersPerReqDate,//idk
    getDataloggersPerClient,// client
    getDataloggersPerStudy, //study 
    getStudiesPerClient,//study
    getStudyByApprover,//appover 
    getClientByName,//client 
    getReporterByName,//reporter 
    getStudyByClientCleanroomReqDate, // idk
    getDlByName, //dl 
    getCalibrationSessPerDate, //cal
    getReadingsPerStudy,// study 
    getRangesForStudy, // study  
    getAllStudies, // study 
    getReporterByEmployeeId, // reporter
    getTsOfLastValidReading, // study 
    getAllCalSess,
    getZoneReadings,
    getZonesWithReadingsOutOfRange,
    getReporterAccountStatus,
    getAllClients,
    getClientAccountStatus,
    getApproverByEmployeeId,
    getAllDataloggers,
    getStudyZones,
    getNumberOfZonesInStudy,
    getStudyForApproverPage,
    getAllReporters,
    getAllClientsForApprover,
    getStudyById,
    getDlOffset,
    getDlPkByName,
    getDlsWithReadingsInStudy,
    getStudiesByReporterComplete,
    getInfoForCalibrationReport
}