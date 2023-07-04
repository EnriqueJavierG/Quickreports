// import addon from '../c++/build/Release/addon';
// import express from 'express';
// const express = require('express')
var addon = require('../c++/build/Release/addon');
const express = require('express')
const app = express()
const port = 4001
const cors = require('cors')
const open = require('open')
const baseUrl = `http://localhost:${port}`
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

// const app = express()
// const port = 3000

const sleep = (ms) => {
    return new Promise((resolve)=>{
        setTimeout(resolve , ms)
    })
}

app.get('/getFake' , (req , res) => {

    let details = {
        readings:[
                        
        ],
        
        configurationBlock:{name:'166'}
    }
    for(let i =0 ; i <= 2000; i++){
        details.readings.push({
            
            temp:90+ Math.random()*10,
            rh:Math.random()*78,
            ts:new Date(2021 , 2, 1, 2).getTime()/1000
            
        })
    }
    res.json(details)
})

app.get('/getDatalogger',  (req , res) => {
    console.log('initiated get datalogger')
    let resp = {};
    let NumReadings = req.query.rQty;
    let blocksToRead = Math.ceil(NumReadings/256)
    try{
        resp.configurationBlock = addon.getConfigurationBlock();
        while(resp.configurationBlock.type!=3 && resp.configurationBlock.type!=12 && resp.configurationBlock.type!=13 && resp.configurationBlock.serial_number!=0){
            resp.configurationBlock = addon.getConfigurationBlock();  
        }
        resp.readings = addon.getReadings(blocksToRead);
    }catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
        return;
    }
    resp.configurationBlock.name = resp.configurationBlock.name.replace(/\0[\s\S]*$/g,'');
    resp.readings = resp.readings.slice(0 , NumReadings)
    res.json(resp);
})

app.get('/getConfigurationBlock', (req , res) => {
    console.log('initiated block get')
    var blockDL = {}
    try{
        blockDL = addon.getConfigurationBlock();
        while(blockDL.type!=3 && blockDL.type!=12 && blockDL.type!=13 && blockDL.serial_number!=0){
            blockDL = addon.getConfigurationBlock();  
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
        return;
    }
    blockDL.name = blockDL.name.replace(/\0[\s\S]*$/g,'');
    res.send(blockDL)
})

app.get('/readings', (req , res) => {
    console.log('initiated readings')
    // stop datalogger before extracting readings
    var blockDL;
    try{
        blockDL = addon.getConfigurationBlock();
        while(blockDL.type!=3 && blockDL.type!=12 && blockDL.type!=13 && blockDL.serial_number!=0){
            blockDL = addon.getConfigurationBlock();  
        }
        console.log('got the block in readings')
    

        // set the input flags for holding alarms
        let mask = 65024;
        let intermediateRes = blockDL.flagBits1 & mask;
        let newFlagBits1 = intermediateRes | 51;
        var blockNewValues = {
            flagBits1:newFlagBits1,
            startTimeOffset: 0
        }
        // funcion que me compare ambos blocks y asigne a blockDL lo adecuado
        blockDL.name = (blockNewValues.name) ? blockNewValues.name : blockDL.name
        blockDL.startHr = (blockNewValues.startHr || blockNewValues.startHr==0) ? blockNewValues.startHr : blockDL.startHr
        blockDL.startMin = (blockNewValues.startMin || blockNewValues.startMin==0) ? blockNewValues.startMin : blockDL.startMin
        blockDL.startSec = (blockNewValues.startSec || blockNewValues.startSec==0) ? blockNewValues.startSec : blockDL.startSec
        blockDL.startDay = (blockNewValues.startDay || blockNewValues.startDay==0) ? blockNewValues.startDay : blockDL.startDay
        blockDL.startMon = (blockNewValues.startMon || blockNewValues.startMon==0) ? blockNewValues.startMon : blockDL.startMon
        blockDL.startYear = (blockNewValues.startYear || blockNewValues.startYear==0) ? blockNewValues.startYear : blockDL.startYear
        blockDL.highAlarmLevel = (blockNewValues.highAlarmLevel || blockNewValues.highAlarmLevel==0) ? blockNewValues.highAlarmLevel : blockDL.highAlarmLevel
        blockDL.lowAlarmLevel = (blockNewValues.lowAlarmLevel || blockNewValues.lowAlarmLevel==0) ? blockNewValues.lowAlarmLevel : blockDL.lowAlarmLevel
        blockDL.sampleRate = (blockNewValues.sampleRate || blockNewValues.sampleRate==0) ? blockNewValues.sampleRate : blockDL.sampleRate
        blockDL.channel2highAlarm = (blockNewValues.channel2highAlarm  || blockNewValues.channel2highAlarm==0) ? blockNewValues.channel2highAlarm : blockDL.channel2highAlarm
        blockDL.channel2lowAlarm = (blockNewValues.channel2lowAlarm || blockNewValues.channel2lowAlarm==0) ? blockNewValues.channel2lowAlarm : blockDL.channel2lowAlarm
        blockDL.startTimeOffset = (blockNewValues.startTimeOffset || blockNewValues.startTimeOffset==0) ? blockNewValues.startTimeOffset : blockDL.startTimeOffset
        blockDL.flagBits1 = (blockNewValues.flagBits1 || blockNewValues.flagBits1==0) ? blockNewValues.flagBits1 : blockDL.flagBits1

        addon.program(blockDL);
        console.log('stopped')
        let readings = addon.getReadings(40);
        console.log('read readings')
        res.json({readings})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
        return;
    }
    
    

})

app.post('/program', (req , res) => {
    console.log(req.body);
    addon.program(req.body) ? res.send(true) : res.send(false);
})

app.get('/testProgram' , (req , res)=>{
    // var block = addon.getConfigurationBlock();
    let block = {
        // name: 'pablito',
        //startHr: 20,
        // startMin: 30,
        // startSec: 40,
        // startDay: 10,
        // startMon: 5, 
        // startYear: 29,
        // highAlarmLevel: 98,
        // lowAlarmLevel:57,
        // sampleRate:900,
        // channel2highAlarm: 12.5,
        // channel2lowAlarm: 15.5, 
        // startTimeOffset: 100
    }
    // while(block.type!=3 && block.type!=12 && block.type!=13 ){
    //     block = addon.getConfigurationBlock();  
    // }
    console.log(req.body)
    block = addon.encodeDecodeReturn(block);
    block.name = block.name.replace(/\0[\s\S]*$/g,'');
    res.json(block) 
})




app.get('/stopDatalogger', (req,res)=>{
    try{
        var blockDL = addon.getConfigurationBlock();
        while(blockDL.type!=3 && blockDL.type!=12 && blockDL.type!=13 ){
            blockDL = addon.getConfigurationBlock();  
        }
        var blockNewValues = {
            flagBits1:65026,
            startTimeOffset: 0
        }
        // funcion que me compare ambos blocks y asigne a blockDL lo adecuado
        blockDL.name = (blockNewValues.name) ? blockNewValues.name : blockDL.name
        blockDL.startHr = (blockNewValues.startHr || blockNewValues.startHr==0) ? blockNewValues.startHr : blockDL.startHr
        blockDL.startMin = (blockNewValues.startMin || blockNewValues.startMin==0) ? blockNewValues.startMin : blockDL.startMin
        blockDL.startSec = (blockNewValues.startSec || blockNewValues.startSec==0) ? blockNewValues.startSec : blockDL.startSec
        blockDL.startDay = (blockNewValues.startDay || blockNewValues.startDay==0) ? blockNewValues.startDay : blockDL.startDay
        blockDL.startMon = (blockNewValues.startMon || blockNewValues.startMon==0) ? blockNewValues.startMon : blockDL.startMon
        blockDL.startYear = (blockNewValues.startYear || blockNewValues.startYear==0) ? blockNewValues.startYear : blockDL.startYear
        blockDL.highAlarmLevel = (blockNewValues.highAlarmLevel || blockNewValues.highAlarmLevel==0) ? blockNewValues.highAlarmLevel : blockDL.highAlarmLevel
        blockDL.lowAlarmLevel = (blockNewValues.lowAlarmLevel || blockNewValues.lowAlarmLevel==0) ? blockNewValues.lowAlarmLevel : blockDL.lowAlarmLevel
        blockDL.sampleRate = (blockNewValues.sampleRate || blockNewValues.sampleRate==0) ? blockNewValues.sampleRate : blockDL.sampleRate
        blockDL.channel2highAlarm = (blockNewValues.channel2highAlarm  || blockNewValues.channel2highAlarm==0) ? blockNewValues.channel2highAlarm : blockDL.channel2highAlarm
        blockDL.channel2lowAlarm = (blockNewValues.channel2lowAlarm || blockNewValues.channel2lowAlarm==0) ? blockNewValues.channel2lowAlarm : blockDL.channel2lowAlarm
        blockDL.startTimeOffset = (blockNewValues.startTimeOffset || blockNewValues.startTimeOffset==0) ? blockNewValues.startTimeOffset : blockDL.startTimeOffset
        blockDL.flagBits1 = (blockNewValues.flagBits1 || blockNewValues.flagBits1==0) ? blockNewValues.flagBits1 : blockDL.flagBits1

        addon.program(blockDL);
        res.json(blockDL);
    }catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
        return;
    }
})

app.get(`/status`, (req , res) => {
    res.send(true)
})

app.post('/programDatalogger', (req,res)=>{
    console.log('trying to prog datalogger with')
    console.log(req.body)
    var blockDL = addon.getConfigurationBlock();
    while(blockDL.type!=3 && blockDL.type!=12 && blockDL.type!=13  && blockDL.serial_number!=0){
        blockDL = addon.getConfigurationBlock();  
    }

    // set the input flags for holding alarms
    let mask = 65024;
    let intermediateRes = blockDL.flagBits1 & mask;
    let newFlagBits1 = intermediateRes | 307;
    let blockNewValues =req.body;
    console.log('los new values')
    console.log(blockNewValues);
    // var blockNewValues = {
    //     // name: "171",
    //     startHr: 13,
    //     startMin: 20,
    //     startSec: 0,
    //     startDay: 24,
    //     startMon: 4, 
    //     startYear: 21,
    //     highAlarmLevel: 75,
    //     lowAlarmLevel:70,
    //     sampleRate:10,
    //     channel2highAlarm: 60,
    //     channel2lowAlarm: 30, 
    //     startTimeOffset: 0,
    //     flagBits1: newFlagBits1,
    //     inputType: 1
    // }

    // funcion que me compare ambos blocks y asigne a blockDL lo adecuado
    blockDL.name = (blockNewValues.name) ? blockNewValues.name : blockDL.name
    blockDL.startHr = (blockNewValues.startHr || blockNewValues.startHr==0) ? blockNewValues.startHr : blockDL.startHr
    blockDL.startMin = (blockNewValues.startMin || blockNewValues.startMin==0) ? blockNewValues.startMin : blockDL.startMin
    blockDL.startSec = (blockNewValues.startSec || blockNewValues.startSec==0) ? blockNewValues.startSec : blockDL.startSec
    blockDL.startDay = (blockNewValues.startDay || blockNewValues.startDay==0) ? blockNewValues.startDay : blockDL.startDay
    blockDL.startMon = (blockNewValues.startMon || blockNewValues.startMon==0) ? blockNewValues.startMon : blockDL.startMon
    blockDL.startYear = (blockNewValues.startYear || blockNewValues.startYear==0) ? blockNewValues.startYear : blockDL.startYear
    blockDL.highAlarmLevel = (blockNewValues.highAlarmLevel || blockNewValues.highAlarmLevel==0) ? blockNewValues.highAlarmLevel : blockDL.highAlarmLevel
    blockDL.lowAlarmLevel = (blockNewValues.lowAlarmLevel || blockNewValues.lowAlarmLevel==0) ? blockNewValues.lowAlarmLevel : blockDL.lowAlarmLevel
    blockDL.sampleRate = (blockNewValues.sampleRate || blockNewValues.sampleRate==0) ? blockNewValues.sampleRate : blockDL.sampleRate
    blockDL.channel2highAlarm = (blockNewValues.channel2highAlarm  || blockNewValues.channel2highAlarm==0) ? blockNewValues.channel2highAlarm : blockDL.channel2highAlarm
    blockDL.channel2lowAlarm = (blockNewValues.channel2lowAlarm || blockNewValues.channel2lowAlarm==0) ? blockNewValues.channel2lowAlarm : blockDL.channel2lowAlarm
    blockDL.startTimeOffset = (blockNewValues.startTimeOffset || blockNewValues.startTimeOffset==0) ? blockNewValues.startTimeOffset : blockDL.startTimeOffset
    blockDL.flagBits1 = (blockNewValues.flagBits1 || blockNewValues.flagBits1==0) ? blockNewValues.flagBits1 : blockDL.flagBits1
    blockDL.inputType = (blockNewValues.inputType || blockNewValues.inputType==0) ? blockNewValues.inputType : blockDL.inputType
    console.log('el que le voy a programar desde aca atras en el BE')
    console.log(blockDL)
    addon.program(blockDL);
    res.json(blockDL);
})

app.listen(port , async () => {
    console.log(`App started on ${port}`)
    // await open(`http://localhost:3000/login`)

})