const {getCalibrationSessPerDatalogger,//cal
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
    getClientAccountStatus,
    getApproverByEmployeeId,
    getAllDataloggers,
    getStudyZones,
    getNumberOfZonesInStudy,
    getStudyForApproverPage,
    getAllReporters,
    getAllClientsForApprover,
    getStudyById,
    getDlOffset} = require('../../daos/reads');

const {miniTestingFramework} = require('../miniTestingFramework');
const {TestHelper} = require('../testHelperClass');
const inserts = require('../../daos/inserts');
const updates = require('../../daos/updates');

const {Client} = require('../../models/objects/Client');
const {Approver} = require('../../models/objects/Approver');
const {Reporter} = require('../../models/objects/Reporter');
const {Study} = require('../../models/objects/Study');
const {DataloggerParams} = require('../../models/objects/DataloggerParams');
const {DataloggerProfile} = require('../../models/objects/DataloggerProfile');
const {CalibrationSess} = require('../../models/objects/CalibrationSess');
const {Reading} = require('../../models/objects/Reading');

let client = new Client({
    clientName: 'TestClient1',
    email: 'testclientmail1@mail.com',
    telephone: '787-551-5555'
});
let client2 = new Client({
    clientName: 'TestClient2',
    email: 'testclientmail2@mail.com',
    telephone: '787-552-5555'
});
let approver = new Approver({
    approverFname: 'ApproverFName',
    approverLname : 'ApproverLName',
    approverEmployeeId: 'approverID'
});
let reporter = new Reporter({
    employeeId: 'EmpId',
    fname: 'ReporterFName',
    lname: 'ReporterLName',
    role: 'validate'
});
let reporter2 = new Reporter({
    employeeId: 'EmpId2',
    fname: 'ReporterFName2',
    lname: 'ReporterLName2',
    role: 'validate'
});
let reporter3 = new Reporter({
    employeeId: 'EmpId3',
    fname: 'ReporterFName3',
    lname: 'ReporterLName3',
    role: 'calibrate'
});
let study = new Study({
    id: 1,
    clientName: 'TestClient1',
    requestDate: new Date(2021, 2, 2),
    maxTemp: 80,
    minTemp: 60,
    maxRH: 60,
    minRH: 55,
    dataloggersQty: 10,
    isApproved: 0,
    cleanroomName : 'CLEANROOM',
    samplingFrequency : 900,
    reporter_first_name: reporter.fname,
    reporter_last_name: reporter.lname,
    status: 0,
    startDate: new Date(2021, 2, 3, 12)
});
let study2 = new Study({
    id: 2,
    clientName: 'TestClient2',
    requestDate: new Date(2023, 3, 3),
    maxTemp: 70,
    minTemp: 50,
    maxRH: 50,
    minRH: 40,
    dataloggersQty: 15,
    isApproved: 0,
    cleanroomName : 'CR2',
    samplingFrequency : 600,
    reporter_first_name: reporter.fname,
    reporter_last_name: reporter.lname,
    status: 0,
    startDate: new Date(2023, 3, 3, 20)
});
let dlParams = new DataloggerParams({
    startTime: new Date(2021, 2, 3, 12),
    maxTemp: 80,
    minTemp: 60,
    maxRH: 60,
    minRH : 55,
    studyDuration: 48,
    samplingFrequency: 900
});
let dlProf = new DataloggerProfile({
    dlName: '102',
    dlSerialNumber: 'serNum',
    dlOffset: 1.3
});
let dlProf2 = new DataloggerProfile({
    dlName: '30',
    dlSerialNumber: 'serNum1',
    dlOffset: 0.1
});
let calSessObj = new CalibrationSess({
    nistManuf: 'testManuf',
    nistNumber : 'testNistNum',
    nistModel: 'testNistModel',
    nistSerNum : 'testSerNum',
    lowTemp : 20,
    lowTempTs: new Date(2021, 0, 1, 12, 0),
    medTemp : 60,
    medTempTs: new Date(2021, 0, 1, 12, 0),
    highTemp : 80,
    highTempTs: new Date(2021, 0, 1, 12, 0),
    lowRh : 20, 
    lowRhTs: new Date(2021, 0, 1, 12, 0),
    medRh : 60, 
    medRhTs : new Date(2021, 0, 1, 12, 0),
    highRh : 80,
    highRhTs: new Date(2021, 0, 1, 12, 0),
});
let reading = new Reading({
    temp: 80,
    rh: 60,
    ts: 1619980495,
    zone: 10
});


const createReadingsList = () => {
    let readings = [];
    for(let i = 0; i < 300; i++){
        //console.log(reading)
        // if (i>290){
        //     reading.temp = reading.temp+15;
        // }
        readings.push(reading);
    }
    readings.push(new Reading({
        temp: 81,
        rh: 60,
        ts: 1619980495,
        zone: 10
    }))
    return readings;
}

const dummyDataInsertForTests = async () => {
    let readings = createReadingsList();
    await inserts.insertClient(client);
    await inserts.insertClient(client2);
    await inserts.insertApprover(approver);
    await inserts.insertReporter(reporter);
    await inserts.insertReporter(reporter2);
    await inserts.insertReporter(reporter3);
    await inserts.insertNewStudy(reporter, study);
    await inserts.insertNewStudy(reporter, study2);
    await inserts.addProgramDataloggerParams(study, dlParams);
    await inserts.insertNewDatalogger(dlProf);
    await inserts.insertNewDatalogger(dlProf2);
    await inserts.insertDataloggerToStudy(study, dlProf);
    await inserts.insertDataloggerToStudy(study, dlProf2);
    await inserts.insertNewCalibrationSess(calSessObj);
    await inserts.insertMultipleReadingsToValidationStudy(readings,dlProf, study);
    await inserts.insertDataloggerToCalSess(calSessObj, dlProf, new Date(2021, 3, 1), 20, 40, 60, 20, 40, 60);
    await updates.setCalibrationReporter(calSessObj, reporter3);
    await updates.addZoneToDatalogger(reading.zone, dlProf, study);
    await inserts.insertApproverToStudy(approver, study);
    await updates.changeStudyDuration(study, 48);
    await updates.changeStudyStartDate(study, new Date(2021, 0, 1, 12));
    await updates.editReporterAccountStatus(1, 1);
    await updates.editClientAccountStatus(1, 1);
}


const Suite = async () => {
    await dummyDataInsertForTests();
    testConfiguration=[
        {
            call_name: 'Get calibration session per datalogger',
            callback:()=>getCalibrationSessPerDatalogger(dlProf.dlName)
            .then(cals=>{
                return cals[0].nom_med_temp;
            }),
            expectedOutput:60
		},
        {
            call_name: 'Get calibration session per reporter',
            callback:()=>getCalibrationSessPerReporter(reporter3.employeeId)
            .then(cals=>{
                return cals[0].nom_med_temp;
            }),
            expectedOutput:60
		},
        {
            call_name: 'Get readings per datalogger',
            callback:()=>getReadingsPerDatalogger(dlProf.dlName)
            .then(reading=>{
                return reading[0].r_temp;
            }),
            expectedOutput:80
		},
        {
            call_name: 'Get datalogger to zone info for cleanroom',
            callback:()=>getDataloggerToZoneForCleanroom(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].zone_number
            }),
            expectedOutput:10
		},
        {
            call_name: 'Get studies per reporter',
            callback:()=>getStudiesPerReporter(reporter.employeeId)
            .then(res=>{
                return res[0].r_can_validate
            }),
            expectedOutput:1
		},
        {
            call_name: 'Get datalogger per request date',
            callback:()=>getDataloggersPerReqDate(new Date(2021, 2, 2))
            .then(res=>{
                return res[0].dl_ID_number
            }),
            expectedOutput:'102'
		},
        {
            call_name: 'Get dataloggers per client',
            callback:()=>getDataloggersPerClient(client.clientName)
            .then(res=>{
                return res[0].c_name
            }),
            expectedOutput:'TestClient1'
		},
        {
            call_name: 'Get dataloggers per study',
            callback:()=>getDataloggersPerStudy(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].s_cleanroom
            }),
            expectedOutput:'CLEANROOM'
		},
        {
            call_name: 'Get studies per client',
            callback:()=>getStudiesPerClient(client.clientName)
            .then(res=>{
                return res[0].s_cleanroom
            }),
            expectedOutput:'CLEANROOM'
		},
        {
            call_name: 'Get studies per approver',
            callback:()=>getStudyByApprover(approver.approverEmployeeId)
            .then(res=>{
                return res[0].s_cleanroom
            }),
            expectedOutput:'CLEANROOM'
		},
        {
            call_name: 'Get client by name',
            callback:()=>getClientByName(client.clientName)
            .then(res=>{
                return res[0].c_name
            }),
            expectedOutput:'TestClient1'
		},
        {
            call_name: 'Get reporter by name',
            callback:()=>getReporterByName(reporter.fname, reporter.lname)
            .then(res=>{
                return res[0].r_first_name
            }),
            expectedOutput:'ReporterFName'
		},
        {
            call_name: 'Get study by client name, cleanroom and request date',
            callback:()=>getStudyByClientCleanroomReqDate(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].s_cleanroom
            }),
            expectedOutput:'CLEANROOM'
		},
        {
            call_name: 'Get DL by name',
            callback:()=>getDlByName(dlProf.dlName)
            .then(res=>{
                return res[0].dl_ID_number
            }),
            expectedOutput:'102'
		},
        {
            call_name: 'Get calibration session by ts of low temp',
            callback:()=>getCalibrationSessPerDate(calSessObj.lowTempTs)
            .then(res=>{
                return res[0].nist_manufacturer
            }),
            expectedOutput:'testManuf'
		},
        {
            call_name: 'Get readings per study',
            callback:()=>getReadingsPerStudy(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].r_temp
            }),
            expectedOutput:80
		},
        {
            call_name: 'Get alarms for study',
            callback:()=>getRangesForStudy(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].s_max_temp
            }),
            expectedOutput:80
		},
        {
            call_name: 'Get all studies in the system',
            callback:()=>getAllStudies()
            .then(res=>{
                return res[0].c_name
            }),
            expectedOutput:'TestClient1'
		},
        {
            call_name: 'Get Reporter by employee id',
            callback:()=>getReporterByEmployeeId(reporter.employeeId)
            .then(res=>{
                return res[0].r_first_name
            }),
            expectedOutput:'ReporterFName'
		},
        {
            call_name: 'Get timestamp of last valid reading for the study time window',
            callback:()=>getTsOfLastValidReading(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res
            }),
            expectedOutput:1609689600
		},
        {
            call_name: 'Get all calibration sessions in the study',
            callback:()=>getAllCalSess()
            .then(res=>{
                return res[0].nist_manufacturer
            }),
            expectedOutput:'testManuf'
		},
        {
            call_name: 'Get readings for specific zone',
            callback:()=>getZoneReadings(study.clientName, study.cleanroomName, study.requestDate, 10)
            .then(res=>{
                return res[0].r_temp
            }),
            expectedOutput:80
		},
        {
            call_name: 'Get zones with readings out of range',
            callback:()=>getZonesWithReadingsOutOfRange(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].zone_number
            }),
            expectedOutput:10
		},
        {
            call_name: 'Get account status for reporter by employee id',
            callback:()=>getReporterAccountStatus(reporter.employeeId)
            .then(res=>{
                return res[0].r_account_status
            }),
            expectedOutput:1
		},
        {
            call_name: 'Get account status for clients',
            callback:()=>getClientAccountStatus(client.clientName)
            .then(res=>{
                return res[0].c_account_status
            }),
            expectedOutput:1
		},
        {
            call_name: 'Get approver by employee id',
            callback:()=>getApproverByEmployeeId(approver.approverEmployeeId)
            .then(res=>{
                return res[0].a_first_name
            }),
            expectedOutput:'ApproverFName'
		},
        {
            call_name: 'Get all dataloggers',
            callback:()=>getAllDataloggers()
            .then(res=>{
                return res[0].dl_ID_number
            }),
            expectedOutput: '102'
        },
        {
            call_name: 'Get study zones',
            callback:()=>getStudyZones(study.clientName, study.cleanroomName, study.requestDate)
            .then(res=>{
                return res[0].zone_number
            }),
            expectedOutput:10
        },
        {
            call_name: 'Get number of zones in study',
            callback:()=>getNumberOfZonesInStudy(study.clientName, study.cleanroomName, study.requestDate)
            .then(res => {
                return res[0].number_of_zones
            }),
            expectedOutput:1
        },
        {
            call_name: 'Get study for approver page',
            callback:()=>getStudyForApproverPage()
            .then(res=>{
                return res[0].s_id
            }),
            expectedOutput:1
        },
        {
            call_name: 'Get all reporters',
            callback:()=>getAllReporters()
            .then(res=>{
                return res[0].r_id
            }),
            expectedOutput:1
        },
        {
            call_name: 'Get all clients for approver',
            callback:()=>getAllClientsForApprover()
            .then(res => {
                return res[0].c_id
            }),
            expectedOutput:1
        },
        {
            call_name: 'Get study by primary key',
            callback:()=>getStudyById(1)
            .then(res =>{
                return res[0].c_name
            }),
            expectedOutput:'TestClient1'
        },
        {
            call_name: 'Get datalogger offset',
            callback:()=>getDlOffset(dlProf)
            .then(res => {
                return res[0].dl_offset
            }),
            expectedOutput:0
        }
    ];
    let results = await miniTestingFramework.runMyTests(testConfiguration);
    TestHelper.flushAllTables();
    console.log(results);
}

Suite();