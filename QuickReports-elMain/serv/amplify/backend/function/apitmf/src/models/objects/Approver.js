/**
 * @author Fabiola Badillo Ramos
 * 
 * @param {{approverFname:String , approverLname:String , approverEmployeeId:String}} 
 */

let Approver = function (params){
    this.approverFname = params.approverFname;
    this.approverLname = params.approverLname;
    this.approverEmployeeId = params.approverEmployeeId;
}

module.exports = {Approver}