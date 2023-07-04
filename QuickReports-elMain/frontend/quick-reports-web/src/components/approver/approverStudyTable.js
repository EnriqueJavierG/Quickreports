import React, {useState} from 'react';
import {DataGrid} from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import BarChartIcon from '@material-ui/icons/BarChart';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, Grid} from '@material-ui/core';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { StudyServices } from '../../services/StudyServices';
import { Redirect } from 'react-router';
import Tooltip from '@material-ui/core/Tooltip';

function ApproverStudyTable(props) {


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
            top: theme.spacing(12),
            right: theme.spacing(60),
        }
    }));

    const classes = useStyles();

    // hook for table search bar 
    const [filterQuery, setFilterQuery] =useState("")
    // hook for linking study profile to table
    const [selectedStudy, setSelectedStudy] = useState()
    // // hook for storing the study object that will be passed to the dashboard page
    // const [studyObj, setStudyObj] = useState({});
    // hook for redirecting to the dashboard
    const [redirect, setRedirect] = useState(false);
    // hook for redirecting to study profile
    const [goToProfile, setGoToProfile] = useState(false);

    // go to study profile
    const cellEvent = async (rowData) =>{
        const studyId = rowData.row.id
        setSelectedStudy(studyId);
    }
    
    // search handle
    const handleSearchChangeQuery = (e)=>{
        setFilterQuery(e.target.value)
    }

    // determine the button icon based on study status
    const approvedSymbolHandle = (status) => {
        if (status == "Not Approved"){
            console.log('hello not approved')
            return (
                <CancelPresentationIcon 
                variant="contained"
                style={{marginLeft:16}}/>
            )
        }
        else if (status == "Approved"){
            console.log('hello approved')
            return (
                <AssignmentTurnedInIcon
                variant="contained"
                style={{marginLeft:16}} />
            )
        }
        else {  // pending
            return (
                <AssignmentLateIcon
                variant="contained"
                style={{ marginLeft: 16 }}
                />
            )
        }
    }

    // handle changing page content to review component and sends the id of the clicked study
    const onClickReview = async (status, studyId) => {
        let s = await StudyServices.getStudyById(studyId);
        // console.log(s);
        props.setCurrentStudy(studyId);
        props.setStudyObj(s.r);
        setSelectedStudy(studyId);
        props.setReview(true);        
    }

    const onDashboardClick = async (data) =>{
        const studyId = data.id;
        setSelectedStudy(studyId);
        let s = await StudyServices.getStudyById(studyId);
        console.log('desde el approver study table linea 104')
        console.log(s)
        // props.setStudyObj(s.r[0]);
        props.setStudyObj(s.r);
        setRedirect(true);
    }

    const onProfileClick = async (data) => {
        const studyId = data.id;
        setSelectedStudy(studyId);
        let s = await StudyServices.getStudyById(studyId);
        props.setStudyObj(s.r);
        setGoToProfile(true);
        setRedirect(true);
    }

    // disable button if project is done 
    const manageButton = (row) => {
        if (row.status == "Done"){
            return (
                <IconButton aria-label="reviewDoc"
                disabled
                onClick={()=>onClickReview(row.status, row.id)}>
                {approvedSymbolHandle(row.status)}
                </IconButton>
            )
        }
        else {
            return (
                <IconButton
                color='secondary'
                disabled={row['status']==='Created' || row['status']==='Agreement Form Completed' ||
                row['status']==='In Progress'}
                aria-label="reviewDoc"
                onClick={()=>onClickReview(row.status, row.id)}>
                {approvedSymbolHandle(row.status)}
                </IconButton>
                )
        }
    }

    // Information for table
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide:true },
        { field: 'studyId', headerName: 'Study ID', width: 150,
        renderCell: (params) => (
            <strong>
                <Button component={Link} 
                
                onClick={()=>onProfileClick(params.row)}
                > 
                    {params.id}
                </Button>
            </strong> )},
        { field: 'client', headerName: 'Client', width: 130 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'reporter', headerName:'Reporter', width:150},
        { field: 'requestDate', headerName:'Request Date', type:'date', width:150},
        { field: 'dashboard', headerName:'Dashboard', width:130,
        renderCell: (params) => (
            <strong>
                <IconButton component={Link} 
                color='secondary'
                disabled={params.row['status']==='Created' || params.row['status']==='Agreement Form Completed'}
                onClick={()=>onDashboardClick(params.row)}>
                    <BarChartIcon
                    variant="contained"
                    style={{ marginLeft: '16' }}
                    >
                    </BarChartIcon>
                </IconButton>
            </strong>
            )},
        { field: 'report', headerName:'Report', width:110,
        renderCell: (params) => (
            <Tooltip title="Click to Review Report" placement="right">
            <strong>
            {manageButton(params.row)}
            </strong>
            </Tooltip>
            )}
    ];

    if (redirect){
        if(goToProfile){
            return(
                <Redirect to={{pathname:'/studyProfile/'+selectedStudy, state:{study:props.studyObj}}}/>
            )
        }
        else{
            console.log('desde la 190 ')
            console.log(props.studyObj)
            return(
                <Redirect to={{pathname:'/dashboard/'+selectedStudy, state:{study:props.studyObj}}}/>
            )
        }
    }
    else{
        return (
            <div>
                <Grid container justify='center' spacing={3} >
                    <Grid item xs={12} md={12} lg={12}  >
                        <SearchIcon />
                        <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
                        <Paper style={{height:'600px', width:'1050px'}}>
                            <DataGrid title='Thermal Studies' columns={columns} rows={
                                filterQuery ? props.studies.filter(x=>
                                    x['projectName'].toLowerCase().includes(filterQuery) ||
                                    x['status'].toLowerCase().includes(filterQuery) ||
                                    x['clientName'].toLowerCase().includes(filterQuery) ||
                                    x['reporter'].toLowerCase().includes(filterQuery) ||
                                    x['requestDate'].toLowerCase().includes(filterQuery)
                                    ):props.studies
                                }
                                onCellClick={(rowData)=>cellEvent(rowData) }
                                pageSize={10}>
                            </DataGrid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
    
}


export default ApproverStudyTable
