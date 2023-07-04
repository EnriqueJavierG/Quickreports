
const { miniTestingFramework } = require("./miniTestingFramework")
const {Reporter}  = require("../objects/Reporter")
const { CalibrationSess} = require("../objects/CalibrationSess")
const {CalibrationServices} = require("../CalibrationServices")
const { DataloggerServices } = require("../DataloggerServices")
const { DataloggerProfile } = require("../objects/DataloggerProfile")
const { StudyServices } = require("../StudyServices")

const Suite = async () => {
    let reporter = new Reporter({
        fname:'Michael',
        lname:'Bluth',
        employeeId:7,
        role:'validate'
    })

    let cal = new CalibrationSess({
        id:1,
        nistManuf:'Bluth E nter prises',
        nistNumber:'123',
        nistModel:'wazup',
        nistSerNum:123,
        lowTemp:10,
        medTemp:15,
        highTemp:1000,
        lowRh:10,
        medRh:15,
        highRh:60,
        lowRhTs:new Date(2028, 4 , 1 ,12 ,12, 12),
        medRhTs:new Date(2028 , 4 , 1 ,12 ,12 , 12),
        highRhTs:new Date(2028 , 4 , 1 ,12 ,12 ,12),
        lowTempTs:new Date(2028 , 4 , 1 ,12 , 12,12),
        medTempTs:new Date(2028 , 4 ,  1,12 , 12,12),
        highTempTs:new Date(2028 , 4 , 1 ,12 ,12 , 12),
    })
    let datalogger = new DataloggerProfile({
        dlName:'1',
        dlSerialNumber:2,
        dlOffset:0,
        dlInTolerance:1
    })

    let tests = [
        {
            call_name:'Insert a cal without params , expect error',
            callback: () => CalibrationServices.addNewCalSess(new CalibrationSess({})),
            expectedOutput:false,
            disabled:true
        },
        {
            call_name:'Insert a cal without model , expect error',
            callback: () => {
                let bad_sess = new CalibrationSess({...cal})
                bad_sess.nistModel = undefined 
                return CalibrationServices.addNewCalSess(bad_sess)
            },
            expectedOutput:false,
            disabled:true
        },
        {
            call_name:'Insert Calibration correctly ',
            callback: () => CalibrationServices.addNewCalSess(cal),
            expectedOutput:true,
            disabled:true
        },
        {
            call_name:'Change To Model of Calibration',
            callback: () => {
                cal.nistModel = 'The very best'
                return CalibrationServices.update(cal)
            },
            expectedOutput:true,
            disabled:true
        },
        {
            call_name:'Insert Datalogger',
            callback:async () => {
                let r = await DataloggerServices.create(datalogger)
                return r
            },
            expectedOutput:true,
            disabled:true
        },
        {
            call_name:`Fake calibrate datalogger ${datalogger.dlName}`,
            callback:async () => {
                CalibrationServices.calibrate(1)
            },
            disabled:true
        },
        {
            call_name:'get all studies and check mappings',
            callback: async () => {
                let studies = await StudyServices.getAllStudies();
                console.log(studies[0])
                let mappings = await StudyServices.getZoneToDL(studies[0])
                return mappings
            },
            disabled:true
        },{
            call_name: 'Check NIST Report Services' ,
            callback:async() => {
                let reportInfo = 
            }
        }
    ]

    let results = null 
    results =  await miniTestingFramework.runMyTests(tests);
    console.log(results)
}
Suite()