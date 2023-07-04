import React, {useState, useEffect, useRef}  from 'react'
import {IconButton, Typography } from '@material-ui/core'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import BackupIcon from '@material-ui/icons/Backup'
import AssessmentIcon from '@material-ui/icons/Assessment'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid'
import {StudyServices} from '../../services/StudyServices'

function StudyActions(props) {
    const study= props.study 
    const [dashboardEnabled, setDashboardDisabled] = useState(true)
    const [reportDisabled, setReportDisabled] = useState(true)
    const [zoneMapDisabled, setZoneMapDisabled] = useState(true)
    const initialRender = useRef(true);
    const [associated, setAssociated] = useState(false)
    const status = study.status
    
    useEffect(() => {
        if(initialRender.current){
            StudyServices.getZoneToDL(study).then((r)=>{
                console.log('Estoy empezando',r)
                for(var i= 0; i < r.length; i++){
                    if(r[i]['zone_number'] !== null) {setAssociated(true)}
                }
            }).catch(err=>console.log(err))
                
            if(status === 'Created'){ // created
                setDashboardDisabled(true)
                setReportDisabled(true)
                setZoneMapDisabled(true)
            }
            else if(status === 'Agreement Form Completed'){ // agreement form completed
                setDashboardDisabled(true)
                setReportDisabled(true)
                setZoneMapDisabled(false)
            }
            else if(status == 'In Progress'){ // study in progress -> after
                if(associated){setDashboardDisabled(true)}else{
                    setDashboardDisabled(false)
                }
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
            else if(status == 'Pending Approval'){ // study in progress -> after
                if(associated){setDashboardDisabled(true)}else{
                    setDashboardDisabled(false)
                }
                setReportDisabled(true)
                setZoneMapDisabled(false)
            }
            else if(status == 'Approved'){ // study in progress -> after
                setDashboardDisabled(false)
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
            else{
                setDashboardDisabled(false)
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
            initialRender.current = false;
        }
        else{

            StudyServices.getZoneToDL(study).then((r)=>{
                console.log('Estoy empezando',r)
                for(var i= 0; i < r.length; i++){
                    if(r[i]['zone_number'] !== null) {setAssociated(true)}
                }
            }).catch(err=>console.log(err))
            if(status === 'Created'){ // created
                setDashboardDisabled(true)
                setReportDisabled(true)
                setZoneMapDisabled(true)
            }
            else if(status === 'Agreement Form Completed'){ // agreement form completed
                setDashboardDisabled(true)
                setReportDisabled(true)
                setZoneMapDisabled(false)
            }
            else if(status == 'In Progress'){ // study in progress -> after
                if(associated){setDashboardDisabled(true)}else{
                    setDashboardDisabled(false)
                }
                setReportDisabled(true)
                setZoneMapDisabled(false)
            }
            else if(status == 'Pending Approval'){ // study in progress -> after
                if(associated){setDashboardDisabled(true)}else{
                    setDashboardDisabled(false)
                }
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
            else if(status == 'Approved'){ // study in progress -> after
                setDashboardDisabled(false)
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
            else{
                setDashboardDisabled(false)
                setReportDisabled(false)
                setZoneMapDisabled(false)
            }
        }
        return () => {
            
        }
    }, [])

    const onProgramClick = () => {
        props.setShowInsertDl(true);
    };
    const onExtractClick = () =>{
        props.setShowInsertDlToExtract(true)
    };

    return (
        <>
            <Grid container alignContent="space-between" alignItems="center">
                <Grid item>
                    <Typography>To Program Datalogger:</Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={()=>onProgramClick()}><ImportExportIcon color='secondary' /></IconButton>
                </Grid>
                <Grid item>
                    <Typography>Import Data from Datalogger to Study:</Typography>
                </Grid>
                <Grid onClick={()=>onExtractClick()}>
                    <IconButton><BackupIcon color='secondary' /></IconButton>
                </Grid>
                <Grid item>
                    <Typography>Assign dataloggers to zones:</Typography>
                </Grid>
                <Grid item >
                    <IconButton color='secondary'  disabled={zoneMapDisabled} component={Link} to={{pathname:"/zoneMap/"+props.studyID, state:{study:study}}}><AccountTreeIcon /></IconButton>
                </Grid>
                <Grid item>
                    <Typography>Go To Dashboard:</Typography>
                </Grid>
                <Grid item>
                    <IconButton disabled={dashboardEnabled} color='secondary' component={Link} to={{pathname:"/dashboard/" + props.studyID, state:{study:study} }}><AssessmentIcon /></IconButton>
                </Grid>
                <Grid item>
                    <Typography>Go To Report:</Typography>
                </Grid>
                <Grid item>
                    <IconButton disabled={reportDisabled} color='secondary' component={Link} to={{pathname:"/report" ,state:{study:study} }}><AssignmentIcon /></IconButton>
                </Grid>
            </Grid>
            </>
    )
}

export default StudyActions
