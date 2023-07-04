/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const {  DataloggerProfile } = require('./models/objects/DataloggerProfile');
const {StudyHandler, Study} = require('./models/StudyHandler')
const {DataloggerHandler} = require('./models/DataloggerHandler');
const { Reporter } = require('./models/objects/Reporter');


var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { ClientHandler } = require('./models/ClientHandler');
const { ReporterHandler } = require('./models/ReporterHandler');
const{CalibrationHandler} = require('./models/CalibrationHandler');
const { Client } = require('./models/objects/Client');
const { CalibrationSess } = require('./models/objects/CalibrationSess')


// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header('Access-Control-Allow-Methods', '*');  
  next()
});



/**
 * Controller for Study
 * 
 * Gets
 * - getStudiesByClient
 * - getStudiesByReporter
 * - getAllStudies
 * 
 * Posts
 * - Create Study 
 * - Attach DL 
 * 
 * Updates
 * - Take DL out of Study 
 * - Change Reporter ? 
 * - Change Programming params (take out every single DL from study ?)
 * 
*/

//GET 

app.get('/study/getStudiesByClient' ,  (req , res)=> {
  StudyHandler.getStudiesPerClient(req.query.client_name).then(studies => {
    res.json({studies})
  })
  
})

app.get('/study/getStudiesPerReporter' , (req , res)=> {
  StudyHandler.getStudiesPerReporter(req.query.employeeId).then( studies => res.json({studies:studies}))
})

app.get('/study/getByName' , (req , res)=> {
  StudyHandler.getByName(req.query.study).then(s => res.json({study:s}))
})

app.get('/study/getAll',(req , res) => {
  StudyHandler.getAll().then(studies => {
    res.json({studies})
  })
})

app.get(`/study/getReadingsOutOfRange` , (req , res) => {
  
  StudyHandler.getReadingsOutOfRange(JSON.parse(req.query.study)) //.then(r => res.json({readings:r}))
  .then((r)=>{
    res.json({readings:r})
  })
})

app.get('/study/getZonesWithReadingsOutOfRange' , (req , res) => {
  StudyHandler.getZonesWithReadingsOutOfRange(req.query.study).then(zoneList => res.json({zoneList}))
})

app.get('/study/getReadingsForZone' , (req , res) => {
  StudyHandler.getReadingsForZone(JSON.parse(req.query.study) , req.query.zone).then(readings => { res.json({readings}) })
})

app.get('/study/getDataloggerToZone' , (req , res) => {
  console.log(JSON.parse(req.query.study))
  StudyHandler.getDataloggerToZoneForCleanroom(JSON.parse(req.query.study)).then(mappings => res.json({mappings}))
})

app.get(`/study/getZoneReadingsForOutOfRange` , (req , res) => {
  StudyHandler.getZoneReadingsForOutOfRange(JSON.parse(req.query.study)).then(r => {
    res.json({zoneReadings:r})
  });
})

app.get(`/study/getZonesForStudy` , (req , res) => {
  StudyHandler.getZonesForStudy(JSON.parse(req.query.study)).then( r => res.json({zones:r}))
})

app.get(`/study/getNumberOfZonesInStudy` , (req , res) => {
  console.log('hosting')
  console.log(req.query)
  StudyHandler.getNumberOfZonesInStudy(JSON.parse(req.query.study)).then( r => {
    res.send(r)})
})


app.get(`/study/getFormatedReadingsPerZone`, (req, res) => {
  StudyHandler.getReadingsPerZone(JSON.parse(req.query.study))
  .then(r => {
    res.json({zoneReadings:r})
  })
})

app.get(`/study/getStudiesByReporterComplete`,(req , res)=>{
  
  StudyHandler.getStudiesByReporterComplete(req.query.employeeId).then(studies =>{ 
    res.json({studies})})
})


app.get(`/study/formatDataForDataPerZoneView`, (req,res) => {
  console.log("QUE PQ SOY TAN LENTO?")
  StudyHandler.formatDataForDataPerZoneView(JSON.parse(req.query.study))
  .then(r=>res.send(r));
})

/**
 * returns an object with the analytics per zone
 */
app.get('/study/getAnalyticsPerZone' , (req , res) => {
  StudyHandler.getAnalyticsPerZone(JSON.parse(req.query.study)).then(analytics => res.json({zoneSummariesList:analytics}))
})

app.get('/study/getDataloggersInStudy' , (req , res) => {
  StudyHandler.getDataloggersPerStudy(JSON.parse(req.query.study)).then(dataloggers => {
    console.log('From app',dataloggers)
    res.json({dataloggers})
  })
})

app.get('/study/getStudyForApproverPage', (req, res) => {
  StudyHandler.getStudyForApproverPage().then(studies =>res.json(studies));
})

app.get('/study/getStudyById', (req, res) => {
  StudyHandler.getStudyById(req.query.id).then(r=>{
    res.json({r})});
})

app.post('/study/changeStatus' , (req , res ) => {
  StudyHandler.updateStatus(req.body.study_id , req.body.status ).then(r => res.send(r))
})

/**
 * Calibration Session
 */
app.get('/calSess/getAll', async (req, res) => {
  let calSess = await CalibrationHandler.getAllCalSess();
  res.json({calSess})
})

app.post('/calSess/newCalSess',(req , res) => {
  CalibrationHandler.addNewCalSess((req.body.calSess))
  .then(r=>res.send(r))
})

app.get('/calSess/getReport' , (req , res) => {
  console.log(req.query.dlName)
  CalibrationHandler.getReportInfo(req.query.dlName).then( r=> res.json( {info:r} ) )
})



//POSTS

app.post('/study/update' , (req , res) => {
  StudyHandler.update(req.body.study).then(r => res.send(r))
})

app.post('/study/create' , (req ,  res) => {
  StudyHandler.create(new Study(req.body.study) , new Reporter(req.body.reporter)).then(r => res.send(r))
})

app.post('/study/attachDatalogger',(req , res) => {
  StudyHandler.attachDatalogger(new Study(req.body.study) , new DataloggerProfile(req.body.datalogger)).then(r=>res.send(r))
  // res.json(study)
})

app.post('/study/attachDataloggerToZone' , (req , res) => {
  StudyHandler.attachDataloggerToZone(req.body.zone , req.body.datalogger , req.body.study).then(r => res.send(r))
})

app.post('/study/insertReadings', (req , res) => {
  DataloggerHandler.addReadings(req.body.readings , req.body.datalogger , req.body.study).then(r => {
    res.send(r)
  })
})

app.post('/study/insertBulkReadings' , (req , res) => {
  DataloggerHandler.insertBulkReadings(req.body.readings , req.body.study , req.body.datalogger).then(r => res.send(r))
})

app.post(`/study/updateStudyProgramConfigurations` , (req  , res) => {
  return StudyHandler.addProgramParametersToStudy(req.body.study , req.body.configurations).then(r => res.send(r))
})

/**
 * Datalogger Controller
 * 
 * Gets
 * - Get All
 * - Get By Name 
 * - Get current study ? 
 * 
 */

app.post('/datalogger/create' , (req , res) => {
  DataloggerHandler.create(new DataloggerProfile(req.body.datalogger))
  .then(r =>res.send(r))
})
    

// app.post('/datalogger/setCalibration' , (req , res) => {
//   DataloggerHandler.setCalibrationz(req.params.offset , new DataloggerProfile(req.params.datalogger))
//     .then(wasSet => {res.send(wasSet)})
// })

app.get('/datalogger/getAll' , (req , res) => {
  DataloggerHandler.getAll().then(dls => res.json({dataloggers:dls}))
})

app.get('/datalogger/getByName' ,(req , res) => {
  DataloggerHandler.getDataloggerByName(req.query.name).then((dl) => {
    res.json({datalogger:dl})
  })
})

app.get('/datalogger/getByClient' , (req , res) => {
  DataloggerHandler.getDataloggerPerClient(req.query.clientName).then(dls => {
    res.json({dataloggers:dls})
  })
})


/**
 * posts
 */

app.post('/datalogger/create' , (req , res) => {
  DataloggerHandler.create(new DataloggerProfile(req.body.datalogger)).then(r => res.send(r))
})



/**
 * updates 
 */

app.post('/calSess/calibrate' , (req , res) => {
  DataloggerHandler.calibrate(new DataloggerProfile({dlName:req.body.datalogger.dlName}) , req.body.calibrationSessionId , req.body.forCalibration).then( r => {
    console.log('desde el app')
    console.log(req.body.forCalibration);
    res.send(r)})
}) 


app.put('/datalogger/changeName' , (req , res) => {
  return DataloggerHandler.changeName(req.body.datalogger , req.body.name)
})



/**
 * Calibraon Controller 
 * 
 */

app.get('/calSess/getById',(req , res) => {
  CalibrationHandler.getById(req.query.id).then(calSess => res.json(calSess))
})

app.put(`/calSess/update`, (req , res) => {
  CalibrationHandler.update(new CalibrationSess(req.body.calibrationSession)).then(r => res.send(r))
})
/**
 * User Controllers
 */

/**
 * 
 */

app.get('/users/getAllStudiesForClient', (req, res) => {
  ClientHandler.getAllStudiesFromClient(req.query.clientName)
  .then(r=>{res.json(r)});
})

app.get('/users/getAllClients' , (req , res) => {
  ClientHandler.getAll().then(r => res.send(r))
})

app.get('/users/getClientByName', (req, res) => {

  ClientHandler.getClientByName(req.query.clientName).then(client => {

    res.json({client})
  });
})

app.get(`/users/isEmployeeAuthorized` , (req , res) => {
  ReporterHandler.isEmployeeAuthorized(req.query.employeeId).then(r => {
    res.send(r)})
})

app.get('/users/getAllReporters', (req, res) => {
  ReporterHandler.getAllReporters().then(r=>res.send(r));
})

app.get('/users/getAllClientsForApprover', (req, res) => {
  ClientHandler.getAllClientsForApprover().then(r=>res.send(r));
})

app.post('/users/insertClient' ,(req , res)=> {
  ClientHandler.create(req.body.client).then(r => res.send(r))
})

app.post('/users/assignRole' , (req , res) => {
  ReporterHandler.assignRole(req.body.id, req.body.role).then(r => res.send(r))
})

app.post('/users/changeReporterStatus' , (req , res) => {
  ReporterHandler.updateAcctStatus(req.body.id, req.body.status).then(r => res.send(r))
})

app.post('/users/changeClientStatus' , (req , res) => {
  ClientHandler.updateAcctStatus(req.body.id, req.body.status).then(r => res.send(r))
})

app.post('/users/insertReporter' ,(req , res)=> {
  ReporterHandler.create(req.body.reporter).then(r => res.send(r))
})

app.post('/users/insertApprover', (req, res) => {
  ReporterHandler.addApprover(req.body.approver).then(r=>res.send(r));
})

app.listen(4000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
