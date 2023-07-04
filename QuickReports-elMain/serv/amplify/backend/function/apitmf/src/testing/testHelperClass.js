const { flushClients, flushPhone, flushEmail, flushReporter, flushApprover,
    flushCalSess, flushWorksOn, flushDatalogger, flushCalibrates, flushStudy,
    flushReadings, flushValidates, flushApproves, flushParticipates,
    flushRequests } = require('./flushDbTables');

class TestHelper{
    /**
     * deletes the data from the testing database
     */
    static flushAllTables = async () =>{
        flushClients();
        flushPhone();
        flushEmail(); 
        flushReporter();
        flushApprover();
        flushCalSess();
        flushWorksOn();
        flushDatalogger();
        flushCalibrates();
        flushStudy();
        flushReadings();
        flushValidates();
        flushApproves();
        flushParticipates();
        await flushRequests();
    }
    static round = (value, decimals) => {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
}
module.exports={TestHelper}