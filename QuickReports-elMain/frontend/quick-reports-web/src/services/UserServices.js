const axios = require('axios')
const { Client } = require('./objects/Client')
const { Study } = require('./objects/Study')
const baseUrl = 'http://localhost:4000/users'
// const baseUrl = 'https://e797ohq9qg.execute-api.us-east-1.amazonaws.com/staging/users'
class UserServices{

    /**
     * Client Services
     */

    /**
     * @param {Client} client
     * @returns {Promise<boolean>}
     */
    static createNewClient = (client) => {
        return axios.post(`${baseUrl}/insertClient` , {
            client:{...client}
        }).then(res => res.data)
    }

    /**
     * @param {number} id
     */
    static isEmployeeAuthorized = (id) => {
        return axios.get(`${baseUrl}/isEmployeeAuthorized`, {
            params:{
                employeeId:id
            }
        }).then(r => r.data)
    }

    
    /**
     * @param {string} clientName
     * @return {Promise<Client>}
     */
    static getClientByName = (clientName) => {
        return axios.get(`${baseUrl}/getClientByName` , {
            params:{
                clientName
            }
        }).then(resp => {
            return (resp.data.client)
        })
    }

    static isClientAuthorized = async (clientName) => {
        let client = await this.getClientByName(clientName)
        let result = client.c_account_status == 1
        return result
        // return  this.getClientByName(clientName).then(client => {
        //     console.log('entre a isclientaith.then')
        //     console.log(client)
        //     return client.c_account_status == 1
        // })
    }


    /**
     * @returns {Promise<Client[]>}
     */
    static getAllClients = () => {
        return axios.get(`${baseUrl}/getAllClients`).then(resp => {
            return resp.data.clients.map(cl => new Client(cl))
        })
    }

    static updateClientAccountStatus = (client , status ) => {
        return axios.post(`${baseUrl}/changeClientStatus` , {client:{...client} , status}).then(r => r.data)
    }

    /**
     * Reporter Services
     */

    /**
     * @param {Reporter}
     * @return {Promise<boolean>}
     */
    static createNewReporter = (reporter) => {
        // console.log('HOLA DESDE SERVICES')
        return axios.post(`${baseUrl}/insertReporter` , {
            reporter
        }).then(resp => resp.data)
    }

    static createNewApprover = (approver) => {
        // console.log('HOLA DESDE SERVICES')
        return axios.post(`${baseUrl}/insertApprover`, {
            approver
        }).then(resp => resp.data);
    }

    static assignRole = (reporter , role) => {
        return axios.post(`${baseUrl}/assignRole`, {reporter , role}).then(r => r.data)
    }

    static updateReporterAccountStatus = (reporterPK , status ) => {
        return axios.post(`${baseUrl}/changeReporterStatus` , {id: reporterPK, status}).then(r => r.data)
    }

    static updateClientAccountStatus = (clientPK, status ) => {
        return axios.post(`${baseUrl}/changeClientStatus` , {id: clientPK, status}).then(r => r.data)
    }

    static getAllReporters = () => {
        return axios.get(`${baseUrl}/getAllReporters`).then(r => {
            return r.data;
        })
    }

    static getAllClientsForApprover = () => {
        return axios.get(`${baseUrl}/getAllClientsForApprover`)
        .then(r=>{
            return r.data;
        })
    }

    static getAllStudiesForClient = (clientName) => {
        return axios.get(`${baseUrl}/getAllStudiesForClient`, {params:{clientName}})
        .then(resp => {
            return resp.data;
        });
    }

}

// export  {UserServices}
module.exports = {UserServices}