import { Grid } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import TemperatureSummaryChartV2 from '../components/dashboard/tempSummaryChart';
import RelHumiditySummaryChart from '../components/dashboard/rhSummaryChart';
import Fab from '@material-ui/core/Fab';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import SummaryTable from '../components/dashboard/summaryTable';
import ErrorLogTable from '../components/dashboard/errorLogTable'
import StudyMetadata from '../components/dashboard/studyMetadata';
import {DashboardServices} from '../components/dashboard/Services/DashboardServices';
import {StudyServices} from '../services/StudyServices';
import {useLocation} from "react-router-dom"

const uuid = require('uuid');


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    fab: {
        position: 'relative',
        top: theme.spacing(0),
        right: theme.spacing(-30),
    },
    fab1: {
        position: 'relative',
        top: theme.spacing(0),
        right: theme.spacing(60),
    },
    fab2: {
        position: 'relative',
        top: theme.spacing(0),
        right: theme.spacing(-30),
    },
    cardContainer:{
        paddingTop:'20px',
        paddingLeft: '175px',
        paddingRight: '50px'
    }
}));

function DashboardView(props) {

    let data = useLocation();
    const {study} = data.state;
    console.log(data.state)
    console.log(study)   

    // hook for study summary data
    const [studySummary, setStudySummary] = useState([]);
    // hook for all the data in zones with at least one datapoint out of range
    const [errorZoneReadings, setErrorZoneReadings] = useState([]);
    // hooks for summary charts
    const [tempRange, setTempRange] = useState([]);
    const [rhRange, setRhRange] = useState([]);
    const [tempAvg, setTempAvg] = useState([]);
    const [rhAvg, setRhAvg] = useState([]);
    const [numberOfZones, setNumberOfZones] = useState(0);
    
    // hook for error log table information
    const [errorLogInfo, setErrorLogInfo] = useState([]);
    
    useEffect(()=>{

        async function myApiCall(){
            
            const sum = await DashboardServices.zoneSummariesList(study);
            for (let i = 0; i<sum.length; i++){
                sum[i]['id'] = uuid.v4();
            }
            setStudySummary(sum);

            const trange = await DashboardServices.tempRanges(study);
            setTempRange(trange);

            const hrange = await DashboardServices.rhRanges(study);
            setRhRange(hrange);

            const tavg = await DashboardServices.tempAvg(study);
            setTempAvg(tavg);

            const havg = await DashboardServices.rhAvg(study);
            setRhAvg(havg);

            const elog = await DashboardServices.errorLog(study);
            setErrorLogInfo(elog);

            const errorReadings = await DashboardServices.readingsFromErrorZones(study);
            for (let i = 0; i<errorReadings.length; i++){
                errorReadings[i]['id'] = uuid.v4();
            }
            setErrorZoneReadings(errorReadings);

            const noZones = await StudyServices.getNumberOfZones(study);
            setNumberOfZones(noZones[0].number_of_zones);
        }

        myApiCall()

    }, []);


    const manageDate = (date) => {
        if (typeof date == 'object'){
            return date.toLocaleDateString()
        }
        return date.slice(0,10)
    }

    const manageDateTime = (datetime) => {
        if (typeof datetime == 'object'){
            return datetime.toLocaleString()
        }
        return datetime.slice(0,10)
    }
    

    const classes = useStyles();
    // let studyId = props.match.params.studyID;
    return (
        <div>
            <Grid container  alignItems="center" justify='center'>
                <Grid item xs={9} style={{textAlign:'center'}}>
                    <h1> 
                        Dashboard 
                    </h1>
                </Grid>
                <Grid container className={classes.cardContainer} alignItems="flex-end" justify="space-evenly" direction="row">
                    <Grid item xs={3} style={{textAlign:'left'}} >
                        < StudyMetadata
                            studyID = {props.match.params.studyID}
                            clientName={study.clientName}
                            requestDate={manageDate(study.requestDate)}
                            cleanroomName={study.cleanroomName}
                            loggedStart={study.startDate}
                            loggedEnd={study.endDate} 
                            frequency={(study.samplingFrequency)}
                            tempHighAlarm={study.maxTemp}
                            tempLowAlarm={study.minTemp}
                            rhHighAlarm={study.maxRH}
                            rhLowAlarm={study.minRH}
                            numberOfZones={numberOfZones}

                         />
                    </Grid>
                    <Grid item xs={9} style={{textAlign:'left'}} >
                    
                        < ErrorLogTable 
                            errors={errorLogInfo}
                            tempLowAlarm={study.minTemp}
                            tempHighAlarm={study.maxTemp}
                            rhLowAlarm={study.minRH}
                            rhHighAlarm={study.maxRH}
                            readingsFromErrorZones={errorZoneReadings}
                         />
                    </Grid>
                </Grid> 
                <Grid item xs={10} style={{textAlign:'left'}}>
                    <br />
                    <br />
                    <br />
                    < TemperatureSummaryChartV2
                        avg={tempAvg}
                        range={tempRange}

                     />
                    <br />
                    <br />
                    <br />
                    < RelHumiditySummaryChart
                        avg={rhAvg}
                        range={rhRange}
                     />
                    <br />
                    <br />
                    <br />
                    < SummaryTable
                        statsPerZone={studySummary} 
                        tempLowAlarm={study.minTemp}
                        tempHighAlarm={study.maxTemp}
                        rhLowAlarm={study.minRH}
                        rhHighAlarm={study.maxRH}
                     />
                    <br />
                    <br />
                </Grid>
            </Grid>
            <Grid container xs={12} justify='center'>
                <Fab component={Link} 
                to={{pathname: '/tempPerZone/' + props.match.params.studyID, state:{study:study}}}
                size='large' variant="extended" color="primary" className={classes.fab} aria-label="add" type="submit">
                    <DoubleArrowIcon className={classes.extendedIcon} />
                    Temperature per Zone
                </Fab>
                <Fab size='large' component={Link} 
                to={{pathname:'/rhPerZone/' +  props.match.params.studyID, state:{study:study}}}
                variant="extended" color="primary" className={classes.fab1} aria-label="add">
                    <DoubleArrowIcon className={classes.extendedIcon} />
                    Humidity % per Zone
                </Fab>
                <Fab size='large' component={Link} 
                to={{pathname:'/dataPerZone/'+  props.match.params.studyID, state:{study:study}}}
                variant="extended" color="primary" className={classes.fab2} aria-label="add">
                    <DoubleArrowIcon className={classes.extendedIcon} />
                    Tabulated Data
                </Fab>
            </Grid>
        </div>
    ) 
}
export default DashboardView;