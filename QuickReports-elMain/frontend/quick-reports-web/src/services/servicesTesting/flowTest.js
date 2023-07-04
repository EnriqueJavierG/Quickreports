const { UserServices } = require('../UserServices')
const {miniTestingFramework} = require('./miniTestingFramework')
const {Study} = require('../objects/Study')
const {Client} = require('../objects/Client')
const {Reporter} = require('../objects/Reporter')
const {DataloggerProfile} = require('../objects/DataloggerProfile')
const {DataloggerConnection} = require('../DLConnection');
const { StudyServices } = require('../StudyServices')
// const { TestHelper } = require('../../../../../serv/amplify/backend/function/apitmf/src/testing/testHelperClass')
const { DataloggerServices } = require('../DataloggerServices')
const { DashboardServices } = require('../../components/dashboard/Services/DashboardServices')
/**
 * Test
 */
const Suite = async () => {
    let study = new Study({
        clientName:'Bluth',
        requestDate: new Date(2021, 2, 2),
        startDate:new Date(2021, 2, 2),
        reporter_first_name:'Michael',
        reporter_last_name:'Bluth',
        cleanroomName:'cleaned',
        dataloggersQty:5,
        maxTemp:10,
        maxRH:1,
        minTemp:1,
        minRH:1
    })
    let reporter = new Reporter({
        fname:'Michael',
        lname:'Bluth',
        employeeId:7,
        role:'validate'
    })
    let client = new Client({
        clientName:'Bluth',
        email:'gmichael@bluth.com',
        telephone:'123'
    })

    let datalogger = new DataloggerProfile({
        dlSerialNumber:1,
        dlName:'1',
        dlOffset:'1'
    })

    let datalogger2 = new DataloggerProfile({
        dlSerialNumber:2,
        dlName:'2',
        dlOffset:'1'
    })

    let tests = [
        {
            call_name:'Insert a new Client',
            callback:() => UserServices.createNewClient(client),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name:'Insert New Reporter',
            callback:() => UserServices.createNewReporter(reporter),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name:'Insert a new Study',
            callback:() => StudyServices.createNewStudy(study , reporter),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name:'Insert a new Datalogger',
            callback:() => DataloggerServices.create(datalogger),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name:'Insert second DL',
            callback:() => DataloggerServices.create(datalogger2),
            expectedOutput:true
        },
        {
            call_name: ' Insert Datalogger in study ',
            callback:() => StudyServices.attachDataloggerToStudy(study , datalogger),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: ' Insert 2nd Datalogger in study ',
            callback:() => StudyServices.attachDataloggerToStudy(study , datalogger2),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: 'Attach DL 1 to zone 1',
            callback: () => StudyServices.attachDataloggerToZone(1 , study , datalogger),
            disabled:false,
            expectedOutput:true
        },
        {
            call_name: 'Attach DL 2 to zone 2',
            callback: () => StudyServices.attachDataloggerToZone(2 , study , datalogger2),
            disabled:false,
            expectedOutput:true
        },
        {
            call_name:'Get all studies',
            callback:() => StudyServices.getAllStudies(),
            expectedOutput:[study],
            disabled:false,
            compare: (result , expectedOutput) => {
                if(result.length !== expectedOutput.length)return false
                result.forEach((study , index) => {
                    if(study.clientName != expectedOutput[index].clientName){
                        console.log(study)
                        console.log(expectedOutput[index])
                        return false
                    }
                })
                return true
            },
            
//         },
//         {
//             call_name:'Get all Dataloggers',
//             callback: () => DataloggerServices.getAll(),
//             expectedOutput:[datalogger , datalogger2],
//             compare:(result , expectedOutput) => {
//                 return result.length == expectedOutput.length
//             },
//             disabled:false
            
        },
        {
            call_name:'Get Datalogger By Name',
            callback: () => DataloggerServices.getByName(datalogger.dlName),
            expectedOutput:datalogger,
            compare:(result , expectedOutput) => {
                return result.dlName == expectedOutput.dlName
            },
            disabled:false
        },
        {
            call_name:'Extract Readings and save to db ',
            callback: () => StudyServices.extractReadings(study),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name:'Program DL',
            callback:() => DataloggerConnection.program({name:"pablito"}),
            expectedOutput:true,
            disabled:true
        },
        {
            call_name:'Verify if name was changed',
            callback: () => DataloggerConnection.getDetails().then(details => details.name),
            expectedOutput:'pablito',
            disabled:true
        },
        {
            call_name:'Get analytics per zone for study',
            callback: () => DashboardServices.zoneSummariesList(study),
            compare:(result , expectedOutput) =>{
                return true
            },
            expectedOutput:true
        },
        {
            call_name:'Update ranges for study',
            callback: () => StudyServices.updateProgramConfigurations(study , study),
            expectedOutput:true
        },
        {
            call_name:'Readings for zones out of range',
            callback: () => DashboardServices.readingsFromErrorZones(study),
            compare:(result , expectedOutput) => {
                return true
            }

        },
        {  
            call_name:'Get zone Summary List',
            callback:() => DashboardServices.zoneSummariesList(study),
            expectedOutput:undefined,
            compare:(r , out) => {
                return true
            }
        },
        {  
            call_name:'Get zone RH avg List',
            callback:() => DashboardServices.rhAvg(study),
            expectedOutput:undefined,
            compare:(r , out) => {
                return true
            }
        },
        {  
            call_name:'Get zone temp avg List',
            callback:() => DashboardServices.tempAvg(study),
            expectedOutput:undefined,
            compare:(r , out) => {
                return true
            }
        },
        // {
        //     call_name:'Wipe the DB',
        //     callback: () => TestHelper.flushAllTables(),
        //     expectedOutput:undefined,
        //     disabled: true
        // },
        
     ]
        
    let results = null 
    results = await miniTestingFramework.runMyTests(tests)
    //await TestHelper.flushAllTables()
    console.log('wiped')
    console.log(results)
    // results.testResults.forEach(result => {
    //     console.log(` ==== ${result.call_name} ======`)
    //     console.log(result)
    //     console.log(result.result)
    //     console.log(` ==== Passed? ${result.outcome} ======`)
    // })

    return results
}
Suite()
module.exports = {flowTest:Suite}
