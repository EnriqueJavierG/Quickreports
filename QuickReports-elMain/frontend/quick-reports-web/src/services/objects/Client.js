/**
 * @author Pablo A Santiago Uriarte
 * 
 * @param {{clientName:String, email:String, telephone:String with numerical characters}} 
 * clientName is the company name
 */

let Client = function (params){
    this.clientName = params.clientName;
    this.email = params.email;
    this.telephone = params.telephone;
}
// export {Client}
module.exports ={Client}