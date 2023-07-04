// // Development environment
// const {runQuery} = require('../database');

// Testing environment
const { report } = require('../app');
const {runQuery} = require('../testing/DaoTesting/databaseTestingInstance');

const reads = require('./reads');

/**
 * @author Fabiola Badillo Ramos
 * insert new distinct client into the database
 * @param {Client} clientObj 
 */
const insertClient = async (clientObj) => {
    try {
        // destructing object
        let clientName = clientObj.clientName;
        let emailAddress = clientObj.email;
        let phoneNumber = clientObj.telephone;
        // query for inserting clients into the DB
        let insertClientNameQuery = 'insert into Clients (c_name, c_account_status) \
                values (?,?);';
        const rows = await runQuery(insertClientNameQuery, [clientName, 0]);
        // primary key of the inserted record
        const clientId = rows.insertId;
        // insert client email
        let insertEmailQuery = 'insert into Email (email_address, clients) \
                values (?,?);';
        await runQuery(insertEmailQuery, [emailAddress, clientId]);
        // insert client phone number 
        let insertClientPhoneQuery = 'insert into Phone  (phone_num, clients) \
                values (?,?);'; 
        await runQuery(insertClientPhoneQuery, [phoneNumber, clientId]);
        
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
    
}


/**
 * @author Fabiola Badillo Ramos
 * insert a new approver into the system 
 * @param {Approver} approverObj 
 */
const insertApprover = async (approverObj) => {
    try {
        console.log('HOLA DESDE DAO')
        let approverFname = approverObj.approverFname;
        let approverLname = approverObj.approverLname;
        let employeeId = approverObj.approverEmployeeId;
        let insertApprover = 'insert into Approver (a_first_name, a_last_name, a_employee_id) \
                values (?,?,?);';
        await runQuery(insertApprover, [approverFname, approverLname, employeeId]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}


/**
 * @author Fabiola Badillo Ramos
 * inserts a new reporter into the database
 * the role of the reporter must be either 'calibrate' or 'validate'
 * @param {Reporter} reporterObj 
 */
const insertReporter = async (reporterObj) => {
    try {
        // destructing object 
        let reporterFname = reporterObj.fname;
        let reporterLname = reporterObj.lname;
        let employeeId = reporterObj.employeeId;
        let role = reporterObj.role;
        // checking for reporter role
        let validate, calibrate;
        if (role === 'validate'){
            validate = 1;
            calibrate = 0;
        } else { // if anything else is passed as role it will be registered as calibrator
            validate = 0;
            calibrate = 1;
        }
        // insert reporter query
        let insertReporter = 'insert into Reporter (r_first_name, r_last_name, r_employee_id, r_can_validate, r_can_calibrate, r_account_status) \
                values (?, ?, ?, ?, ?, ?);';
        await runQuery(insertReporter, [reporterFname, reporterLname, employeeId, validate, calibrate, 0]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
}


 /**
 * @author Fabiola Badillo Ramos 
 * the function inserts a new study into the system if the study does not exist already
 * @param {Reporeter} reporterObj
 * @param {Study} studyObj it shall contain the essential information for creating a project
 * 
 */
const insertNewStudy = async (reporterObj, studyObj) => {
    try {
        // deconstruct reporter object
        let reporterEmployeeId = reporterObj.employeeId;
        
        // get info from reporter by employee id
        const reporterRes = await reads.getReporterByEmployeeId(reporterEmployeeId);
        let reporterPK = reporterRes[0].r_id;
        let reporterRole = reporterRes[0].r_can_validate;

        // check if reporter role is validate
        if (reporterRole != 1) throw console.error('The reporter does not have the necessary permissions to perform a validation');

        // deconstruct study object
        let clientName = studyObj.clientName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);
        let cleanroom = studyObj.cleanroomName;
        let numDataloggers = studyObj.dataloggersQty;

        // get PK for client 
        const clientRes = await reads.getClientByName(clientName);
        let clientPK = clientRes[0].c_id;
        
        // query to insert new study into db 
        let insertNewStudyQuery = 'insert into Study (s_dl_quantity,  s_cleanroom, s_status, s_is_approved) \
            values (?, ?, ?, ?);';

        // status and is_approved initialized to default values (0 for both)
        const studyRes = await runQuery(insertNewStudyQuery, [numDataloggers, cleanroom, 0, 0]);
        let studyPK = studyRes.insertId;
        
        // associate study to client and request date
        let clientRequestsStudyQuery = 'insert into Requests (req_date, clients, study) \
            values (?, ?, ?);';
        await runQuery(clientRequestsStudyQuery, [reqDate, clientPK, studyPK]);
        
        // associate reporter to study through validates
        let validateQuery = 'insert into Validates (reporter, study) values (?, ?);';
        await runQuery(validateQuery, [reporterPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false
    }
    
}

/**
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns the difference in hours between the two dates
 */
function getDifferenceInHours(date1, date2) {
    date1 = new Date(Date.parse(date1))
    date2 = new Date(Date.parse(date2))
    const diffInMs = Math.abs(date2 - date1);
    res =  diffInMs / (1000 * 60 * 60);
    return res.toFixed(1);
}


 /**
 * @author Fabiola Badillo Ramos 
 * the function inserts a new study into the system if the study does not exist already
 * @param {Reporeter} reporterObj
 * @param {Study} studyObj it shall contain the essential information for creating a project
 * 
 */
  const insertCompleteNewStudy = async (reporterObj, studyObj) => {
    try {
        // deconstruct reporter object
        let reporterEmployeeId = reporterObj.employeeId;
        
        // get info from reporter by employee id
        const reporterRes = await reads.getReporterByEmployeeId(reporterEmployeeId);
        let reporterPK = reporterRes[0].r_id;
        let reporterRole = reporterRes[0].r_can_validate;

        // check if reporter role is validate
        if (reporterRole != 1) throw console.error('The reporter does not have the necessary permissions to perform a validation');

        // deconstruct study object
        let clientName = studyObj.clientName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);
        let cleanroom = studyObj.cleanroomName;
        let numDataloggers = studyObj.dataloggersQty;
        let highTempAlarm = studyObj.maxTemp;
        let lowTempAlarm = studyObj.minTemp;
        let highRhAlarm = studyObj.maxRH;
        let lowRhAlarm = studyObj.minRH;
        let startDate = studyObj.startDate;
        let endDate = studyObj.endDate; // para calcular duration
        let samplingFreq = (studyObj.samplingFrequency)*60;
        let studyDuration = getDifferenceInHours(startDate, endDate);
        // get PK for client 
        const clientRes = await reads.getClientByName(clientName);
        let clientPK = clientRes[0].c_id;
        
        // query to insert new study into db 
        let insertNewStudyQuery = 'INSERT INTO Study (s_start_date, s_duration_hours, s_max_temp, s_min_temp, \
            s_max_rh, s_min_rh, s_dl_quantity, s_sampling_frequency, s_cleanroom, s_status, s_is_approved) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0);';

        // status and is_approved initialized to default values (0 for both)
        let queryParams = [
            startDate,
            studyDuration,
            highTempAlarm,
            lowTempAlarm,
            highRhAlarm,
            lowRhAlarm,
            numDataloggers,
            samplingFreq,
            cleanroom
        ]
        const studyRes = await runQuery(insertNewStudyQuery, queryParams);
        let studyPK = studyRes.insertId;
        
        // associate study to client and request date
        let clientRequestsStudyQuery = 'insert into Requests (req_date, clients, study) \
            values (?, ?, ?);';
        await runQuery(clientRequestsStudyQuery, [reqDate, clientPK, studyPK]);
        
        // associate reporter to study through validates
        let validateQuery = 'insert into Validates (reporter, study) values (?, ?);';
        await runQuery(validateQuery, [reporterPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false
    }
    
}


/**
* @author Fabiola Badillo Ramos 
* adds parameter info to existing project
 * @param {Study} studyObj 
 * @param {DataloggerParams} dlParamsObj 
 */
const addProgramDataloggerParams = async (studyObj, dlParamsObj) => {
    try {
        // look for study PK by cleanroom name, client name and req date
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate
        reqDate = new Date(reqDate).toISOString().slice(0,10);
        let clientName = studyObj.clientName;
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // add monitoring parameters for the record with study PK 
        const dataloggerParamsQuery = 'update Study \
        set \
            s_start_date = ?, \
            s_duration_hours = ?, \
            s_max_temp = ?, \
            s_min_temp = ?, \
            s_max_rh = ?, \
            s_min_rh = ?, \
            s_sampling_frequency = ? \
            where s_id = ?;';
        let startTime = dlParamsObj.startTime;
        let studyDuration = dlParamsObj.studyDuration;
        let maxTemp = dlParamsObj.maxTemp;
        let minTemp = dlParamsObj.minTemp;
        let maxRH = dlParamsObj.maxRH;
        let minRH = dlParamsObj.minRH;
        let samplingFreq = dlParamsObj.samplingFrequency;
        let vals = [startTime, studyDuration, maxTemp, minTemp, maxRH, minRH, samplingFreq, studyPK];
        await runQuery(dataloggerParamsQuery, vals);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
    

};


/**
 * @author Fabiola Badillo Ramos
 * creates a new DL profile and stores it into the DB
 * must have valid values for dlName and dlSerialNumber
 * @param {DataloggerProfile} dlProfileObj 
 */
const insertNewDatalogger = async (dlProfileObj) => {
    console.log(dlProfileObj)
    try {
        let dlName = dlProfileObj.dlName;
        let serialNumber = dlProfileObj.dlSerialNumber;
    
        let insertNewDlQuery = 'insert into Datalogger (dl_ID_number, dl_serial_number, dl_offset, dl_in_tolerance) \
        values (?, ?, 0, 1);';
        await runQuery(insertNewDlQuery, [dlName, serialNumber]);
        return true
    }
    catch(e){
        console.error(e);
        return false
    }
};


/**
 * @author Fabiola Badillo Ramos
 * associates a datalogger to a study
 * the study object must have valid values for client name, cleanroom name and request date
 * the dl profile object must have valid values for datalogger name 
 * @param {Study} studyObj 
 * @param {DataloggerProfile} dlProfObj 
 */
const insertDataloggerToStudy = async (studyObj, dlProfObj) => {
    
    try{
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;
        let dlName = dlProfObj.dlName;
        console.log(reqDate)
        if (typeof reqDate == 'object'){
            reqDate = reqDate.toISOString().slice(0,10);
        }
        console.log(reqDate)
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;
    
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;
    
        // insert record into Participates
        let participatesQuery = 'insert into Participates (dl, study) \
        values (?,?);'
        await runQuery(participatesQuery, [dlPK, studyPK,]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};



/**
 * @author Fabiola Badillo Ramos
 * adds reading gathered with specific datalogger to study 
 * @param {Reading} readingObj 
 * @param {DataloggerProfile} dlProfObj 
 * @param {Study} studyObj 
 * @deprecated
 */
const insertReadingsToValidationStudy = async (readingObj, dlProfObj, studyObj) => {
    try {
        let temp = readingObj.temp;
        let rh = readingObj.rh;
        let timestamp = readingObj.timestamp;
        let dlName = dlProfObj.dlName;
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // get primary key for DL with name = dlName
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;
        // let dlPK = 1;

        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = 1//studyRes[0].s_id;

        let insertReadingsQuery = 'INSERT INTO Readings (r_ts, r_temp, r_rh, dl, study) \
        VALUES (?, ?, ?, ?, ?);';
        await runQuery(insertReadingsQuery, [timestamp, temp, rh, dlPK, studyPK]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * adds reading gathered with specific datalogger to study 
 * @param {Reading[]} readingObj list  
 * @param {DataloggerProfile} dlProfObj 
 * @param {Study} studyObj 
 */
 const insertMultipleReadingsToValidationStudy = async (readingObjList, dlProfObj, studyObj) => {
    try { 
        let dlName = dlProfObj.dlName;
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = 0;
        
        if (typeof reqDate == 'object'){
            reqDate = studyObj.requestDate
        }
        else{
            reqDate = new Date(studyObj.requestDate);
        }
        // get primary key for DL with name = dlName
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);

        let studyPK = studyRes[0].s_id;

        // get list of DLs with readings in study 
        // if current DL already inserted nothing happens
        let dlsWithReadings = await reads.getDlsWithReadingsInStudy(clientName, cleanroomName, reqDate);
        let isDuplicate = false;
        for (let i = 0; i<dlsWithReadings.length; i++){ 
            if (dlPK == dlsWithReadings[i].dl) {
                isDuplicate=true;
                return;
            }
        }

        if (!isDuplicate){
            let queryParams = [];
        
            let dlOffset = await reads.getDlOffset(dlProfObj);
            dlOffset = dlOffset[0].dl_offset;

            const insertValues = (timestamp, temp, rh, dlPK, studyPK) =>{
                timestamp = new Date(timestamp * 1000);
                temp = (temp + dlOffset).toFixed(1);
                rh = (rh + dlOffset).toFixed(1);
                
                let q =  "('" + timestamp.toISOString().replace("T"," ").slice(0,16) + "'," + temp + "," + rh + "," + dlPK + "," + studyPK + ")";
                return q
            };

            let insertReadingsQuery = 'INSERT INTO Readings (r_ts, r_temp, r_rh, dl, study) \
            VALUES ';


            for (let i = 0; i<readingObjList.length ; i++){
                let temp = readingObjList[i].temp;
                let rh = readingObjList[i].rh;
                let timestamp = readingObjList[i].ts;
                queryParams.push(insertValues(timestamp, temp, rh, dlPK, studyPK));
            }
            insertReadingsQuery += queryParams.join(',');


            await runQuery(insertReadingsQuery);
            let dlQtyInStudy = studyRes[0].s_dl_quantity;
            let dlWithReadings = await runQuery('select count(distinct dl) as noDls from Readings inner join Study on Readings.study=Study.s_id where study=?;', [studyPK])
            
            dlQtyInStudy = dlWithReadings[0].noDls;
            console.log('number of DLS')
            console.log(dlWithReadings)
            console.log(dlWithReadings[0].noDls)
            if (dlWithReadings[0].noDls == 1){
                console.log('hello pq no entro aqui?')
                await runQuery('update Study set s_status = ? where s_id = ?;' ,[2,studyPK])
            }
            else if (dlQtyInStudy == dlWithReadings[0].noDls){
                await runQuery('update Study set s_status = ? where s_id = ?;' ,[3, studyPK])
            }

            return true;
        }
        return false;
    
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * creates a new calibration session and stores it into the DB
 * @param {CalibrationSess} calSessObj 
 */
const insertNewCalibrationSess = async (calSessObj) => {
    try {
        let manufacturer = calSessObj.nistManuf;
        let nistNumber = calSessObj.nistNumber;
        let nistModel = calSessObj.nistModel;
        let nistSerNum = calSessObj.nistSerNum;
        let lowTemp = calSessObj.lowTemp;
        let lowTempTs = calSessObj.lowTempTs;
        let medTemp = calSessObj.medTemp;
        let medTempTs = calSessObj.medTempTs;
        let highTemp = calSessObj.highTemp;
        let highTempTs = calSessObj.highTempTs;
        let lowRh = calSessObj.lowRh;
        let lowRhTs = calSessObj.lowRhTs;
        let medRh = calSessObj.medRh;
        let medRhTs = calSessObj.medRhTs;
        let highRh = calSessObj.highRh;
        let highRhTs = calSessObj.highRhTs;
    
        let calibrationSessQuery = 'insert into Calibration_Sess (nist_manufacturer, nist_number, nist_model, \
            nist_serial_number, nom_low_temp, \
            nom_med_temp, nom_high_temp, nom_low_rh,  \
            nom_med_rh, nom_high_rh, nom_low_temp_ts, \
            nom_med_temp_ts, nom_high_temp_ts, \
            nom_low_rh_ts, nom_med_rh_ts, nom_high_rh_ts) \
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let vals = [manufacturer, nistNumber, nistModel, nistSerNum, lowTemp, medTemp, highTemp, lowRh, medRh, highRh, lowTempTs, medTempTs, highTempTs, lowRhTs, medRhTs, highRhTs];
        await runQuery(calibrationSessQuery, vals);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};


/**
 * @author Fabiola Badillo Ramos
 * assign datalogger to its adequate calibration session based on the timestamp for the low temp measurement
 * @param {CalibrationSess} calSessObj 
 * @param {DataloggerProfile} dlProfileObj 
 * @param {Date} calDate -> the format must be 'YYYY-MM-DD'
 * @param dlLowTemp
 * @param dlMedTemp
 * @param dlHighTemp
 * @param dlLowRh
 * @param dlLowRh
 * @param dlLowRh
 */
const insertDataloggerToCalSess = async (calSessObj, dlProfileObj, calDate, dlLowTem, dlMedTemp, dlHighTemp, dlLowRh, dlMedRh, dlHighRh) => {
    try{
        console.log("HOLA CABRONES")
        let lowTempTs = calSessObj.lowTempTs;
        let dlName = dlProfileObj.dlName;
        
        // get PK from calibration session
        const calSessRes = await reads.getCalibrationSessPerDate(lowTempTs);
        let calSessPK = calSessRes[0].cal_id;
    
        // get PK from Datalogger name
        const dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;
    
        // add relationship to calibrates table
        let dlCalQuery = 'insert into Calibrates (cal_sess, dl, cal_date, dl_r_low_temp, \
            dl_r_med_temp, dl_r_high_temp, dl_r_low_rh, dl_r_med_rh, dl_r_high_rh) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'

        await runQuery(dlCalQuery, [calSessPK, dlPK, calDate, dlLowTem, dlMedTemp, dlHighTemp, dlLowRh, dlMedRh, dlHighRh]);
        return true;
    }
    catch(e){
        console.error(e);
        return false;
    }
};

const insertApproverToStudy = async (approverObj, studyObj) => {
    try{
        // look for study PK by cleanroom name, client name and req date
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate.toISOString().slice(0,10);
        let clientName = studyObj.clientName;
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // get approver PK
        let empId = approverObj.approverEmployeeId;
        const approverRes = await reads.getApproverByEmployeeId(empId);
        let approverPK = approverRes[0].a_id;

        let insertApproverToStudyQuery = 'insert into Approves (approver, study) \
        values (?, ?);';
        await runQuery(insertApproverToStudyQuery, [approverPK,studyPK]);
        return true;
    }
    catch(e){
        console.error(e)
        return false;
    }
};

// ----- TEST -------

// let study = {
//     studyId: 0,
//     clientName: 'Prueba de Aggregates',
//     requestDate: '2021-03-31',
//     description: 'desc',
//     dataloggersQty: 4,
//     dataloggers: [],
//     cleanroomName: 'Cuarto limpio'
// };

// let reporter = {
//     employeeId: '234567',
//     fname: 'Enrique',
//     lname: 'Gonzalez',
//     role: 'calibrate'
// };

let reporter2 = {
    employeeId: '121252',
    fname: 'Tatiana',
    lname: 'Hernandez',
    role: 'validate'
};

// let client = {
//     clientName: 'The best client',
//     email: 'client@mail.com',
//     telephone: 'la telefona'
// }


let calSess = {
    nistManuf: '',
    nistNumber: '',
    nistModel: '',
    nistSerNum: '',
    lowTemp: '',
    lowTempTs: '2021-10-29 12:00:00',
    medTemp: '',
    medTempTs:'',
    highTemp:'',
    highTempTs:'',
    lowRh:'',
    lowRhTs:'',
    medRh:'',
    medRhTs:'',
    highRh:'',
    highRhTs:''
}

let dlProf =  {
    dlName :'20',
    dlSerialNumber:'',
    dlOffset :''}
    // insertClient(client);


// insertNewStudy(reporter2, study);

// insertDataloggerToCalSess(calSess,dlProf,'2021-09-01', 2, 23, 52, 23, 45, 56);



let reading = {
    temp: 300,
    rh: 300,
    ts: new Date(2021, 0, 1, 12, 0),
    zone: 19
}
let reading1 = {
    temp: 300,
    rh: 300,
    timestamp: new Date(2021, 0, 1, 12, 30),
    zone: 20
}
let reading2 = {
    temp: 300,
    rh: 300,
    timestamp: new Date(2021, 0, 1, 1, 0),
    zone: 21
}
let reading3 = {
    temp: 300,
    rh: 300,
    timestamp: new Date(2021, 0, 1, 1, 0),
    zone: 22
}


let readings = [];

for (let i = 0; i<1000; i++){
    readings.push(reading);
}


let client ={
    clientName: 'TestClient4',
    email: 'testclientmail4@mail.com',
    telephone: '787-554-5555'
};

// const test = async () =>{
//     let res = await insertClient(client)
//     console.log(res);
// }
// test()

let study = {
    cleanroomName:'CR2',
    clientName:'Abbott',
    dataloggersQty:20,
    maxRH:60,
    maxTemp:80,
    minRH:40,
    minTemp:70,
    requestDate:new Date(2021, 4, 4),
    samplingFrequency: 5,
    startDate: new Date(2021, 0, 3, 10),
    endDate: new Date(2021, 0, 4, 16)
}
let reporter ={
    fname:'Fabiola',
    lname:'Gonzalez',
    employeeId:'123456',
}
// insertDataloggerToStudy(study, dlProf);
// insertMultipleReadingsToValidationStudy(readings, dlProf, study)

// insertCompleteNewStudy(reporter, study);

//insertReadingsToValidationStudy2(readings, dlProf, study);

// insertReadingsToValidationStudy(reading,dlProf,study);
// insertReadingsToValidationStudy(reading1,dlProf,study);
// insertReadingsToValidationStudy(reading2,dlProf,study);
// insertReadingsToValidationStudy(reading3,dlProf,study);

module.exports = { insertClient, // client
    insertApprover, // approver
    insertReporter, // reporter 
    insertNewStudy, // study 
    addProgramDataloggerParams, //study 
    insertNewDatalogger , // dl
    insertDataloggerToStudy, // study
    insertNewCalibrationSess, // cal
    insertReadingsToValidationStudy, //study 
    insertDataloggerToCalSess, // cal,
    insertApproverToStudy,
    insertMultipleReadingsToValidationStudy,
    insertCompleteNewStudy,
    getDifferenceInHours
}