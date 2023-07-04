const {insertClient, insertApprover, insertReporter, insertNewStudy,
    addProgramDataloggerParams, insertNewDatalogger, insertDataloggerToStudy, 
    insertNewCalibrationSess,  
    insertDataloggerToCalSess, insertApproverToStudy,insertMultipleReadingsToValidationStudy,
    insertCompleteNewStudy, getDifferenceInHours} = require('../../daos/inserts');


const {miniTestingFramework} = require('../miniTestingFramework');

const {Client} = require('../../models/objects/Client');
const {TestHelper} = require('../testHelperClass');
const {Approver} = require('../../models/objects/Approver');
const {Reporter} = require('../../models/objects/Reporter');
const {Study} = require('../../models/objects/Study');
const {DataloggerParams} = require('../../models/objects/DataloggerParams');
const {DataloggerProfile} = require('../../models/objects/DataloggerProfile');
const {CalibrationSess} = require('../../models/objects/CalibrationSess');
const {Reading} = require('../../models/objects/Reading');



const Suite = async () => {
    let client = new Client({
        clientName: 'TestClient1',
        email: 'testclientmail1@mail.com',
        telephone: '787-551-5555'
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
        cleanroomName : 'CR1',
        samplingFrequency : 900,
        reporter_first_name: reporter.fname,
        reporter_last_name: reporter.lname,
        status: 0,
        startDate: new Date(2021, 2, 3, 12),
        duration: 24
    });
    let study2 = new Study({
        id: 1,
        clientName: 'TestClient1',
        requestDate: new Date(2021, 2, 2),
        maxTemp: 80,
        minTemp: 60,
        maxRH: 60,
        minRH: 55,
        dataloggersQty: 10,
        isApproved: 0,
        cleanroomName : 'CR1',
        samplingFrequency : 900,
        reporter_first_name: reporter.fname,
        reporter_last_name: reporter.lname,
        status: 0,
        startDate: new Date(2021, 2, 4, 12),
        endDate: new Date(2021, 2, 5, 12),
        duration: 24
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
        dlName: '23',
        dlSerialNumber: 'serNum',
        dlOffset: 1.3
    });
    let calSessObj = new CalibrationSess({
        nistManuf: 'testManuf',
        nistNumber : 'testNistNum',
        nistModel: 'testNistModel',
        nistSerNum : 'testSerNum',
        lowTemp : 20,
        lowTempTs: new Date(2021, 0, 1, 12, 0, 0),
        medTemp : 60,
        medTempTs: new Date(2021, 0, 1, 12, 0, 0),
        highTemp : 80,
        highTempTs: new Date(2021, 0, 1, 12, 0, 0),
        lowRh : 20, 
        lowRhTs: new Date(2021, 0, 1, 12, 0, 0),
        medRh : 60, 
        medRhTs : new Date(2021, 0, 1, 12, 0, 0),
        highRh : 80,
        highRhTs: new Date(2021, 0, 1, 12, 0, 0),
    });
    let reading = new Reading({
        temp: 80,
        rh: 60,
        ts: 1619980495,
        zone: 10
    });
    let readings = [];
    for(let i = 0; i<500; i++){
        readings.push(reading);
    };
    let date1 = new Date(2021, 1, 2, 0, 0);
    let date2 = new Date(2021, 1, 4, 12, 0);

    testConfiguration = [
        {
            call_name:'Insert Client',
            callback:()=>insertClient(client),
            expectedOutput:true
        },
        {
            call_name: 'Insert Approver',
            callback:()=>insertApprover(approver),
            expectedOutput:true
        },
        {
            call_name: 'Insert Reporter',
            callback:()=>insertReporter(reporter),
            expectedOutput: true
        },
        {
            call_name: 'Insert New Study',
            callback:()=>insertNewStudy(reporter, study),
            expectedOutput: true
        },
        {
            call_name: 'Add Datalogger Parameters',
            callback:()=>addProgramDataloggerParams(study, dlParams),
            expectedOutput: true
        },
        {
            call_name: 'Insert New Datalogger',
            callback:()=>insertNewDatalogger(dlProf),
            expectedOutput: true
        },
        { 
            call_name: 'Insert Datalogger to Study',
            callback:()=>insertDataloggerToStudy(study, dlProf),
            expectedOutput: true
        },
        {
            call_name: 'Insert New Calibration Session',
            callback:()=>insertNewCalibrationSess(calSessObj),
            expectedOutput:true
        },
        {
            call_name: 'Insert Datalogger to Calibration Session',
            callback:()=>insertDataloggerToCalSess(calSessObj, dlProf, new Date(2021, 3, 1), 20, 40, 60, 20, 40, 60),
            expectedOutput: true
        },
        {
            call_name: 'Insert approver to study',
            callback:()=>insertApproverToStudy(approver, study),
            expectedOutput:true
		},
        {
            call_name: 'Insert Multiple Readings to Validation Study',
            callback:()=>insertMultipleReadingsToValidationStudy(readings, dlProf, study),
            expectedOutput:true
        },
        {
            call_name:'Insert New Complete Study',
            callback:()=>insertCompleteNewStudy(reporter, study2),
            expectedOutput:true
        },
        {
            call_name:'Get date difference in hours',
            callback:async ()=>getDifferenceInHours(date1, date2),
            expectedOutput: 60
        }
    ];
    let results = await miniTestingFramework.runMyTests(testConfiguration);
    TestHelper.flushAllTables();
    console.log(results)
    // results.testResults.forEach(result=>{
    //     console.log(`\n === ${result.call_name}\n ===`)
    //     console.log(result.result)
    //     console.log('\n =============================== \n')
    // })
}

Suite();