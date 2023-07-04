/**
 * @author Pablo Alfonzo Santiago Uriarte
 * 
 * simple testing framework
 */
 class miniTestingFramework{
    /**
     * Runs a function , announces input / output 
     * Verifies result against provided result
     * @param {string} call_name 
     * @param {function} callback 
     * @param {any} expectedOutput 
     *@returns {Promise<{call_name:string , outcome:boolean}>}
    */
    static runFunction = async (call_name , callback , expectedOutput , compare) => {
        
        console.log(` ==== ${call_name} ======`)
        let result = await callback().catch((e)=>{console.log(e) ;return {call_name , outcome:false , result:e} } )

        console.log(result)
        console.log(` ==== Passed? ${compare(result , expectedOutput)} ======`)

        return {call_name , outcome:compare(result , expectedOutput) , result}
    }
    /**
     * Gives Summary on a list of testResults
     * @param {{call_name:string , outcome:boolean , result:any}} testResults 
     * @returns {{sucessRate:number , failed:number , passed:number , allPassed:boolean , failedTests:string[]}}
     */
    static getTestSummary = (testResults) =>{
        let failQty = (testResults.filter(({test , outcome}) => {return !outcome})).length
        let failedTests = []
        testResults.forEach(({call_name , outcome , result})=> {
            if(!outcome){
                failedTests.push(call_name)
            }
        })        
        const sucessRate = (testResults.length - failQty)/testResults.length 
        let complete_summary = {
            sucessRate,
            failed:failQty,
            passed:testResults.length - failQty,
            allPassed:(sucessRate === 1),
            failedTests,
            testResults
        }

        return complete_summary
    }

    /**
     * 
     * @param {{call_name:string , callback:function , expectedOutput:boolean}[]} tests 
     * @returns {{call_name:string , outcome:boolean}[]}
     */
    static runSomeTests = async (tests,runSerially) => {
        let results = []
        if(runSerially){
            for(let i = 0; i < tests.length ; i++){
                let test = tests[i]
                if(test.disabled)continue;
                let result = await this.runFunction(test.call_name , test.callback , test.expectedOutput , test.compare ? test.compare : (e1 , e2) => e1 == e2 )
                results.push(result)
            }
        }
        else{
            let promises = []
            tests.forEach(test => {
                promises.push(this.runFunction(test.call_name , test.callback , test.expectedOutput , test.compare ? test.compare : (e1 , e2) => e1 == e2))
            })

            await Promise.all(promises)
            
            promises.forEach(promise => {
                promise.then(result => {
                    results.push({call_name:result.call_name ,outcome: result.outcome})
                })
            })
        }
        
        return results
    }

    /**
     * Runs an array of tests and returns the results
     * @param {{call_name:string , callback:function , expectedOutput:any}[]} tests 
     * @returns 
     */
    static testRuns = async (tests , runSerially) => {
        return this.runSomeTests(tests , runSerially)
    }

    /**
     * @param {boolean} runSerially if true , test will be ran on order
     * @param {tests} testsConfigurations 
     * @returns {{sucessRate:number , failed:number , passed:number , allPassed:boolean , failedTests:string[]}}
     */
    static runMyTests = async (testsConfigurations , runSerially) => {
        if(runSerially == undefined || runSerially == null){
            runSerially = true
        }
        let results = await this.testRuns(testsConfigurations , runSerially)
        let summary = this.getTestSummary(results)
        return summary
    }

    /**
     * 
     * @param {tests} testsConfigurations 
     * @returns {{sucessRate:number , failed:number , passed:number , allPassed:boolean , failedTests:string[]}}
     */
    static runMyTests = async(testConfigurations) => {
        let results = await this.testRuns(testConfigurations , true)
        let summary = this.getTestSummary(results)
        return summary
    }

}
// export const miniTestingFramework = miniTestingFramework
module.exports = {miniTestingFramework}
