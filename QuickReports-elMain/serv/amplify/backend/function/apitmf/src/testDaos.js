const reads = require('../src/daos/reads')
const {Study} = require('./models/objects/Study');
const {DateManager} = require('./dateManager');
// const db = require('./daos/inserts')
// // // const db = require('./daos/dataAnalytics')
// // // const db = require('./daos/updates')
// // const db = require('./daos/calibrationSess')



// let dateTest = DateManager.formatDateToDisplay(new Date());
// console.log(dateTest)


// let d1 = DateManager.convertDateStringToObj('2021-01-23');
// console.log(d1)


// let reqDateString = DateManager.convertReqDateObjectToDateString(new Date(2021, 0, 1));
// console.log(reqDateString);

//DateManager.convertReqDateStringToObj('May 5 2021')
DateManager.convertFullDateStringToObj('Jun 5 2025, 2:30')

// ________________________________________________________

// const getByName = ({cleanroomName , clientName , requestDate}) => {
//     console.log(requestDate)
//     let  reqDate = DateManager.convertReqDateObjectToDateString(DateManager.convertDateStringToObj(requestDate));
//     return reads.getStudyByClientCleanroomReqDate(clientName , cleanroomName ,reqDate);
// }


// const test = async () => {
//     let s = await getByName({cleanroomName: 'Stefani', clientName: 'TMF', requestDate: '2021-05-05'});
//     console.log(s);
// } 
// test();

// const test = async () => {
//     let s = await reads.getAllStudies();
//     console.log(s);
// } 
// test();

