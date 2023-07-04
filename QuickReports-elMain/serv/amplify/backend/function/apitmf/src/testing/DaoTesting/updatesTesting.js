const {changeStudyStatus, editDLOffset, addZoneToDatalogger, changeQtyOfDlInStudy,
    removeDLFromStudy, changeCleanroomName, updateStudyAlarms, changeStudyDuration, changeStudySamplingFrequency,
    changeStudyStartDate, changeDlSerialNumber, updateRequestDateForStudy, changeCalSessNistManuf,
    changeCalSessNistNumber, changeCalSessNistModel, changeCalSessNistSerNumber, changeCalSessNomLowTemp,
    changeCalSessNomMedTemp, changeCalSessNomHighTemp, changeCalSessNomLowRH, changeCalSessNomMedRH,
    changeCalSessNomHighRH, changeCalSessNomLowTempTs, changeCalSessNomMedTempTs, changeCalSessNomHighTempTs,
    changeCalSessNomLowRHTs, changeCalSessNomMedRHTs, changeCalSessNomHighRHTs, changeDlName, 
    changeStudyReporter, editDlToleranceFlag, editReporterAccountStatus, editClientAccountStatus, 
    changeStudyApproval, setCalibrationReporter}
    = require('../../daos/updates');

const inserts = require('../../daos/inserts');

const {miniTestingFramework} = require('../miniTestingFramework');

const {TestHelper} = require('../testHelperClass');
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
    dlSerialNumber: 'serNum',
    dlOffset: 0
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
    timestamp: new Date(2021, 0, 1, 12),
    zone: 10
});

const dummyDataInsertForTests = async () => {
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
    await inserts.insertReadingsToValidationStudy(reading, dlProf, study);
    await inserts.insertDataloggerToCalSess(calSessObj, dlProf, new Date(2021, 3, 1), 20, 40, 60, 20, 40, 60);
}


const Suite = async () => {
    await dummyDataInsertForTests();
    testConfiguration = [
        {
            call_name: 'Change study status',
            callback:()=>changeStudyStatus(study, 2),
            expectedOutput:true
        },
        {
            call_name: "Approve Study",
            callback:()=>changeStudyApproval(study, 1),
            expectedOutput:true
        },
        {
            call_name: 'Edit DL Offset',
            callback:()=>editDLOffset(dlProf, 1.0),
            expectedOutput:true
        },
        {
            call_name: 'Add zone to datalogger in study',
            callback:()=>addZoneToDatalogger(1, dlProf, study),
            expectedOutput:true
        },
        {
            call_name: 'Change number of DLs in study',
            callback:()=>changeQtyOfDlInStudy(study, 10),
            expectedOutput:true
        },
        {
            call_name: 'Remove DL from study',
            callback:()=>removeDLFromStudy(study, dlProf),
            expectedOutput:true
        },
        {
            call_name: 'Change cleanroom name',
            callback:()=>changeCleanroomName(study, 'CLEANROOM'),
            expectedOutput:true
        },
        {
            call_name: 'Update study alarms',
            callback:()=>updateStudyAlarms(study2, 85, 65, 65, 60),
            expectedOutput:true
        },
        {
            call_name: 'Change study duration',
            callback:()=>changeStudyDuration(study2, 48),
            expectedOutput:true
        },
        {
            call_name: 'Change study sampling frequency',
            callback:()=>changeStudySamplingFrequency(study2, 300),
            expectedOutput:true
        },
        {
            call_name: 'Change study start date',
            callback:()=>changeStudyStartDate(study2, new Date(2023, 3, 3, 12, 30)),
            expectedOutput:true
        },
        {
            call_name: 'Change DL serial number',
            callback:()=>changeDlSerialNumber(dlProf, 'newSerNum'),
            expectedOutput:true
	    },
        {
            call_name: 'Change request date for study',
            callback:()=>updateRequestDateForStudy(study, new Date(2021,6,6)),
            expectedOutput:true
	    },
        {
            call_name: 'Change calibration session Nist manufacturer',
            callback:()=>changeCalSessNistManuf(calSessObj, 'newManu'),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration nist number',
            callback:()=>changeCalSessNistNumber(calSessObj, 'newNistNum'),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session nist model',
            callback:()=>changeCalSessNistModel(calSessObj, 'newnistmodel'),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session nist serial number',
            callback:()=>changeCalSessNistSerNumber(calSessObj, 'newNistSerNum'),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session low temperature',
            callback:()=>changeCalSessNomLowTemp(calSessObj, 20),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session med temperature',
            callback:()=>changeCalSessNomMedTemp(calSessObj, 40),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session high temperature',
            callback:()=>changeCalSessNomHighTemp(calSessObj, 60),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session low rh',
            callback:()=>changeCalSessNomLowRH(calSessObj, 20),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session med rh',
            callback:()=>changeCalSessNomMedRH(calSessObj, 40),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session high rh',
            callback:()=>changeCalSessNomHighRH(calSessObj, 60),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session low temperature ts',
            callback:()=>changeCalSessNomLowTempTs(calSessObj,  new Date(2021, 0, 1, 12, 0)),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session med temp ts',
            callback:()=>changeCalSessNomMedTempTs(calSessObj, new Date(2021, 1, 1, 12, 0)),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session high temp ts',
            callback:()=>changeCalSessNomHighTempTs(calSessObj, new Date(2021,5,5,4,5)),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session low rh ts',
            callback:()=>changeCalSessNomLowRHTs(calSessObj, new Date(2021,5,5,5,5)),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session med rh ts',
            callback:()=>changeCalSessNomMedRHTs(calSessObj, new Date(2021,5,5,5,5)),
            expectedOutput:true
		},
        {
            call_name: 'Change calibration session high rh ts',
            callback:()=>changeCalSessNomHighRHTs(calSessObj, new Date(2021,5,5,5,5)),
            expectedOutput:true
		},
        {
            call_name: 'Change DL Name ',
            callback:()=>changeDlName(dlProf, '102'),
            expectedOutput:true
		},
        {
            call_name: 'Change study reporter',
            callback:()=>changeStudyReporter(study2, reporter2),
            expectedOutput:true
		},
        {
            call_name: 'Edit Dl tolerance flag',
            callback:()=>editDlToleranceFlag(dlProf, 1),
            expectedOutput:true
		},
        {
            call_name: 'Edit reporter account status',
            callback:()=>editReporterAccountStatus(reporter, 'pending'),
            expectedOutput:true
		},
        {
            call_name: 'Edit client account status',
            callback:()=>editClientAccountStatus(client, 'approved'),
            expectedOutput:true
		},
        {
            call_name:'Add reporter to calibration ',
            callback:()=>setCalibrationReporter(calSessObj, reporter3),
            expectedOutput:true
        }
    ];
    let results = await miniTestingFramework.runMyTests(testConfiguration);
    TestHelper.flushAllTables();
    console.log(results);
}

Suite();