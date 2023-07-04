import React, {useState, useEffect, useRef} from 'react'
import {DataGrid} from '@material-ui/data-grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';
import { Modal } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { TextField, Card, Grid } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import {DataloggerServices} from '../../services/DataloggerServices'
import InsertDlToCreate from '../modals/creatingDlProfile/insertDl'
import IdentifyingDL from '../modals/creatingDlProfile/identifyingDl'
import DLProfileCreated from '../modals/creatingDlProfile/profileCreated'
import {DataloggerConnection} from '../../services/DLConnection'
import DescriptionIcon from '@material-ui/icons/Description';
import ReportEditor from '../report/report'
import RetryConnection from '../modals/creatingDlProfile/retryConnection'

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
        right: theme.spacing(65),
    }
}));

function DataloggerProfilesTable() {
       

    // Columns for table
    const columns = [
        { field: 'id', hide:true},
        { field: 'dlName', headerName: 'ID', width: 70, },
        { field: 'dlSerialNumber', headerName: 'Serial Number',type:'number', width: 150 },
        { field: 'dlOffset', headerName: 'Offset', type:'number', width: 100 },
        { field: 'calibrationDate', headerName:'Calibration Due Date', type:'date', width:200},
        { field: 'dlInTolerance', headerName: 'Status', width: 130 },
        { field: 'report', headerName:'Report', width:130,
            renderCell: (params) => (
                <strong>
                    <IconButton style={{ marginLeft: 16 }} color='secondary' onClick={()=>handleEdit(params)} >
                        <DescriptionIcon
                        variant="contained">
                        </DescriptionIcon>
                    </IconButton>
                </strong>
                )}
    ];

    // hooks
    const classes = useStyles();
    const [filterQuery, setFilterQuery] = useState("")
    const [editModal, setEditModal] = useState(false)
    const [editRow,setEditRow] = useState({})
    const [data, setData]= useState([])

    // Modal Management 
    const [insertDlToCreate, setInsertDlToCreate] = useState(false)
    const handleInsertDlModalClose = () => setInsertDlToCreate(false);
    const [identifyingDl, setIdentifyingDl] = useState(false)
    const handleIdentifyDlModalClose = () => setIdentifyingDl(false);
    const [profileCreated, setProfileCreated] = useState(false)
    const handleProfileCreatedDlModalClose = () => setProfileCreated(false);
    const [retry, setRetry] = useState(false);
    const handleRetryClose = () => setRetry(false);
    const [insertedDl, setInsertedDl] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const hitRefresh = () => setRefresh(!refresh);
    const initialRender = useRef(true);

    // useEffect for getting datalogger 
    useEffect(() => {
        // Study service for getting data loggers
        DataloggerServices.getAll().then((datalogger)=>{
            setData(datalogger)
        })
        return () =>{
            setRefresh(false)
        }
    },[refresh]);

    const createDlProfile = async () => {
        let datalogger = {
            dlName:'',
            dlSerialNumber:''
        };
        // hide insert DL
        setInsertDlToCreate(false);
        // show identifying DL
        setIdentifyingDl(true);
        // get config block
        let block = await DataloggerConnection.getDetails();
        // if yes
        if (block){
            // populate DL object
            datalogger.dlName = block.name;
            datalogger.dlSerialNumber = block.serial_number;
            // call create DL
            let createDl = await DataloggerServices.create(datalogger);
            // if yes
            if (createDl){
                setIdentifyingDl(false);
                // show profile created
                setProfileCreated(true);
                // setInserted false
                setInsertedDl(false);
                hitRefresh();
            }
            // else
            else{
                // set identifying false
                setIdentifyingDl(false);
                // set inserted Dl false
                setInsertedDl(false);
                // set refresh true
                setRefresh(true);
                hitRefresh();
            }
        }
        // if not
        else{
            // hide identifying
            setIdentifyingDl(false);
            // show warning
            setRetry(true);
            // ask to try again
        }
    }

    // Handling changes
    const handleSearchChangeQuery = (e)=>{
        setFilterQuery(e.target.value)
    }
    const handleEdit = (params) =>{
        console.log('damn')
        console.log(params.row)
        setEditRow(params.row) 
        console.log(editRow)
        openCloseEditModal()
        
    }

    const openCloseEditModal=()=>{
        setEditModal(!editModal)
    }
    
    const InsertDLCreateModal = () =>{
        return(
            <Modal open={insertDlToCreate} onClose={handleInsertDlModalClose}>
                <InsertDlToCreate 
                    setInsertedDl={setInsertedDl}
                    createDlProfile={createDlProfile}
                />
            </Modal>
        )
    }

    const IdentifyingDlModal = () => {
        return(
            <Modal open={identifyingDl} onClose={handleIdentifyDlModalClose}>
                <IdentifyingDL 
                    setIdentifyingDl={setIdentifyingDl}
                    setProfileCreated={setProfileCreated}
                    setInsertedDl={setInsertedDl}
                />
            </Modal>
        )
    };

    const ProfileCreatedModal = () => {
        return(
            <Modal open={profileCreated} onClose={handleProfileCreatedDlModalClose}>
                <DLProfileCreated 
                    setProfileCreated={setProfileCreated}
                    setInsertDlToCreate={setInsertDlToCreate}
                    setProfileCreated={setProfileCreated}
                />
            </Modal>
        )
    };

    const RetryConnectionModal = () => {
        return(
            <Modal open={retry} onClose={handleRetryClose}>
                <RetryConnection 
                    setInsertDlToCreate={setInsertDlToCreate}
                    setRetry={setRetry}
                />
            </Modal>
        )
    }

    const ModalContent = () => {
        return(
            <Modal open={editModal} onClose={openCloseEditModal}>
                <div>                   
                    <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
                        transform: 'translate(-50%, -50%)',height:'650px', width:'850px' ,overflow:'scroll'}}>
                         <Paper >
                            <ReportEditor  dlName={editRow.dlName} isCalibration={true}  />
                        </Paper>
                    </div>
                    

                </div>
            </Modal>
        )
    }
    
    // jsx
    return (
        <div>
            <Grid container justify='center' xs={12} spacing={3}>
                <Grid container xs={8} md={8} lg={10} justify='flex-end'>
                    <Grid item>
                        <Fab onClick={()=>setInsertDlToCreate(true)} size='large' className = {classes.fab} variant="extended" color="primary" aria-label="add">
                            <AddIcon className={classes.extendedIcon} />
                            New Datalogger Profile
                        </Fab>
                    </Grid> 
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <SearchIcon />
                    <TextField onChange={handleSearchChangeQuery}  placeholder='Search' />
                    <Paper style={{height:'600px'}}>
                        <DataGrid  columns={columns} rows={
                            filterQuery ? data.filter(x=>
                                x['dlName'].includes(filterQuery) ||
                                x['dlOffset'].includes(filterQuery) ||
                                x['calibrationDate'].includes(filterQuery) ||
                                x['dlSerialNumber'].includes(filterQuery)
                                ):data
                            } 
                            pageSize={10}>
                        </DataGrid>
                    </Paper>
                </Grid>
            </Grid>

            {/* modals for creating profile */}
            {insertDlToCreate ? <InsertDLCreateModal /> : null}
            {identifyingDl ? <IdentifyingDlModal /> : null}
            {profileCreated ? <ProfileCreatedModal />: null}
            {retry ? <RetryConnectionModal /> : null}

            {/* Edit datalogger */}
            {editModal?<ModalContent />:null}
        </div>
    )
}

export default DataloggerProfilesTable
