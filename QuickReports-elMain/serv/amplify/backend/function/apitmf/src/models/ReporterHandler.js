const reads = require('../daos/reads')
const inserts = require('../daos/inserts')
const updates = require('../daos/updates')
const Reporter = require('../models/objects/Reporter')
/**
 * Reporter handler class
 */
class ReporterHandler {

    /**
     * 
     * @param {Reporter} reporter 
     * @returns 
     */
    static create = (reporter) => {
        return inserts.insertReporter(reporter)
    }

    static addApprover = (approver) => {
        return inserts.insertApprover(approver);
    }

    static assignRole  = (reporter , role) => {
        if(role == 'calibrate' || role == 'validate'){
            return updates.editReporterRole(reporter , role)
        }
        throw `${role} is not a valid role`
    }

    static updateAcctStatus = (reporter , status) => {
        if(status == 0 || status == 1 || status == 2){
            return updates.editReporterAccountStatus(reporter , status)
        }
        throw "Not a valid status" 
    }

    static determineRole = (validate) => {
        if (validate == 1){
            return 'validate';
        }
        else{
            return 'calibrate';
        }
    }

    static isEmployeeAuthorized = (id) => {
        return reads.getReporterByEmployeeId(id).then(resp => {
            if(resp.length == 0 )return false;
            return resp[0].r_account_status == 1
        })
    }

    static accountStatus = (status) => {
        if (status == 0){
            return "pending authorization";
        }
        else if (status == 1){
            return "authorized";
        }
        else if (status == 2){
            return "not authorized";
        }
        else{
            return "cannot be determined";
        }
    }

    static getAllReporters = () => {
        return reads.getAllReporters().then(reporters => {
            let reps = [];
            for(let i = 0; i<reporters.length; i++){
                reps.push(
                    {
                        id: reporters[i].r_id,
                        reporter: `${reporters[i].r_first_name} ${reporters[i].r_last_name}`,
                        employeeId: reporters[i].r_employee_id,
                        role: this.determineRole(reporters[i].r_can_validate),
                        accountStatus: this.accountStatus(reporters[i].r_account_status),
                        actions: '1'
                    }
                )
            }
            return reps;
        }).catch((e) => console.error(e));
    };


}

module.exports= {ReporterHandler}