const {StudyServices} = require('../StudyServices')
const {Study} = require('../objects/Study')
const {Reporter} = require('../objects/Reporter')
const {Client} = require('../objects/Client')
const {UserServices} = require('../UserServices')
const {miniTestingFramework} = require('./miniTestingFramework')
// const { TestHelper } = require('../../../../../serv/amplify/backend/function/apitmf/src/testing/testHelperClass')
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
        employeeId:722,
        role:'calibrate'
    })
    let client = new Client({
        clientName:'Bluth',
        email:'gmichael@bluth.com',
        telephone:'123'
    })

    let tests = [
        {
            call_name: 'Insert Client',
            callback: () => UserServices.createNewClient(client),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: 'update client acct status',
            callback: () => UserServices.updateClientAccountStatus(client , 1),
            expectedOutput:true
        },
        {
            call_name: 'Insert Reporter',
            callback: () => UserServices.createNewReporter(reporter),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: 'update reporter acct status',
            callback: () => UserServices.updateReporterAccountStatus(reporter , 1),
            expectedOutput:true
        },
        {
            call_name:'Assign reporter to validate',
            callback: () => UserServices.assignRole(reporter , 'validate'),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: 'Insert Study',
            callback: () => StudyServices.createNewStudy(study , reporter),
            expectedOutput:true,
            disabled:false
        },
        {
            call_name: 'update study status',
            callback: () => StudyServices.updateStatus(1 , 4),
            expectedOutput:true
        },
    ]

    
    let results = null 
    results = await miniTestingFramework.runMyTests(tests)
    // await TestHelper.flushAllTables()
    console.log(results);
}
Suite()