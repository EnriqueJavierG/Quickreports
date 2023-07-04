import { Grid } from '@material-ui/core'
import React, {useState, useEffect, useRef} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import DataPerZoneTable from '../components/dashboard/dataPerZone/dataPerZoneTable'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { DashboardServices } from '../components/dashboard/Services/DashboardServices';
import {useLocation} from "react-router-dom"


const useStyles = makeStyles((theme)=>({
    graphContainer:{
        paddingTop:'20px',
        paddingLeft: '50px',
        paddingRight: '50px'
    },
    fab: {
        marginTop: 300,
        top: 'auto',
        right:'8%',
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    }
}));

function DataPerZoneView(props) {

    let data = useLocation();
    const {study} = data.state;

    // hook to maintain study data
    const [studyData, setStudyData] = useState({});

    useEffect(()=>{
        async function myApiCall(){
            let readings = await DashboardServices.formatDataForDataPerZoneView(study);
            setStudyData(readings);
        }
        myApiCall();
    },[]);

    

    let studyName= `${study.clientName} ${study.requestDate} ${study.cleanroomName}`;
    const classes = useStyles();
    return (
        <>
            <Grid container justify="center">
                <Tooltip title="Back to Dashboard" aria-label="close">
                    <Fab component={Link} 
                    to={{pathname: '/dashboard/' + props.match.params.studyID, state:{study:study}}}
                    size='large' color="primary" className={classes.fab}  aria-label="add" type="submit">
                        <ArrowBackIcon className={classes.extendedIcon} />
                    </Fab>
                </Tooltip>
            </Grid>
            <Grid container justify="center">
            <h1>Data per Zone for {studyName} Study  </h1>
                <Grid container spacing={5} className={classes.graphContainer}>
                    {Object.entries(studyData).map(([zone, readings])=>{
                        return(
                            <DataPerZoneTable study = {study} readings={readings} zone={zone}/>
                        )})}
                </Grid>
            </Grid>
            
        </>
    ) 
}
export default DataPerZoneView