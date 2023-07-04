/**
 * @author Enrique 
 * 
 * 
 */
import React, {useState, useEffect} from 'react'
import {DataGrid, setGridPageStateUpdate} from '@material-ui/data-grid'
import Paper from '@material-ui/core/Paper'
import BarChartIcon from '@material-ui/icons/BarChart'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import { TextField, Grid, Button, IconButton} from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles';
import {StudyServices} from '../../services/StudyServices'
import { Auth} from 'aws-amplify';



// Styling components
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
        position: 'absolute',
        top: theme.spacing(20),
        right: theme.spacing(60),
    },
    background:{
        backgroundColor:'#E0E0E0'
    }
}));


// URL to backend server
const baseURL = ''

// Component
function StudyTable() {
    const classes = useStyles();

    // hooks
    const [data, setData] = useState([])
    // For Search Bar
    const [filterQuery, setFilterQuery] =useState("")
    const [selectedStudy, setSelectedStudy] = useState(null)
    const [employeeId, setEmployeeId] = useState(0);
    
    useEffect(() => {
        // // Study service for getting data loggers
        // StudyServices.getAllStudies().then((studies)=>{
        //     setData(studies)
        // })
        let employeeId = '';
        async function myApiCalls(){
            const userInfo = await Auth.currentUserInfo();
            const attributes = await userInfo.attributes
            employeeId =attributes['custom:employeeId'];
            let studies = await StudyServices.getStudiesByReporterComplete(employeeId);
            setData(studies)
        }
        myApiCalls();
            
    },[]);

    // For checking cell events (onClick)
    const cellEvent =(rowData) =>{
        //console.log(rowData)
        const studyId = rowData.row.id
        // update selected project hook
        console.log(studyId)
        //setSelectedStudy(studyId)
        
    }
    
    // Handling changes
    const handleSearchChangeQuery = (e)=>{
        setFilterQuery(e.target.value)
    }
    const handleStudy =(params)=>{
        for(const study in data ){
            if(study.projectName === params.value){
                setSelectedStudy(study)
            }
        } 
    }
    // Information for table
    const columns = [
        
        { field: 'id', headerName: 'Study ID', width: 110,
        renderCell: (params) => (
            <strong>
                <Button onClick={handleStudy(params)} color='secondary' component={Link}  to={{pathname:'/studyProfile/'+ params.id,
                state:{study:data[params.rowIndex], 
                }}}>{params.value}</Button>
            </strong> )},
        { field: 'clientName', headerName: 'Client', width: 130 },
        { field: 'cleanroomName', headerName: 'Cleanroom', width: 130 },
        { field: 'requestDate', headerName:'Request Date', type:'date', width:140},

        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'reporter', headerName:'Reporter', width:160},
        { field: 'dashboard', headerName:'Dashboard', width:125,
        renderCell: (params) => (
            <strong>
                {console.log(params)}
                <IconButton disabled={params.row['status']==='Created' || params.row['status']==='Agreement Form Completed'} 
                color='secondary' style={{ marginLeft: 16 }} component={Link} to={{pathname:'/dashboard/'+params.id,
                    state:{study:data[params.rowIndex],}}} >
                    <BarChartIcon
                    variant="contained"
                    />
                </IconButton>
            </strong>
            )},
        { field: 'report', headerName:'Report', width:100,
        renderCell: (params) => (
            <strong>
                <IconButton
                disabled={params.row['status']==='Created' || params.row['status']==='Agreement Form Completed'}
                style={{ marginLeft: 16 }} color='secondary' component={Link} to={{pathname:'/report',
                    state:{study:data[params.rowIndex],}}}>
                    <AssignmentTurnedInIcon
                    variant="contained">
                    </AssignmentTurnedInIcon>
                </IconButton>
            </strong>
            )}
    ];

    // jsx
    return (
        <div>
            <ThemeProvider>
                <Grid container justify='center'  xs={12} spacing={3} >
                    <Grid container justify='flex-end' >
                        <Grid item xs={12} md={12} lg={12} >
                            <Fab component={Link} to={'/newStudy'} size='large' variant="extended" color="primary" className = {classes.fab} aria-label="add">
                                <AddIcon className={classes.extendedIcon} />
                                New Study
                            </Fab>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} >
                        <SearchIcon />
                        <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
                        <Paper style={{height:'600px'}}>
                            <DataGrid title='Thermal Studies' columns={columns} rows={
                                filterQuery ? data.filter(x=>
                                    x['projectName'].toLowerCase().includes(filterQuery) ||
                                    x['status'].toLowerCase().includes(filterQuery) ||
                                    x['clientName'].toLowerCase().includes(filterQuery) ||
                                    x['reporter'].toLowerCase().includes(filterQuery) ||
                                    x['requestDate'].toLowerCase().includes(filterQuery)
                                    ):data
                                }
                                onCellClick={(rowData)=>cellEvent(rowData) }
                                pageSize={10}>
                            </DataGrid>
                        </Paper>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    )
}

export default StudyTable
