import { Grid } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import TempPerZone from '../components/dashboard/dataPerZone/tempPerZone'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { DashboardServices } from '../components/dashboard/Services/DashboardServices';
import {useLocation} from "react-router-dom"


const useStyles = makeStyles({
    graphContainer:{
        paddingTop:'20px',
        paddingLeft: '50px',
        paddingRight: '50px'
    },
    fab: {
        marginTop: 300,
        top: 'auto',
        right:'49%',
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    }
})

function TempPerZoneView(props) {

    const classes = useStyles();

    let data = useLocation();
    const {study} = data.state;

    const highlightErrors = (ds) => {
        for (const key in ds){
            for (let i = 0; i<ds[key].length; i++){
                if (ds[key][i].y > study.maxTemp || ds[key][i].y < study.minTemp){
                    ds[key][i]['markerType']="cross";
                    ds[key][i]['color']='red';
                }
            }
        }
        return ds;
    }  

    // hook for managing the zone data
    const [tempPerZone, setTempPerZone] = useState([]);

    useEffect(()=>{
        async function myApiCalls(){
            let tempData = await DashboardServices.formatTempData(study);
            tempData = highlightErrors(tempData);
            setTempPerZone(tempData);
        }
        myApiCalls();
    }, []);

    return (
        <>
            <Tooltip title="Back to Dashboard" aria-label="close">
                <Fab component={Link} 
                // to={'/dashboard/' + props.match.params.studyID} 
                to={{pathname: '/dashboard/' + props.match.params.studyID, state:{study:study}}}
                size="small" color="primary" className={classes.fab}  aria-label="add" type="submit">
                
                    <ArrowBackIcon className={classes.extendedIcon} />
                </Fab>
            </Tooltip>
        <Grid container justify="center" >
            <h1>Temperature (°F) per Zone for Study {study.clientName} {study.requestDate} {study.cleanroomName} </h1>
           </Grid>
           <Grid container justify="center" >
            <h2>Temperature Specifications: {study.minTemp}°F-{study.maxTemp}°F</h2>
           </Grid>
           <Grid container justify="center" >
            <h3>Readings outside the valid temperature range are marked with a red cross</h3>
            </Grid>
            <Grid container justify="center">
            <Grid container spacing={7} className={classes.graphContainer}>
                {Object.entries(tempPerZone).map(([zone, data])=>{
                    console.log(tempPerZone)
                    return(
                        <TempPerZone zone={zone} data={data} />
                    )})}
            </Grid>
        </Grid>
        </>
    ) 
}
export default TempPerZoneView