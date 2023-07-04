/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{clientName:String, email:String, telephone:String with numerical characters}} 
 * clientName is the company name
 */

let Client = function (params){
    // console.log(params)
    this.clientName = (params.clientName)? params.clientName : params.c_name;
    this.email = (params.email)? params.email : params.email_address;
    this.telephone = (params.telephone)?params.telephone:params.phone_num;
}

module.exports = {Client}