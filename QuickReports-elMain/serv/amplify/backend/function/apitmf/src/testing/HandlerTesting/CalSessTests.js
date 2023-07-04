import { CalibrationHandler } from "../../models/CalibrationHandler"
import { CalibrationSess } from "../../models/objects/CalibrationSess"
import { miniTestingFramework } from "../miniTestingFramework"
import { TestHelper } from "../testHelperClass"

const Suite = async () => {
    let reporter = new Reporter({
        fname:'Michael',
        lname:'Bluth',
        employeeId:7,
        role:'validate'
    })

    let cal = new CalibrationSess({
        nistManuf:'Bluth Enterprises',
        nistNumber:'12',
        nistModel:'Cornballer',
        nistSerNum:'123',
        lowTemp:10,
        medTemp:15,
        highTemp:60,
        lowRh:10,
        medRh:15,
        highRh:60,
        lowRhTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
        medRhTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
        highRhTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
        lowTempTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
        lowTempTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
        lowTempTs:new Date(2021 , 2 , 2 ,12 ,12 ,12 , 12,12),
    })

    let tests = [
        {
            call_name:'Insert Calibration',
            callback: () => CalibrationHandler.addNewCalSess(cal),
            expectedOutput:true
        },
        {
            call_name:'Insert Calibration',
            callback: () => {
                cal.highTemp = 20000
                return CalibrationHandler.update(cal)
            },
            expectedOutput:true
        }
    ]

    let results = null 
    // results =  await miniTestingFramework.runMyTests(tests);
    await TestHelper.flushAllTables()
    console.log(results)
}