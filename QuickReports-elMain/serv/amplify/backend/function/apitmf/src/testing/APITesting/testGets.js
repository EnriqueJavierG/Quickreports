const {miniTestingFramework} = require('../miniTestingFramework')
const axios = require('axios')
const { Study } = require('../../models/StudyHandler')
const { Reporter } = require('../../models/objects/Reporter')
const baseUrl = `http://localhost:4000/study`
/**
 * @author Pablo Alfonzo Santiago Uriarte
 */
const testSuite = async () => {
    let study = {
        c_name:"Pablito",
        req_date:new Date('12/12/97'),
        s_cleanroom:'el cuarto',
        dataloggersQty:10
    }
    let reporter = {
        employeeId:123456
    }

    let testsConfigurations = [
        {
            call_name:"Get Studies By Client",
            callback:() =>  getByClient(study.c_name),
            expectedOutput: undefined
        },
        {
            call_name:"Get Studies By Report",
            callback:() =>  getByReporter(reporter.employeeId),
            expectedOutput: undefined
        }
    ]

    
    let results = await miniTestingFramework.runMyTests(testsConfigurations)
    console.log(results)
}

const getAllStudies = async () => {
    let resp = await axios.get(`${baseUrl}/getAll` , {
        params:{
            client_name:'dam'
        }
    })

    return resp.data.studies
}

const getByClient = async (client_name) => {
    let result = await axios.get(`${baseUrl}/getStudiesByClient` , {
        params:{
            client_name
        }
    })
    // console.log(result.data.studies)
    return result.data.studies
}

const getByReporter = async (employeeId) => {
    let resp = await axios.get(`${baseUrl}/getStudiesPerReporter` , {
        params:{
            employeeId
        }
    })
    return resp.data.studies
}

/**
 * duplicates a study lol 
 */
const insertNewStudy = async (study , reporter) => {
    let resp = await axios.post(`${baseUrl}/create`, { study, reporter })
    return resp.data
}

testSuite()
