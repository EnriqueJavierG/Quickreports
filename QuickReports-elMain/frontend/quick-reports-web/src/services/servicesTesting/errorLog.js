const { DashboardServices } = require("../../components/dashboard/Services/DashboardServices")
const {Study}  = require('../objects/Study')
const { miniTestingFramework } = require("./miniTestingFramework")
const Suite = async () => {
    let tests = [
        {
            call_name:'Error log call',
            callback:() => DashboardServices.errorLog(new Study({
                clientName:'Medtronic',
                cleanroomName:'CR1',
                requestDate:new Date(2021 , 0 , 1)
            }))
        },
    ]

    let results = await miniTestingFramework.runMyTests(tests)
    console.log(results)
}

Suite()