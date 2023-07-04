const reads = require('../daos/reads')
const inserts = require('../daos/inserts')
const updates = require('../daos/updates')
const {Client} = require('./objects/Client')
/**
 * Reporter handler class
 */
class ClientHandler {

    /**
     * @param {Client} client 
     * @returns 
     */
    static create = (client) => {
        return inserts.insertClient(client).then(()=>true)
                                            .catch(()=>false)
    }

    /**
     * 
     * @param {String} name 
     * @returns the client information on the specified client
     */
    static getClientByName = (name) => {
        return reads.getClientByName(name).then(clients => {
            console.log(clients)
            if(clients.length > 0){
                return clients[0]
            }
            else{
                throw "not found"
            }
        }).catch((e) => console.error(e))
    }

    /**
     * 
     * @returns all clients on the system 
     */
    static getAll = () => {
        return reads.getAllClients().then(clients => {
            return clients.map(client => new Client(client))
        }).catch((e) => console.error(e))
    }

    /**
     * 
     * @param {Client} client 
     * @param {Number} status 
     * @returns boolean indicating if the operation was successful
     */
    static updateAcctStatus = (client , status) => {
        if(status == 0 || status == 1 || status==2){
            return updates.editClientAccountStatus(client , status)
        }
        throw "Not a valid status" 
    }

    /**
     * 
     * @param {Number} status 
     * @returns string representing status to display on FE
     */
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

    /**
     * 
     * @returns all clients assigned to the approver
     * in the beta versions there will be only one approver
     */
    static getAllClientsForApprover = () => {
        return reads.getAllClientsForApprover().then(clients => {
            let c = [];
            for (let i = 0; i < clients.length; i++){
                c.push(
                    {
                        id: clients[i].c_id,
                        company: clients[i].c_name,
                        phone: clients[i].phone_num,
                        // requestedProject: `${clients[i].c_name} ${clients[i].req_date.toUTCString().slice(4,16)} ${clients[i].s_cleanroom}`,
                        email: clients[i].email_address,
                        accountStatus: this.accountStatus(clients[i].c_account_status),
                        actions: '1'
                    }
                )
            }
            return c
        }).catch((e)=>console.error)
    }

    /**
     * 
     * @param {Number} status 
     * @returns Status string of the study progress
     */
    static determineStatus = (status) => {
        // * 0 - created
        // * 1 - agreement form completed
        // * 2 - study in progress
        // * 3 - pending approval
        // * 4 - approved
        // * 5 - not approved
        switch(status){
            case 0:
                return "Created";
            case 1:
                return "Agreement Form Completed";
            case 2:
                return "In Progress";
            case 3:
                return "Pending Approval";
            case 4:
                return "Approved";
            case 5: 
                return "Not Approved";
            default:
                return "cannot be determined"
        }
    }

    /**
     * 
     * @param {String} clientName 
     * @returns all studies associated to the client that are present on the system
     */
    static getAllStudiesFromClient = (clientName) => {
        return reads.getStudiesPerClient(clientName).then(studies => {
            let s = {};
            for (let i=0; i<studies.length; i++){
                let reqDate = studies[i].req_date.toUTCString().slice(4,16);
                s[studies[i].s_id]={
                    projectName: `${studies[i].c_name} ${reqDate} ${studies[i].s_cleanroom}`,
                    studyID: studies[i].s_id,
                    status: this.determineStatus(studies[i].s_status),
                    dlQty: studies[i].s_dl_quantity
                };
            }
            return s
        });
    }

}

module.exports= {ClientHandler}