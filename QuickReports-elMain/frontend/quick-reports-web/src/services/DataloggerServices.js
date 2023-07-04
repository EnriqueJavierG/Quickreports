const axios = require('axios')
const { DataloggerProfile } = require('./objects/DataloggerProfile')
const baseUrl = 'http://localhost:4000/datalogger'
// const baseUrl = 'https://e797ohq9qg.execute-api.us-east-1.amazonaws.com/staging/datalogger'
class DataloggerServices{
    
    /**
     * 
     * @param {DataloggerProfile} datalogger 
     * @returns {Promise<boolean>}
     */
    static create = (datalogger) => {
        return axios.post(`${baseUrl}/create` , {datalogger:{...datalogger}}).then(r => r.data)
    }
    
    /**
     * 
     * @returns {Promise<DataloggerProfile[]>}
     */
    static getAll = () => {
        return axios.get(`${baseUrl}/getAll`).then(r => {
            // return r.data.dataloggers.map(dl => new DataloggerProfile(dl))
            return r.data.dataloggers
        })
    } 

    /**
     * 
     * @param {string} name 
     * @returns {Promise<DataloggerProfile>}
     */
    static getByName = (name) => {
        return axios.get(`${baseUrl}/getByName` , {
            params:{
                name
            }
        }).then(r => {
            return new DataloggerProfile(r.data.datalogger)
        })
    }


    /**
     * @param {string} name
     */
    static setName = (datalogger , name)  => {
        axios.post(`${baseUrl}/changeName`, {datalogger:{...datalogger} , name}).then(r => r.data)
    }


}

// export  {DataloggerServices}
module.exports = {DataloggerServices}