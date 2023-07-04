// Testing environment
const {runQuery} = require('./DaoTesting/databaseTestingInstance');

const flushClients = async () => {
    try{
        runQuery('truncate table Clients;');
    }
    catch(e){
        console.log(e);
    }
};

const flushPhone = async () => {
    try{
        runQuery('truncate table Phone;');
    }
    catch(e){
        console.log(e);
    }
}

const flushEmail = async () => {
    try{
        runQuery('truncate table Email');
    }
    catch(e){
        console.log(e);
    }
}

const flushReporter = async () => {
    try{
        runQuery('truncate table Reporter');
    }
    catch(e){
        console.log(e);
    }
}

const flushApprover = async () => {
    try{
        runQuery('truncate table Approver');
    }
    catch(e){
        console.log(e);
    }
}

const flushCalSess = async () => {
    try{
        runQuery('truncate table Calibration_Sess');
    }
    catch(e){
        console.log(e);
    }
}

const flushWorksOn = async () => {
    try{
        runQuery('truncate table Works_On');
    }
    catch(e){
        console.log(e);
    }
}

const flushDatalogger = async () => {
    try{
        runQuery('truncate table Datalogger');
    }
    catch(e){
        console.log(e);
    }
}

const flushCalibrates = async () => {
    try{
        runQuery('truncate table Calibrates');
    }
    catch(e){
        console.log(e);
    }
}

const flushStudy = async () => {
    try{
        runQuery('truncate table Study');
    }
    catch(e){
        console.log(e);
    }
}

const flushReadings = async () => {
    try{
        runQuery('truncate table Readings');
    }
    catch(e){
        console.log(e);
    }
}

const flushValidates = async () => {
    try{
        runQuery('truncate table Validates');
    }
    catch(e){
        console.log(e);
    }
}

const flushApproves = async () => {
    try{
        runQuery('truncate table Approves');
    }
    catch(e){
        console.log(e);
    }
}

const flushParticipates = async () => {
    try{
        runQuery('truncate table Participates');
    }
    catch(e){
        console.log(e);
    }
}

const flushRequests = async () => {
    try{
        runQuery('truncate table Requests');
    }
    catch(e){
        console.log(e);
    }
}

module.exports={
    flushClients, 
    flushPhone, 
    flushEmail, 
    flushReporter,
    flushApprover,
    flushCalSess,
    flushWorksOn,
    flushDatalogger,
    flushCalibrates,
    flushStudy,
    flushReadings,
    flushValidates,
    flushApproves,
    flushParticipates,
    flushRequests
};