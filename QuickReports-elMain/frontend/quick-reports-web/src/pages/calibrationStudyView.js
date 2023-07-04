import { Grid } from '@material-ui/core'
import React, {useState, useEffect, useRef} from 'react'
import CalibrationStudyTable from '../components/calibrationStudies/calibrationStudiesTable'
import Fab from '@material-ui/core/Fab'
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import InsertDlToCalibrateModalTest from '../components/modals/calibration/insertDLtoCalibrate'
import { Link } from 'react-router-dom'
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import InsertDlToCalibrate from '../components/modals/calibration/insertDLtoCalibrate';
import DataloggerWithoutProfile from '../components/modals/calibration/dlWithoutProfileCal';
import CalibrationDoneDL from '../components/modals/calibration/dlCalibrated';
import CalibratingDL from '../components/modals/calibration/calibratingDl';
import ErrorReadingDl from '../components/modals/calibration/errorReadingDlCal'
import {CalibrationServices} from '../services/CalibrationServices';
import { DataloggerConnection } from '../services/DLConnection';
import {DataloggerServices} from '../services/DataloggerServices'
import RetryConnection from '../components/modals/calibration/retryConnection';
import CalCannotBeDone from '../components/modals/calibration/calCannotBeDone';


function CalibrationStudyView() {

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
            marginTop: 325,
            top: -150,
            right:'72%',
            bottom: 'auto',
            left: 'auto',
            position: 'absolute',
        },
        fab1: {
            marginTop: 325,
            top: -150,
            right:'12%',
            bottom:'auto',
            left: 'auto',
            position: 'absolute',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));


    // hook for calibration sessions data
    const [calSessData, setCalSessData] = useState([]);

    useEffect(()=> {
        async function myApiCalls(){
            const res = await CalibrationServices.getAllCalSess();
            setCalSessData(res.calSess);
        }
        myApiCalls();
    }, [])

    const classes = useStyles();

    // hook for showing the modal
    const [modalOpen, setModalOpen] = useState(false);
    // hook for controlling the table's onRowClick
    const [enableTableClick, setEnableTableClick] = useState(false);
    // hook for showing the backdrop
    const [showBd, setShowBd] = useState(false);
    const handleBdToggle = () => { // show is a boolean
        setShowBd(!showBd);
    }
    // closes the backdrop
    const handleBdClose = () => {
        setShowBd(false);
        setEnableTableClick(false);
    };
    // manages the table modal
    const openCloseModal = () => {
        setModalOpen(!modalOpen)
    };
    // enables the backdrop to highlight the calibration table
    const onStartCalibrationClick = () => {
        setEnableTableClick(true);
        handleBdToggle();
    };

    
    // hook for modal info
    const [modalInfo, setModalInfo] = useState([]);
    // hook for showing insert DL modal
    const [showInsertDl, setShowInsertDl] = useState(false);
    const handleInsertDlClose = () => setShowInsertDl(false);
    // hook for including in the modal the selected cal sess (PK)
    const [calSess, setCalSess] = useState();
    // hook for showing calibrating DL modal
    const [showCalibratingDl, setShowCalibratingDl] = useState(false);
    const handleCalibratingDlClose = () => setShowCalibratingDl(false);
    // hook for showing DL Calibrated modal
    const [showCalibrationDone, setShowCalibrationDone] = useState(false);
    const handleCalibrationDoneClose = () => setShowCalibrationDone(false);
    // hook for showing DL not recognized modal
    const [showDlNotRecognized, setShowDlNotRecognized] = useState(false);
    const handleDlNotRecognizedClose = () => setShowDlNotRecognized(false);
    // hook for showing error reading DL
    const [showReadingDlError, setShowReadingDlError] = useState(false);
    const handleReadingDlErrorClose = () => setShowReadingDlError(false);
    // hook for determining if a datalogger is connected
    const [connectedDl, setConnectedDl] = useState(false);
    // hook for managing error on local server and datalogger connection
    const [showRetryGetConfig, setShowRetryGetConfig] = useState(false);
    const handleShowRetryClose = () => setShowRetryGetConfig(false);
    // hook for retrying to get the configuration block
    const [retryConfig, setRetryConfig] = useState(false);
    // hook for when datalogger does not have readings at the time of the calibration nominal readings
    const [showCalibrationCannotBeDone, setShowCalibrationCannotBeDone] = useState(false);
    const handleShowCalCannotBeDoneClose = () => setShowCalibrationCannotBeDone(false);
    
    const initialRender = useRef(true);

    const letsCalibrate = async () =>{
        setShowInsertDl(false);
        // show calibrating 
        console.log('entramos')
        setShowCalibratingDl(true);
        // get details
        let dlConfigBlock = await DataloggerConnection.getDetails();
        
        // check if block was not received
        if (!dlConfigBlock){
            console.log('NO TENGO EL CONFIG :(');
            setShowCalibratingDl(false);
            setShowRetryGetConfig(true);
            setConnectedDl(false);
            return;
        }else{
            console.log('SI TENGO EL CONFIG!!! :D');
            // get all DLs
            let dataloggers = await DataloggerServices.getAll();
            // check if DL is in study
            for (let i = 0; i<dataloggers.length; i++){
                // if yes
                console.log('el name del DL')
                console.log(dlConfigBlock.name)
                if (dlConfigBlock.name == dataloggers[i].dlName){
                    console.log('ENCONTRAMOS EL DL :D')
                    // Calibrate
                    let calibrate = await CalibrationServices.calibrate(calSess); 
                    console.log('el resultado de calibrate')
                    console.log(calibrate)
                    // if yes
                    if (calibrate){
                        console.log("CALIBRAMOS!!!!")
                        // show calibrated
                        setShowCalibrationDone(true);
                        setShowCalibratingDl(false);    
                        return;
                    }
                    else{
                        console.log("NO SE PUDO CALIBRAR :(")
                        // show cannot be done
                        setShowCalibrationCannotBeDone(true);
                        setShowCalibratingDl(false);
                        return;
                    }                           
                }
            }
            console.log('NO ENCONTRAMOS EL DL :(')
            //  show mod no prof
            // return 
            setShowDlNotRecognized(true);
            setConnectedDl(false);
            return;
            
        }
    }

    
    const CalibrationCannotBeDoneModal = () => {
        return(
            <CalCannotBeDone open={showCalibrationCannotBeDone} onClose={handleShowCalCannotBeDoneClose}
                setShowCalibrationCannotBeDone={setShowCalibrationCannotBeDone}
            />
        )
    }

    const RetryConnectionModal = () => {
        return(
            <RetryConnection open={showRetryGetConfig} onClose={handleShowRetryClose}
            setShowRetryGetConfig={setShowRetryGetConfig}
            setRetryConfig={setRetryConfig}
            setShowInsertDl={setShowInsertDl}
             />
        )
    }
    
    const InsertDlModal = () => {
        return(
            <Modal open={showInsertDl} onClose={handleInsertDlClose}>
                <InsertDlToCalibrate 
                    letsCalibrate={letsCalibrate}
                    calSess={calSess} 
                    setConnectedDl={setConnectedDl}
                />
            </Modal>
        )
    }
  
    const CalibratingDlModal = () => {
        return(
            <Modal open={showCalibratingDl} onClose={handleCalibratingDlClose}>
                <CalibratingDL 
                setShowCalibratingDl={setShowCalibratingDl}
                setShowCalibrationDone={setShowCalibrationDone}
                />
            </Modal>
        )
    }

    const CalibrationDoneModal = () => {
        return(
            <Modal open={showCalibrationDone} onClose={handleCalibrationDoneClose}>
                <CalibrationDoneDL
                setShowCalibrationDone={setShowCalibrationDone} 
                setShowInsertDl={setShowInsertDl}
                />
            </Modal>
        )
    };

    
    const DlNotRecognizedModal = () => {
        return(
            <Modal open={showDlNotRecognized} onClose={handleDlNotRecognizedClose}>
                <DataloggerWithoutProfile 
                    setShowInsertDl={setShowInsertDl}
                    setShowDlNotRecognized={setShowDlNotRecognized}
                />
            </Modal>
        )
    };

   
    const ReadingDlErrorModal = () => {
        return (
            <Modal open={showReadingDlError} onClose={handleReadingDlErrorClose}>
                <ErrorReadingDl 
                    setShowReadingDlError={setShowReadingDlError}
                    setShowInsertDl={setShowInsertDl}
                />
            </Modal>
        )
    }

    return (
        <div> 
            {showBd ? 
            <Grid container justify='center'>
                <Grid item>
                <Paper>
                    <h2> Select from the table the calibration session to calibrate the dataloggers with. </h2>
                    <Backdrop classes={classes.backdrop} open={showBd} onClick={handleBdClose} >
                        <CalibrationStudyTable data={calSessData} 
                            setModalInfo={setModalInfo}
                            setShowInsertDl={setShowInsertDl}
                            enableTableClick={enableTableClick}
                            setEnableTableClick={setEnableTableClick}
                            setCalSess={setCalSess}
                            calSess={calSess}
                        /> 
                    </Backdrop>
                </Paper>
                </Grid>
            </Grid>
            :
            <Grid container direction="column" justify="center" alignItems="center" >
                <Grid item xs={12} style={{textAlign:'center'}}>
                    <h1> 
                        Datalogger Calibration Studies
                    </h1>
                    <br />
                    
                </Grid>
                <Grid container direction="row" justify="space-around" alignItems="flex-start" >
                {/* <Grid container> */}
                        <Grid item xs={3}>
                            <Fab size='large' variant="extended" 
                            color="primary" 
                            aria-label="add" 
                            onClick= {() => onStartCalibrationClick()}
                            className={classes.fab}
                            >
                                <SettingsIcon className={classes.extendedIcon} />
                                Start Calibration Session
                            </Fab>
                            <Modal open={modalOpen} onClose={openCloseModal}>
                                <InsertDlToCalibrateModalTest  />
                            </Modal>
                        </Grid>
                        <Grid item xs={3}>
                            <Fab size='large' component={Link} to={'/newCal'} 
                            variant="extended" color="primary" aria-label="add"
                            className={classes.fab1}
                            >
                                <AddIcon className={classes.extendedIcon}
                                />
                                New NIST Equipment Profile
                            </Fab>
                    </Grid>
                    <br />
                    {/* </Grid> */}
                </Grid> 
                <Grid container 
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center">
                    <Grid item  style={{textAlign:'left'}}>                    
                        <CalibrationStudyTable data={calSessData}
                        setShowInsertDl={setShowInsertDl}
                        enableTableClick={enableTableClick} /> 
                    </Grid>
                </Grid>
            </Grid>
            }
        {showInsertDl ? <InsertDlModal /> : null}
        {showCalibratingDl ? <CalibratingDlModal /> : null}
        {showCalibrationDone ? <CalibrationDoneModal /> : null}
        {showDlNotRecognized ? <DlNotRecognizedModal /> : null}
        {showReadingDlError ? <ReadingDlErrorModal /> : null}
        {showRetryGetConfig ? <RetryConnectionModal /> : null}
        {showCalibrationCannotBeDone ? <CalibrationCannotBeDoneModal/> : null}
        </div>
    ) 
}
export default CalibrationStudyView