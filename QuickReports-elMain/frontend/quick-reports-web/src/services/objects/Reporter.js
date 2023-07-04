/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{employeeId:String, fname:String, lname:String, role:String}} 
 * role must be either 'calibrate' or 'validate' 
 * if any other value is passed, it will assign the role as calibrate
 */
let Reporter = function(params){
    this.employeeId = params.employeeId
    this.fname = params.fname
    this.lname = params.lname
    this.role = params.role // 'validate' or 'calibrate'
}

// export {Reporter}
module.exports = {Reporter}