 const {updateDlProfile, getCalSessByPk, calculateOffset, isOffsetInTolerance} = require('../../daos/calibrationSess');

const {miniTestingFramework} = require('../miniTestingFramework');
const {TestHelper} = require('../testHelperClass');

const inserts = require('../../daos/inserts');

const {DataloggerProfile} = require('../../models/objects/DataloggerProfile');
const {CalibrationSess} = require('../../models/objects/CalibrationSess');
const {Reading} = require('../../models/objects/Reading');

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

let calSessObj2 = {
    nistManuf: 'testManuf',
    nistNumber : 'testNistNum',
    nistModel: 'testNistModel',
    nistSerNum : 'testSerNum',
    nom_low_temp : 20,
    nom_low_temp_ts: new Date(2021, 0, 1, 12, 0),
    nom_med_temp : 60,
    medTempTs: new Date(2021, 0, 1, 12, 0),
    nom_high_temp : 80,
    highTempTs: new Date(2021, 0, 1, 12, 0),
    nom_low_rh : 20, 
    lowRhTs: new Date(2021, 0, 1, 12, 0),
    nom_med_rh : 60, 
    medRhTs : new Date(2021, 0, 1, 12, 0),
    nom_high_rh : 80,
    highRhTs: new Date(2021, 0, 1, 12, 0),
};
let reading = new Reading({
    temp: 80,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 10
});
let reading2 = new Reading({
    temp: 90,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading3 = new Reading({
    temp: 90,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading4 = new Reading({
    temp: 90,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading5 = new Reading({
    temp: 90,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let reading6 = new Reading({
    temp: 90,
    rh: 60,
    ts: new Date(2021, 0, 1, 12),
    zone: 20
});
let readings = [reading, reading2, reading3, reading4, reading5, reading6];
let dlProf = new DataloggerProfile({
    dlName: '102',
    dlSerialNumber: 'serNum',
    dlOffset: 1.3
});
let calReadings = {
    lowTemp: 21, 
    medTemp:61,
    highTemp:81, 
    lowRh: 21,
    medRh: 61,
    highRh: 81
}

const dummyDataInsertForTests = async () => {
    await inserts.insertNewDatalogger(dlProf);
    await inserts.insertNewCalibrationSess(calSessObj);
}

const Suite = async () => {
    await dummyDataInsertForTests();
    testConfiguration=[
        {
            call_name: 'Updates Offset in datalogger profile',
            callback:()=>updateDlProfile(calSessObj2,calReadings,dlProf),
            expectedOutput:true
		},
        {
            call_name: 'Get calibration session by PK',
            callback:()=>getCalSessByPk(1)
            .then(res=>{
                return res[0].nist_manufacturer
            }),
            expectedOutput:'testManuf'
        },
        {
            call_name: 'Calculate Offset',
            callback:async()=>calculateOffset(calSessObj2, calReadings).tempOffset,
            expectedOutput:-1
        },
        {
            call_name: 'Determine if DL is in tolerance',
            callback:async()=>isOffsetInTolerance(1,1.02),
            expectedOutput:true
        },
        {
            call_name: 'Determine if DL in tolerance p2',
            callback:async()=>isOffsetInTolerance(1,2),
            expectedOutput:false
        }
    ];
    let results = await miniTestingFramework.runMyTests(testConfiguration);
    TestHelper.flushAllTables();
    console.log(results);
}
Suite();