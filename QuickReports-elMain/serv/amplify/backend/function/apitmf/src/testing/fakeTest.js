// import { miniTestingFramework } from './miniTestingFramework'
const { StudyHandler } = require('../models/StudyHandler')
const {miniTestingFramework} = require('./miniTestingFramework')
const {Study} = require('../models/objects/Study')
/**
 * 
 * Example Tests
 * 
 * Basic Structure is to create a testSuite Function 
 * prepare the data 
 * let data = myData
 * and create a test configuration array with objs like this 
 *      
 *      {
 *          call_name:'My call',
 *          callback:() => myCall(myData),
 *          expectedOutput: myOut
 *      }
 * 
 * then call the runMyTests(testConfiguration)
 * it will return when all tests exit , returns a summary 
 */


/**
 * Returns the same argument after a delay 
 * @param {number} fakeParameter 
 * @returns {Promise<number>}
 */
const fakeFunction = async (fakeParameter) => {
    let result = await  new Promise((resolve) => {
        setTimeout(resolve , 500)
    })
    return fakeParameter
}

/**
 * @author Pablo Alfonzo Santiago Uriarte
 */
const fakeSuite = async () => {
    let study = new Study({
        clientName:'Medtronic',
        requestDate:new Date(2021 , 0 , 1),
        cleanroomName:'CR1'
    })
    let fakeConfiguration = [
        {
            call_name:'Get Datalogger Per Study',
            callback: () => StudyHandler.getDataloggersPerStudy(study),
            expectedOutput:undefined
        }
    ]
    let fakeResults = await miniTestingFramework.runMyTests(fakeConfiguration)
    // console.log(fakeResults)
    fakeResults.testResults.forEach(result =>{
        console.log(` ==== ${result.call_name} ======`)
        console.log(result.result)
        console.log(` ==== Passed? ${result.outcome} ======`)
    })
}

fakeSuite()



