const {DataloggerHandler} = require('../../models/DataloggerHandler')
const {StudyHandler} = require('../../models/StudyHandler')
const {ReporterHandler} = require('../../models/ReporterHandler')
const {ClientHandler} = require('../../models/ClientHandler')
const {miniTestingFramework} = require('../miniTestingFramework')
const {Study} = require('../../models/objects/Study')
const {Reporter} = require('../../models/objects/Reporter')
const { flushReporter, flushStudy, flushClients, flushEmail, flushPhone } = require('../flushDbTables')
const { Client } = require('../../models/objects/Client')
const {TestHelper} = require('../testHelperClass')
const { DataloggerProfile } = require('../../models/objects/DataloggerProfile')
const { Reading } = require('../../models/objects/Reading')
/**
 * @author Pablo Alfonzo Santiago Uriarte
 *  
 */
const Suite = async () => {
    let study = new Study({
        clientName:'Bluth',
        requestDate: new Date('4/18/2021'),
        reporter_first_name:'Michael',
        reporter_last_name:'Bluth',
        cleanroomName:'cleaned',
        dataloggersQty:5
    })
    let reporter = new Reporter({
        fname:'Michael',
        lname:'Bluth',
        employeeId:007,
        role:'validate'
    })
    let client = new Client({
        clientName:'Bluth',
        email:'gmichael@bluth.com',
        telephone:'123'
    })

    let datalogger = new DataloggerProfile({
        dlSerialNumber:123,
        dlName:'elda',
        dlOffset:'1'
    })
    
    let testConfiguration = [
        {
            call_name:'Insert a new Client',
            callback:() => ClientHandler.create(client),
            expectedOutput:true
        },
        {
            call_name:'Get all clients',
            callback:() => ClientHandler.getAll().then(clients => clients[0].clientName),
            expectedOutput:client.clientName,
            equals: (real , expected ) => {
                return real == expected
            }
        },
        {
            call_name:'Get Client By Name',
            callback:() => ClientHandler.getClientByName(client.clientName).then(client => client.clientName),
            expectedOutput:client.clientName
        },
        {
            call_name:'Insert a new Reporter',
            callback:() => ReporterHandler.create(reporter),
            expectedOutput:true
        },
        {
            call_name:'Insert a new study',
            callback:() => StudyHandler.create(study , reporter),
            expectedOutput:true
        },
        {
            call_name: ' Get all Studies ',
            callback: () => StudyHandler.getAll().then(studies => studies[0].projectName),
            expectedOutput:study.projectName
        },
        {
            call_name:'Get Studies Per Reporter',
            callback:() => StudyHandler.getStudiesPerReporter(reporter.employeeId).then(studies => {
                return studies[0].cleanroomName
            }),
            expectedOutput:'cleaned'
        },
        {
            call_name:'Get Studies Per Client',
            callback:() => StudyHandler.getStudiesPerClient(study.clientName).then(studies => {
                return studies[0].cleanroomName
            }),
            expectedOutput:'cleaned'
        },
        {
            call_name:'insert new Datalogger',
            callback:() => DataloggerHandler.create(datalogger),
            expectedOutput:true
        },
        {
            call_name:'insert readings into datalogger',
            callback:() => DataloggerHandler.addReadings( [
                new Reading({
                    temp:87,
                    rh:75,
                    timestamp:new Date(),
                    zone:1
                }),
                new Reading({
                    temp:82,
                    rh:5,
                    timestamp:new Date(),
                    zone:2
                })
            ], datalogger , study),
            expectedOutput:true
        },
        {
            call_name:'Attach Datalogger to Study',
            callback:() => StudyHandler.attachDatalogger(study , datalogger),
            expectedOutput:true
        },
        {
            call_name:'Get Datalogger By Name',
            callback:() => StudyHandler.getByDatalogger().then(dl=>dl.dlName),
            expectedOutput:datalogger.dlName
        },
        {
            call_name:'Get Analytics Per Zone',
            callback:() => StudyHandler.getAnalyticsPerZone(study),
            expectedOutput:[{
                zone_number: null,
                avg_temp_per_zone: 84.5,
                min_temp_per_zone: 82,
                max_temp_per_zone: 87,
                avg_rh_per_zone: 40,
                min_rh_per_zone: 5,
                max_rh_per_zone: 75,
                s_id: 1
            }]
        },
        {
            call_name:'Get Datalogger per study',
            callback:() => StudyHandler.getDataloggersPerStudy(study.clientName , study.cleanroomName , study.requestDate ).then(dls=>dls[0].dlName),
            expectedOutput:datalogger.dlName
        }
    ]
    
    let results = await miniTestingFramework.runMyTests(testConfiguration)
    await TestHelper.flushAllTables()
    console.log(results)
    // results.testResults.forEach(result=>{
    //     console.log(`\n === ${result.call_name}\n ===`)
    //     console.log(result.result)
    //     console.log('\n =============================== \n')
    // })
    return results
}

Suite()