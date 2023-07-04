// development environment
// const {runQuery} = require('../database')

// Testing environment
const {runQuery} = require('../testing/DaoTesting/databaseTestingInstance');

const reads = require('./reads');


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns maximum temperature per zone for study
 */
const getMaxTempByZoneForStudy = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let maxTempPerZoneQuery = 'select max(r_temp) max_temp_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(maxTempPerZoneQuery, [studyPK]);
    } 
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns minimum temperature per zone for study
 */
const getMinTempByZoneForStudy = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let minTempPerZoneQuery = 'select min(r_temp) min_temp_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(minTempPerZoneQuery, [studyPK]);
    }
    catch(e) {
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns average temperature per zone for study
 */
 const getAvgTempByZoneForStudy = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let avgTempPerZoneQuery = 'select avg(r_temp) avg_temp_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(avgTempPerZoneQuery, [studyPK]);
    } 
    catch(e) {
        console.error(e);
    }
};



/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns maximum relative humidity per zone for study
 */
 const getMaxRHByZoneForStudy = async (studyObj) => {
    try{
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let maxRHPerZoneQuery = 'select max(r_rh) max_rh_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(maxRHPerZoneQuery, [studyPK]);
    } 
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns minimum relative humidity per zone for study
 */
 const getMinRHByZoneForStudy = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let minRHPerZoneQuery = 'select min(r_rh) min_rh_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(minRHPerZoneQuery, [studyPK]);
    } 
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns average relative humidity per zone for study
 */
 const getAvgRHByZoneForStudy = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // run query
        let avgRHPerZoneQuery = 'select avg(r_rh) avg_rh_per_zone, zone_number, s_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(avgRHPerZoneQuery, [studyPK]);
    }
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns analytics per study, max, min and avg for temperatures and relative humidity
 */
 const getAnalyticsPerZone = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = new Date(studyObj.requestDate);
        console.log(clientName)
        console.log(cleanroomName)
        console.log(reqDate)
        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate.toISOString().slice(0,10));
        let studyPK = studyRes[0].s_id;

        // run query
        let getAnalyticsPerZoneQuery = 'select zone_number, round(avg(r_temp),1) as avg_temp_per_zone, \
        round(min(r_temp),1) as min_temp_per_zone,  round(max(r_temp),1) as max_temp_per_zone, round(avg(r_rh),1) as avg_rh_per_zone, \
        round(min(r_rh),1) as min_rh_per_zone, round(max(r_rh),1) as max_rh_per_zone, s_id, dl_ID_number, dl_id \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? \
        group by zone_number order by zone_number;';
        return await runQuery(getAnalyticsPerZoneQuery, [studyPK]);
    } 
    catch(e){
        console.error(e);
    }
};


/**
 * @author Fabiola Badillo Ramos
 * @param {Study} studyObj 
 * @returns all the readings that are outside the range for the study alarms
 */
const getReadingsOutOfRange = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = new Date(studyObj.requestDate);

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate.toISOString().slice(0,10));
        let studyPK = studyRes[0].s_id;
        // get readings per study that are out of range
        let dataOutOfRangeQuery = 'select zone_number, dl_ID_number, r_ts, r_temp, r_rh \
        from Readings inner join Datalogger on Readings.dl = Datalogger.dl_id \
        inner join Participates on Datalogger.dl_id = Participates.dl \
        inner join Study on Participates.study = Study.s_id \
        where s_id = ? and (r_temp > s_max_temp or r_temp < s_min_temp or r_rh > s_max_rh or r_rh < s_min_rh);';
        return await runQuery(dataOutOfRangeQuery, [studyPK]);
    }
    catch(e){
        console.error(e);
    }
};


const getReadingsCloseToRange = async (studyObj) => {
    try {
        // deconstructing object 
        let clientName = studyObj.clientName;
        let cleanroomName = studyObj.cleanroomName;
        let reqDate = studyObj.requestDate;

        // find PK for study
        const studyRes = await reads.getStudyByClientCleanroomReqDate(clientName, cleanroomName, reqDate);
        let studyPK = studyRes[0].s_id;

        // // get limits for study profile
        // let max_temp = studyRes[0].s_max_temp-1;
        // let min_temp = studyRes[0].s_min_temp+1;
        // let max_rh = studyRes[0].s_max_rh-0.5;
        // let min_rh = studyRes[0].s_min_rh+0.5;

        // get readings per study that are out of range
        let closeToRangeQuery = 'select r_ts, r_temp, r_rh, dl, s_id, s_max_temp \
        from Readings inner join Study on Readings.study=Study.s_id \
        where s_id=? \
        and (r_temp=s_max_temp or r_temp=s_max_temp-1 or r_temp=s_min_temp or r_temp=s_min_temp+1 \
        or r_rh=s_max_rh or r_rh=s_max_rh-0.5 or r_rh=s_min_rh or r_rh=s_min_rh+0.5);';
        return await runQuery(closeToRangeQuery, [studyPK]);
    }
    catch(e){
        console.error(e);
    }
};

// ----------- TEST ------------------

let study = {
    studyId: 0,
    clientName: 'Prueba de Aggregates',
    requestDate: '2021-03-31',
    description: 'desc',
    dataloggersQty: 4,
    dataloggers: [],
    cleanroomName: 'Cuarto limpio'
};

// getReadingsOutOfRange(study);

// const test1 = async () => {
//     const res = await getReadingsCloseToRange(study);
//     console.log(res);
// }
// test1();

module.exports = { // all in study
    getMaxTempByZoneForStudy,
    getMinTempByZoneForStudy,
    getAvgTempByZoneForStudy,
    getMaxRHByZoneForStudy,
    getMinRHByZoneForStudy,
    getAvgRHByZoneForStudy,
    getAnalyticsPerZone,
    getReadingsOutOfRange,
    getReadingsCloseToRange
}