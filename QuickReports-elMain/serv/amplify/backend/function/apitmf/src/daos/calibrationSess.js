
const updates = require('../daos/updates');
const reads = require('../daos/reads');

// // development environment
// const {runQuery} = require('../database')

// Testing environment
const {runQuery} = require('../testing/DaoTesting/databaseTestingInstance');


/**
 * @author Pablo Santiago 
 */
const update = async (calibrationSessionId , updates) => {
    let updateQuery = `UPDATE Calibration_Sess SET `
    let args = []
    Object.keys(updates).forEach(key => {
        updateQuery += ` ${key} = ? ,`
        args.push(updates[key])
    })
    
    updateQuery =updateQuery.substring(0,updateQuery.length - 1) // delete extra comma
    updateQuery += ` WHERE cal_id = ?`
    args.push(calibrationSessionId)
    // console.log(updateQuery)
    // console.log(args)
    try {
        await runQuery(updateQuery , args)
        return true
    }catch(e){
        console.error(e)
        return false;
    }
}


/**
 * 
 * @author Fabiola Badillo Ramos
 * @param {String} ts - must be in the format 'YYYY-MM-DD HH:MM:SS'
 * @param {*} readings - list of datalogger readings at six timestamps 
 * @returns object with temperature, relative humidity and timestamp 
 */
const findReadingWithTimestamp = (ts, readings) => {
    let datum = (Date.parse(ts))/1000;
    for (let i = 0; i<readings.length; i++){
        if (readings[i].ts == datum) {
            return readings[i];
        }
    }
    throw "could not locate reading"
}


/**
 * 
 * @author Fabiola Badillo Ramos
 * @param {CalibrattionSess} calSessObj 
 * @param {DataloggerCalibrationReadings} calReadings 
 * @returns {tempOffset: Number, rhOffset: Number} 
 * offset for temperature measures and offset for relative humidity
 */
const calculateOffset = (calSessObj, calReadings) => {
    // deconstruct the calSess object
    let nomLowTemp = calSessObj.nom_low_temp;
    let nomMedTemp = calSessObj.nom_med_temp;
    let nomHighTemp = calSessObj.nom_high_temp;
    let nomLowRH = calSessObj.nom_low_rh;
    let nomMedRH = calSessObj.nom_med_rh;
    let nomHighRH = calSessObj.nom_high_rh;

    // deconstruct the calibration readings object
    let realLowTemp = calReadings.lowTemp;
    let realMedTemp = calReadings.medTemp;
    let realHighTemp = calReadings.highTemp;

    // average the differences 
    let tempOffset = ((nomLowTemp - realLowTemp) + (nomMedTemp - realMedTemp) + (nomHighTemp - realHighTemp)) / 3.0;

    // find each real reading for rh levels
    let realLowRH = calReadings.lowRh;
    let realMedRH = calReadings.medRh;
    let realHighRH = calReadings.highRh;

    let rhOffset = ((nomLowRH - realLowRH) + (nomMedRH - realMedRH) + (nomHighRH - realHighRH)) / 3.0;
        
    return {tempOffset: Math.round((tempOffset + Number.EPSILON) * 100)/100,
            rhOffset: Math.round((rhOffset + Number.EPSILON) * 100)/100}
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Number} prevOffset 
 * @param {Number} newOffset 
 * @returns boolean indicating if offset is inside tolerance range
 * placeholder function assuming only temperature measures are considered to update the offset
 * offset variation must not exceed 0.04F for temperature per year
 * offset variation must not exceed 0.25% for rh per year
 * 
 */
const isOffsetInTolerance = (prevOffset, newOffset) => {
    return !(Math.abs(prevOffset-newOffset) > 0.04)
}


/**
 * 
 * @author Fabiola Badillo Ramos
 * @param {CalibrationSess} calSessObj 
 * @param {DataloggerCalibrationReadings} calReadingsObj -- solo 6 readings
 *  let forCalibration = {
            lowTemp:null, 
            highTemp:null,
            medTemp:null,
            highRh:null,
            lowRh:null,
            medRh:null,
        }
 * @param {DataloggerProfile} dlProfObj 
 * edits the datalogger profile on the DL, it adds the new offset
 */
const updateDlProfile = async (calSessObj, calReadingsObj, dlProfObj) => {
    try{
        console.log('desde update dl profiule en el cal sess daos')
        console.log('lo que recibo')
        console.log(calSessObj)
        console.log(calReadingsObj)
        console.log(dlProfObj)

        // get new offset
        let offsets = calculateOffset(calSessObj, calReadingsObj);
        console.log('los offsets')
        console.log(offsets)

        let oldOffset = await reads.getDlOffset(dlProfObj);
        console.log('el offset viejo')
        console.log(oldOffset);

        // determine if new offset in tolerance
        let inTolerance = isOffsetInTolerance(oldOffset, offsets.tempOffset);
        // flag = 1;
        if (inTolerance){
            flag = 1;
        } else {
            flag = 0;
        }
        console.log('el flag de tolerance')
        console.log(flag)
        // update the profile to include tolerance status and new offset
        console.log('estamos en el dao')
        let r1 = await updates.editDLOffset(dlProfObj, offsets.tempOffset);
        console.log('el res de edit dl offset')
        console.log(r1)
        if (!r1) return false;
        let r2 = await updates.editDlToleranceFlag(dlProfObj, flag);
        console.log('el res de edit dl tolerance flag')
        console.log(r2)
        if (!r2) return false
        let r3 = await updates.matchDataloggerWithCalSess(dlProfObj, calSessObj, calReadingsObj);
        console.log('el res de match dataloggers con cal sess')
        console.log(r3)
        if (!r3) return false;
        return true
    }
    catch(e){
        console.error(e);
        return false;
    }
};


const getCalSessByPk = async (calSessPK) => {
    try{
        let getCalSessQuery = 'select * from Calibration_Sess where cal_id=?;';
        console.log(`id in dao ${calSessPK}`)
        let r = await runQuery(getCalSessQuery,[calSessPK]);
        console.log(r)
        return r
    }
    catch(e){
        console.error(e);
    }
}


const addOneYearToDate = (date) => {
    let year = parseInt(date.getFullYear());
    let mon = parseInt(date.getMonth())
    let day = parseInt(date.getDate())
    year = year+1;
    // console.log(new Date(year, mon, day))
    return (new Date(year, mon, day))
}


/**
 * 
 * @param {String} dlName 
 * @returns 'not calibrated' if the datalogger does not have a calibration session on the system or the calibration due date
 */
const getCalDateDueDateForDatalogger = async (dlName) => {
    try{
        let dlRes = await reads.getDlByName(dlName);
        let dlPK = dlRes[0].dl_id;

        // look for the dlPK in calibrates
        let calibratesQuery = 'select * from Calibrates where dl=?;'
        let calibrateRes = await runQuery(calibratesQuery, [dlPK]);
        if (calibrateRes.length == 0){
            return 'not calibrated'
        }
        else{
            let index = calibrateRes.length-1;
            let calDate = calibrateRes[index].cal_date;
            let calDueDate = addOneYearToDate(new Date(calDate));
            // console.log(calDueDate);
            return calDueDate.toDateString().slice(4,16);
        }
    }
    catch(e){
        console.error(e);
    }
}


// ----------- TEST ------------
let CalibrationSess = {
    nistManuf: 'VAISALA',
    nistNumber : 'NIST NUMBER 1',
    nistModel : 'NIST MODEL 1',
    nistSerNum : 'SER NUM 1',
    nom_low_temp : 20.5,
    lowTempTs : '2021-01-01 12:30:00',
    nom_med_temp : 85.3,
    medTempTs : '2021-01-01 14:30:00',
    nom_high_temp : 133.9,
    highTempTs : '2021-01-01 16:30:00',
    lowRh : 15.3,
    lowRhTs : '2021-09-09 02:30:00',
    medRh : 47.8,
    medRhTs : '2021-01-01 04:30:00',
    highRh : 68.7,
    highRhTs : '2021-01-01 06:30:00'
}

// get readings sent from the FE in the following format
const readings = {readings:[
    {temp: 20.5, rh: 23, ts:1609518600},
    {temp: 85.35, rh: 24, ts:1609525800},
    {temp: 133.9, rh: 25, ts:1609533000},
    {temp: 24, rh: 26, ts:1631169000},
    {temp: 25, rh: 27, ts:1609489800},
    {temp: 26, rh: 28, ts:1609497000}
]}

let dl1 = {
    dlName : '120',
    dlSerialNumber: 'nvkfjnwcvoi',
    dlOffset: 4.5
}

// const test1 = async () => {
//     const res = await getCalSessByPk(1);
//     console.log(res);
// }
// test1();


let calReadings = {
    lowTemp:20,
    highTemp:60,
    medTemp:40,
    highRh:60,
    lowRh:20,
    medRh:40,
}

let calSess = {
    nistManuf : 'vaisala',
    nistNumber : 'nist number 1',
    nistModel : 'nist model 1',
    nistSerNum : 'ser num 1',
    lowTemp : 20.3,
    lowTempTs : new Date(2021, 9, 29, 12), // '2021-10-29 12:00:00'
    medTemp : 86.3,
    medTempTs : '2021-01-01 14:00:00',
    highTemp : 132.6,
    highTempTs : '2021-01-01 16:00:00',
    lowRh : 12.3,
    lowRhTs : '2021-09-09 02:00:00',
    medRh : 46.5,
    medRhTs : '2021-01-01 14:00:00',
    highRh : 67.3,
    highRhTs : '2021-01-01 16:00:00'
}

let dl = {
    dlName: '14',
    dlSerialNumber: 'rt8b1w78c63',
    dlOffset: 1.9
}

// let s = updateDlProfile(calSess, calReadings, dl);
// console.log(s)

// const testing = async () =>{
//     let s = await getCalDateDueDateForDatalogger('12');
//     console.log(s);
// }
// testing();


module.exports = {
    updateDlProfile ,
    getCalSessByPk,
    calculateOffset,
    isOffsetInTolerance,
    update,
    getCalDateDueDateForDatalogger
}
// updateDlProfile(CalibrationSess, readings.readings, dl)