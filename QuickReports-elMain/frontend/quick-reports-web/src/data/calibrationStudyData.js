


let list=[{nistManuf:'LOCAL', nistNumber:'NUM', nistModel:'HMI41', nistSerNum:'X3810015', lowTemp:20, lowTempTs:'2021-01-01 12:00:00',
medTemp:81, medTempTs:'2021-01-01 04:00:00', highTemp:100, highTempTs:'2021-01-01 16:00:00', lowRh:20, lowRhTs:'2021-01-01 12:00:00',
medRh:62, medRhTs:'2021-01-01 04:00:00', highRh:100, highRhTs:'2021-01-01 16:00:00'}, {nistManuf:'VAISALA', nistNumber:'NUM', nistModel:'HMI41', nistSerNum:'X3810015', lowTemp:20, lowTempTs:'2021-01-01 12:00:00',
medTemp:80, medTempTs:'2021-01-01 04:00:00', highTemp:100, highTempTs:'2021-01-01 16:00:00', lowRh:20, lowRhTs:'2021-01-01 12:00:00',
medRh:63, medRhTs:'2021-01-01 04:00:00', highRh:100, highRhTs:'2021-01-01 16:00:00'}, {nistManuf:'VAISALA', nistNumber:'NUM', nistModel:'HMI41', nistSerNum:'X3810015', lowTemp:20, lowTempTs:'2021-01-01 12:00:00',
medTemp:82, medTempTs:'2021-01-01 04:00:00', highTemp:100, highTempTs:'2021-01-01 16:00:00', lowRh:20, lowRhTs:'2021-01-01 12:00:00',
medRh:61, medRhTs:'2021-01-01 04:00:00', highRh:100, highRhTs:'2021-01-01 16:00:00'}]


const reformat = (list) => {
    let forComp = [];
    for (let i = 0; i < list.length; i++){
        forComp.push(
        {
            id: i+1,
            sessionNumber: i+1,
            manufacturer: list[i].nistManuf,
            model: list[i].nistModel,
            serialNum: list[i].nistSerNum,
            calibrationDate: list[i].lowTempTs,
            nominalTemp: list[i].medTemp,
            nominalRh: list[i].medRh
        })
    }
    return forComp;
}

// let res = reformat(list);
// console.log(res[0].id)
// console.log(res[0].sessionNumber)
// console.log(res[0].manufacturer)
// console.log(res[0].model)
// console.log(res[0].serialNum)
// console.log(res[1])
// console.log(res[2])

// this is the format I need to pass to the component's state
const data = [
    {id: 1, sessionNumber:'1',manufacturer:'VAISALA', model:'HMI41',serialNum:'X3810015',calibrationDate:'05-01-2019',nominalTemp:'84.50', nominalRh:'70.65%'},
    {id: 2, sessionNumber:'2',manufacturer:'VAISALA', model:'HMI41',serialNum:'X3810015',calibrationDate:'05-01-2020',nominalTemp:'85.61', nominalRh:'70.64%'},
    {id: 3, sessionNumber:'3',manufacturer:'VAISALA', model:'HMI41',serialNum:'X3810015',calibrationDate:'05-01-2021',nominalTemp:'84.53', nominalRh:'72.8%'},
    {id: 4, sessionNumber:'4',manufacturer:'VAISALA', model:'HMI41',serialNum:'X3810016',calibrationDate:'05-01-2021',nominalTemp:'85.46', nominalRh:'70.1%'}
    ];

export const calData = reformat(list)