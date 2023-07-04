
// data out of range
let readings = [{temp:23,rh:53,timestamp: new Date(2021, 8, 21, 1, 10), zone: 26},
                {temp:23,rh:55,timestamp: new Date(2021, 8, 21, 1, 15),zone: 26},
                {temp:23,rh:57,timestamp: new Date(2021, 8, 21, 1, 25),zone: 26}]

// --------------------------------------------------------------------------


// i receive from the backend the study object that contains the values for the study alarms
// receive from the backend the result in the following format
let study = {
  id: 1,
  clientName: 'Medtronic',
  requestDate: new Date(2021, 1, 1),
  maxTemp : 80,
  minTemp : 60,
  maxRH : 60,
  minRH : 55,
  dataloggersQty: 10,
  isApproved : 0, 
  cleanroomName : 'CR1', 
  samplingFrequency: 900,
  reporter_first_name : 'Fabiola',
  reporter_last_name : 'Badillo',
  status : 0,
  startDate: new Date(2021, 1, 2, 12),
  numberOfZones: 10,
  endDate: new Date(2021, 1, 4, 12)
}
/**
 * used in the following components: SummaryTable, StudyMetadata, Error log table
 */
let tempHighAlarm  = study.maxTemp;
let tempLowAlarm = study.minTemp;
let rhHighAlarm = study.maxRH;
let rhLowAlarm = study.minRH;
/**
 * used in the following components: StudyMetadata
 */
let numberOfZones = study.numberOfZones;

// ----------------------------------------------------------------

// todos los readings del estudio para todas las zonas
const getRhData = (readings) => {
  let res = []
  for (let i=0;i<readings.length;i++){
    res.push(
      {
        x:readings[i].timestamp,
        y:readings[i].rh
      }
    )
  }
  return res;
}
const errorRhData = getRhData(readings);

const getTempData = (readings) => {
  let res = []
  for (let i=0;i<readings.length;i++){
    res.push(
      {
        x:readings[i].timestamp,
        y:readings[i].temp
      }
    )
  }
  return res;
}
const errorTempData = getTempData(readings);

// const highlightErrors = (ds, max, min) => {
//   for (let i = 0; i<ds.length; i++){
//       if (ds[i].y > max || ds[i].y < min){
//           ds[i]['markerType'] = "cross";
//           ds[i]['color']="red"
//       }
//   }
// }
// highlightErrors(errorTempData, tempHighAlarm, tempLowAlarm);



let readingsForZonesThatHaveOutOfRangeValues = () => {
  let res = [];
  for (let i = 0; i < 100; i++){
    res.push(
      {
        temp: (Math.random() * ((tempHighAlarm+1) - tempLowAlarm) + tempLowAlarm),
        rh: (Math.random() * ((rhHighAlarm+1) - rhLowAlarm) + rhLowAlarm), 
        timestamp: new Date(2021, 0, 2, i, ((i*30)%60)),
        zone: (i%4)+1
      }
    )
  }
  return res;
}

let testData = readingsForZonesThatHaveOutOfRangeValues()
// console.log(testData)

// get readings by zone
const mimickBackendCall = (zoneNumber) => {
  let res = testData.filter(obj => {
    return obj.zone===zoneNumber
  })
  return res;
}

// recibo del backend una lista de zonas que tienen lecturas out of range
let zones = [1,2,3,4]

// le puedo pedir al backend la data de cada zona que estuvo out of range
const errorZoneReadings = (zones) => {
  let res = [];
  // let readings = [];
  for (let i=0;i<zones.length;i++){
    let readings = mimickBackendCall(zones[i])
    // getReadingsForZone(zones[i]) <- backend function
    res.push(
      {
      zoneNumber: zones[i],
      rhData: getRhData(readings),
      tempData: getTempData(readings)
      }
    )
  }
  return res;
}
const readingsFromErrorZones = errorZoneReadings(zones);
// console.log(readingsFromErrorZones);

/**
 * used in the following components: error log table
 */
// const readingsFromErrorZones = {
//     zones: [{
//         zoneNumber: 1,
//         rhData: rhData,
//         tempData: tempData
//     },{
//         zoneNumber: 2,
//         rhData: rhData2,
//         tempData: tempData2
//     },
//     {
//         zoneNumber: 3,
//         rhData: rhData3,
//         tempData: tempData3
//     },
//     {
//         zoneNumber: 5,
//         rhData: rhData,
//         tempData: tempData
//     },{
//         zoneNumber: 6,
//         rhData: rhData2,
//         tempData: tempData2
//     },
//     {
//         zoneNumber: 7,
//         rhData: rhData3,
//         tempData: tempData3
//     }
// ]}

// --------------------------------------------------------------------------

// del backend voy a recibir 
let readingsOutOfRange = [
  {zoneNumber: '1', dlId: '123', temp: 81, rh:59, ts:'2021-01-01 12:00'},
  {zoneNumber: '1', dlId: '123', temp: 79, rh:60, ts:'2021-01-01 12:05'},
  {zoneNumber: '1', dlId: '123', temp: 79, rh:60, ts:'2021-01-01 12:10'},
  {zoneNumber: '1', dlId: '123', temp: 79, rh:59, ts:'2021-01-01 12:15'},
  {zoneNumber: '30', dlId: '60', temp: 78, rh:52, ts:'2021-01-01 12:00'},
  {zoneNumber: '2', dlId: '60', temp: 79, rh:52, ts:'2021-01-01 12:05'},
  {zoneNumber: '2', dlId: '60', temp: 78, rh:52, ts:'2021-01-01 12:10'}
]

// identificando el tipo de error de los warnings
// me devuelve la lista de objetos que serian los rows del error log table
const formatReadingsOutOfRangeForErrorLogTable = (readingsOutOfRange) => {
    let res = []
    let errorType='';
    for (let i = 0; i<readingsOutOfRange.length; i++){
      if (readingsOutOfRange[i].temp > tempHighAlarm || readingsOutOfRange[i].temp<tempLowAlarm || readingsOutOfRange[i].rh<rhLowAlarm || readingsOutOfRange[i].rh>rhHighAlarm){
        errorType = 'data out of range';
      }
      else if(readingsOutOfRange[i].temp==tempHighAlarm||readingsOutOfRange[i].temp==tempHighAlarm-1||
        readingsOutOfRange[i].temp==tempLowAlarm||readingsOutOfRange[i].temp==tempLowAlarm+1||
        readingsOutOfRange[i].rh==rhHighAlarm||readingsOutOfRange[i].rh==rhHighAlarm-0.5||
        readingsOutOfRange[i].rh==rhLowAlarm||readingsOutOfRange[i].rh==rhLowAlarm+0.5){
        errorType = 'near range limit'
      }
      else{
        errorType = 'missing data';
      }
      res.push(
        {
          id: i+1,
          dataloggerId: readingsOutOfRange[i].dlId,
          zoneNumber:readingsOutOfRange[i].zoneNumber,
          temp:readingsOutOfRange[i].temp,
          rh:readingsOutOfRange[i].rh,
          timestamp: readingsOutOfRange[i].ts,
          errorType: errorType
        }
      )
    }
    return res;
}

const errorLog = formatReadingsOutOfRangeForErrorLogTable(readingsOutOfRange);

// --------------------------------------------------------------------------

// the backend gives me a list of ZoneSummary Objects
// i need the matching information between zones and dataloggers for the study
// getDataloggerToZoneForCleanroom returns a list of {dl_ID_number, zone_number, s_cleanroom, s_id and dl_id}
let zoneToDatalogger = [
  {zone: 1, dlId: 26},
  {zone: 2, dlId: 30},
  {zone: 3, dlId: 40},
  {zone: 4, dlId: 65},
  {zone: 5, dlId: 70},
  {zone: 6, dlId: 20},
  {zone: 7, dlId: 12},
  {zone: 8, dlId: 45},
  {zone: 9, dlId: 53},
  {zone: 10, dlId: 94},
  
]

// dao de get analytics per zone
let zoneSummaries = [
  {zoneNumber: 1, avgTemp: 79.4, minTemp: 78, maxTemp: 81, avgRh: 58.2, minRh: 58, maxRh: 60},
  {zoneNumber: 2, avgTemp: 78.2, minTemp: 76, maxTemp: 80, avgRh: 57.3, minRh: 54, maxRh: 58},
  {zoneNumber: 3, avgTemp: 78.2, minTemp: 76, maxTemp: 80, avgRh: 57.1, minRh: 55, maxRh: 58},
  {zoneNumber: 4, avgTemp: 78.2, minTemp: 76, maxTemp: 80, avgRh: 56.3, minRh: 55, maxRh: 59},
  {zoneNumber: 5, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
  {zoneNumber: 6, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
  {zoneNumber: 7, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
  {zoneNumber: 8, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
  {zoneNumber: 9, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
  {zoneNumber: 10, avgTemp: 77, minTemp: 76, maxTemp: 78.3, maxRh: 59.3, minRh: 55.0, avgRh: 56.4},
]

/**
 * this is a helper method called inside formatZoneSummaries
 * @param {list of objects defining the participates relationship} zoneToDatalogger {zone, dlId}
 * @param {Number} zoneNumber 
 * @returns the datalogger associated with the zoneNumber
 */
const findDLofZone = (zoneToDatalogger, zoneNumber) => {
  let res = zoneToDatalogger.find(obj => {
    return obj.zone===zoneNumber
  })
  return res.dlId;
}

/**
 * 
 * @param {list of ZoneSummary Objects} zoneSummaries 
 * @param {list of objects defining the participates relationship} zoneToDatalogger {zone, dlId}
 * @returns formatted list to input into the error log table 
 */
const formatZoneSummaries = (zoneSummaries, zoneToDatalogger) => {
  let res = [];
  for (let i = 0; i < zoneSummaries.length; i++){
    res.push(
      {
        id: i+1,
        dataloggerId: findDLofZone(zoneToDatalogger, zoneSummaries[i].zoneNumber), // change
        zoneNumber: zoneSummaries[i].zoneNumber,
        minTemp: zoneSummaries[i].minTemp,
        maxTemp: zoneSummaries[i].maxTemp,
        avgTemp: zoneSummaries[i].avgTemp,
        minRh: zoneSummaries[i].minRh,
        maxRh: zoneSummaries[i].maxRh,
        avgRh: zoneSummaries[i].avgRh
      }
    )
  }
  return res;
};

let zoneSummariesList = formatZoneSummaries(zoneSummaries, zoneToDatalogger)


/**
 * used in the following components: Summary Table
 */
const statsPerZone = [
    {
      id: 1,
      dataloggerId: '24',
      zoneNumber: 1,
      minTemp: 60,
      maxTemp: 81,
      avgTemp: 78.3,
      minRh: 53,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 2,
      dataloggerId: '26',
      zoneNumber: 2,
      minTemp: 60,
      maxTemp: 81.5,
      avgTemp: 78.3,
      minRh: 56.3,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 3,
      dataloggerId: '104',
      zoneNumber: 3,
      minTemp: 59.5,
      maxTemp: 78.3,
      avgTemp: 78.3,
      minRh: 52.0,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 4,
      dataloggerId: '82',
      zoneNumber: 4,
      minTemp: 59.5,
      maxTemp: 78.3,
      avgTemp: 78.3,
      minRh: 57.0,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 5,
      dataloggerId: '10',
      zoneNumber: 5,
      minTemp: 59.5,
      maxTemp: 78.3,
      avgTemp: 78.3,
      minRh: 55.0,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 6,
      dataloggerId: '27',
      zoneNumber:6,
      minTemp: 59.5,
      maxTemp: 78.3,
      avgTemp: 78.3,
      minRh: 56.0,
      maxRh: 59.3, 
      avgRh: 56.4
    },
    {
      id: 7,
      dataloggerId: '96',
      zoneNumber: 7,
      minTemp: 59.5,
      maxTemp: 78.3,
      avgTemp: 78.3,
      minRh: 59.0,
      maxRh: 59.3, 
      avgRh: 56.4
    },
  ];

  // --------------------------------------------------------------------------
// formatear la data para ponerla en las graficas de box plot 
const formaRangeForSummaryChart = (zoneSummariesList, studyParam) => {
    let res = []
    if (studyParam == 'temp'){
      for (let i = 0; i < zoneSummariesList.length; i++){
        res.push(
          {
            x: zoneSummariesList[i].zoneNumber,
            y: [zoneSummariesList[i].minTemp, zoneSummariesList[i].maxTemp]
          });
      }  
    } else{
      for (let i = 0; i < zoneSummariesList.length; i++){
        res.push(
          {
            x: zoneSummariesList[i].zoneNumber,
            y: [zoneSummariesList[i].minRh, zoneSummariesList[i].maxRh]
          });
      }
    }
    return res;
};

let tempRanges = formaRangeForSummaryChart(zoneSummariesList, 'temp')
let rhRanges = formaRangeForSummaryChart(zoneSummariesList, 'rh')


/**
 * used in the following components: RelHumSummaryChart
 */let rangeH = [
  {x: 1, y: [54.0, 58.5]},
  {x: 2, y: [56.0, 59.5]},
  {x: 3, y: [54.0, 58.5]},
  {x: 4, y: [53.0, 56.5]},
  {x: 5, y: [54.0, 57.5]},
  {x: 6, y: [53.0, 57.0]},
  {x: 7, y: [53.0, 56.5]},
  {x: 8, y: [54.0, 59.5]},
  {x: 9, y: [54.0, 59.0]},
  {x: 10, y: [53.0, 56.0]},
]

/**
 * used in the following components: TempSummaryChart
 */
 let rangeT = [
  {x: 1, y: [68.0, 70.0]},
  {x: 2, y: [68.0, 70.0]},
  {x: 3, y: [69.0, 70.0]},
  {x: 4, y: [68.0, 71.0]},
  {x: 5, y: [68.0, 70.0]},
  {x: 6, y: [68.0, 71.0]},
  {x: 7, y: [68.0, 71.0]},
  {x: 8, y: [68.0, 70.0]},
  {x: 9, y: [68.0, 70.0]},
  {x: 10, y: [69.0, 71.0]},
]


const formatAvgForSummaryChart = (zoneSummariesList, studyParam) => {
  let res = []
    if (studyParam == 'temp'){
      for (let i = 0; i < zoneSummariesList.length; i++){
        res.push(
          {
            x: zoneSummariesList[i].zoneNumber,
            y: zoneSummariesList[i].avgTemp
          });
      }  
    } else{
      for (let i = 0; i < zoneSummariesList.length; i++){
        res.push(
          {
            x: zoneSummariesList[i].zoneNumber,
            y: zoneSummariesList[i].avgRh
          });
      }
    }
    return res;
};

let tempAvg = formatAvgForSummaryChart(zoneSummariesList, 'temp')
let rhAvg = formatAvgForSummaryChart(zoneSummariesList, 'rh')



/**
 * used in the following components: RelHumSummaryChart
 */
let avgH = [
  
    {x: 1, y: 55.5},
    {x: 2, y: 57.1},
    {x: 3, y: 55.0},
    {x: 4, y: 55.0},
    {x: 5, y: 55.9},
    {x: 6, y: 54.9},
    {x: 7, y: 55.1},
    {x: 8, y: 56.0},
    {x: 9, y: 55.3},
    {x: 10, y: 54.2}    
];

/**
 * used in the following components: TempSummaryChart
 */
let avgT= [
    {x: 1, y: 69.1},
    {x: 2, y: 69.4},
    {x: 3, y: 69.6},
    {x: 4, y: 69.4},
    {x: 5, y: 68.6},
    {x: 6, y: 69.5},
    {x: 7, y: 69.2},
    {x: 8, y: 68.9},
    {x: 9, y: 69.4},
    {x: 10, y: 69.7}    
];

// backend gives me the study profile, from there I access these fields
/**
 * used in the following components: 
 */
const frequency = () => {
  let freqMinutes = study.samplingFrequency / 60;
  return freqMinutes
};



// data for metadata card
let clientName = study.clientName;
let requestDate = study.requestDate.toString();
let cleanroomName = study.cleanroomName;
let loggedStart =  study.startDate.toString();
let loggedEnd = study.endDate.toString();
let minutesFrequency = frequency();






export {errorRhData, errorTempData, readingsFromErrorZones, errorLog,
  tempHighAlarm, tempLowAlarm, rhHighAlarm, rhLowAlarm, numberOfZones,
  zoneSummariesList, tempRanges, rhRanges, tempAvg, rhAvg,
  clientName, requestDate, cleanroomName, loggedStart, loggedEnd, minutesFrequency}