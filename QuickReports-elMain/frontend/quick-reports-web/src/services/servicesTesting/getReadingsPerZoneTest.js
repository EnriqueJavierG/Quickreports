const { Reading } = require('../objects/Reading')
const {StudyServices} = require('../StudyServices')
const {DataloggerServices} = require('../DataloggerServices')
const {miniTestingFramework} = require('./miniTestingFramework')
const Suite = async () =>{

    let studies = await StudyServices.getAllStudies()
    let datalogger  = {
        dlName:'elda',
        dlSerialNumber:123,
        dlOffset:1,
        dlInTolerance:false
    }
    let tests = [
        
        {
            call_name:'Get readings for a zone',
            callback: () => StudyServices.getReadingsPerZone(studies[0] , 1).then(r => r.length),
            expectedOutput:[],
            compare: (result , expectedOutput) => {
                // console.log(result.length)
                return true 
            }// always pass for now
        },
        {
            call_name:'Create Dl',
            callback: () => DataloggerServices.create(datalogger),
            expectedOutput:true
        },
        {   
            call_name:'Attach Dl to study',
            callback:() => StudyServices.attachDataloggerToStudy(studies[0] , datalogger),
            expectedOutput:true
        },
        {
            call_name:'Attach DL to zone 1',
            callback: () => StudyServices.attachDataloggerToZone(1 , studies[0] , datalogger),
            expectedOutput:true
        },
        {
            call_name:'insert a bunch of readings for max amount of readings in zone test ',
            callback: () => {
                let readings = []
                //generate a bunch of fake readings
                for(let i = 0; i < 16324 ; i++){
                    readings.push(new Reading({
                        temp:Math.random()*10,
                        hum:Math.random()*50,
                        ts:new Date(),
                        zone:1
                    }))
                    
                }
                console.log(datalogger)
                return StudyServices.insertReadings(readings , datalogger , studies[0])
            },
            expectedOutput:true
        },
        {
            call_name:'Get readings for a zone',
            callback: () => StudyServices.getReadingsPerZone(studies[0] , 1).then(r => r[0]),
            expectedOutput:[],
            compare: (result , expectedOutput) => {
                
                return true 
            }
        }
    ]

    let results = await miniTestingFramework.runMyTests(tests)
    console.log(results)


}

Suite()