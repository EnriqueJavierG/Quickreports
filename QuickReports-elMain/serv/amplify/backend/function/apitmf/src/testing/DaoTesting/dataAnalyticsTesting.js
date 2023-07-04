const {getMaxTempByZoneForStudy,
    getMinTempByZoneForStudy,
    getAvgTempByZoneForStudy,
    getMaxRHByZoneForStudy,
    getMinRHByZoneForStudy,
    getAvgRHByZoneForStudy,
    getAnalyticsPerZone,
    getReadingsOutOfRange,
    getReadingsCloseToRange} = require('../../daos/dataAnalytics');

const {miniTestingFramework} = require('../miniTestingFramework');
const {TestHelper} = require('../testHelperClass');
const inserts = require('../../daos/inserts');
const updates = require('../../daos/updates');

const {Client} = require('../../models/objects/Client');
const {Study} = require('../../models/objects/Study');
const {Reporter} = require('../../models/objects/Reporter');
const {Reading} = require('../../models/objects/Reading');
const {DataloggerProfile} = require('../../models/objects/DataloggerProfile');

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
    cleanroomName : 'CLEANROOM',
    samplingFrequency : 900,
    reporter_first_name: reporter.fname,
    reporter_last_name: reporter.lname,
    status: 0,
    startDate: new Date(2021, 2, 3, 12)
});
let reading = new Reading({
    temp: 80,
    rh: 63,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading2 = new Reading({
    temp: 90,
    rh: 63,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading3 = new Reading({
    temp: 90,
    rh: 62,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading4 = new Reading({
    temp: 40,
    rh: 20,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading5 = new Reading({
    temp: 84,
    rh: 61.5,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading6 = new Reading({
    temp: 91,
    rh: 100,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let readings = [reading, reading2, reading3, reading4, reading5, reading6];
let dlProf = new DataloggerProfile({
    dlName: '102',
    dlSerialNumber: 'serNum',
    dlOffset: 1.3
});
let client = new Client({
    clientName: 'TestClient1',
    email: 'testclientmail1@mail.com',
    telephone: '787-551-5555'
});

const dummyDataInsertForTests = async () => {
    await inserts.insertClient(client);
    await inserts.insertReporter(reporter);
    await inserts.insertNewStudy(reporter, study);
    await updates.updateStudyAlarms(study, 85, 65, 65, 60);
    await inserts.insertNewDatalogger(dlProf);
    await inserts.insertDataloggerToStudy(study, dlProf);
    await inserts.insertMultipleReadingsToValidationStudy(readings,dlProf, study);
    await updates.addZoneToDatalogger(reading.zone, dlProf, study);
}

// const test = async () => {
//     await dummyDataInsertForTests();
//     let res = await getReadingsCloseToRange(study)
//     console.log(res);
//     // TestHelper.flushAllTables();
// }
// test();

const Suite = async () => {
    await dummyDataInsertForTests();
    testConfiguration = [
        {
            call_name: 'Get max temperature per zone',
            callback:()=>getMaxTempByZoneForStudy(study)
            .then(res=>{
                return res[0].max_temp_per_zone
            }),
            expectedOutput:91
		},
        {
            call_name: 'Get min temperature by zone for a study',
            callback:()=>getMinTempByZoneForStudy(study)
            .then(res=>{
                return res[0].min_temp_per_zone
            }),
            expectedOutput:40
        },
        {
            call_name: 'Get average temperature by zone for a study',
            callback:()=>getAvgTempByZoneForStudy(study)
            .then(res=>{
                return TestHelper.round(res[0].avg_temp_per_zone, 2);
                
            }),
            expectedOutput:79.17
        },
        {
            call_name: 'Get maximum rh by zone for a study',
            callback:()=>getMaxRHByZoneForStudy(study)
            .then(res=>{
                return res[0].max_rh_per_zone
            }),
            expectedOutput:100
        },
        {
            call_name: 'Get minimum rh by zone for a study',
            callback:()=>getMinRHByZoneForStudy(study)
            .then(res=>{
                return res[0].min_rh_per_zone
            }),
            expectedOutput:20
        },
        {
            call_name: 'Get Average rh by zone for a study',
            callback:()=>getAvgRHByZoneForStudy(study)
            .then(res=>{
                return TestHelper.round(res[0].avg_rh_per_zone, 2);
            }),
            expectedOutput: 61.58
        },
        {
            call_name: 'Get data analytics per zone',
            callback:()=>getAnalyticsPerZone(study)
            .then(res=>{
                return res[0].min_temp_per_zone
            }),
            expectedOutput:40
        },
        {
            call_name: 'Get readings out of range',
            callback:()=>getReadingsOutOfRange(study)
            .then(res=>{
                return res[0].r_temp
            }),
            expectedOutput:90
        },
        {
            call_name: 'Get readings close to range',
            callback:()=>getReadingsCloseToRange(study)
            .then(res=>{
                return res[0].r_temp;
            }),
            expectedOutput:84
        }
    ];
    let results = await miniTestingFramework.runMyTests(testConfiguration);
    TestHelper.flushAllTables();
    console.log(results);
}

Suite();