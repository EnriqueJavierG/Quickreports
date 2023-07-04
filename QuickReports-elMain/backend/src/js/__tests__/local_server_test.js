import axios from "axios"
import miniTestingFramework from "./miniTestingFramework.js"
const baseUrl = 'http://localhost:4000'
const tester = miniTestingFramework.miniTestingFramework
const Suite = async () => {

    let tests = [
        {
            call_name:'Get Configuration Block',
            callback: () => axios.get(`${baseUrl}/getConfigurationBlock`).then(r => r.data),
            expectedOutput:'188',
            compare: (result , expectedOutput) => {
                return result.name == expectedOutput
            },
            disabled:false
        },
        {
            call_name:'Get readings',
            callback:() => axios.get(`${baseUrl}/readings`).then(r => r.data),
            expectedOutput:'not sure',
            compare: (result , expectedOutput) => {
                return true // todo
            },
            disabled:false
        }
    ]

    let results = await  tester.runMyTests(tests)
    // results.testResults.forEach(r => {
    //     console.log(`=============${r.call_name}==============`)
    //     console.log(r.result)
    //     console.log(`==============Passed? ${r.outcome}`)
    // })
    console.log(results)
}
Suite()