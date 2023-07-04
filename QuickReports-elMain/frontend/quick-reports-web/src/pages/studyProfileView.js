import React, {useState, useEffect, useRef} from 'react'
import StudyProfileComp from '../components/validationStudies/studyProfileComp'
import { Box, Grid, Paper } from '@material-ui/core'
import { useFormik } from 'formik'
import Modal from '@material-ui/core/Modal'
import InsertDlToProgram from '../components/modals/programmingDl/insertDLtoProgram';
import ProgrammingDL from '../components/modals/programmingDl/programmingDL';
import ProgrammingDoneDl from '../components/modals/programmingDl/programmingDone';
import DataloggerWithoutProfile from '../components/modals/programmingDl/dlWithoutProfileProg'
import ErrorReadingDl from '../components/modals/programmingDl/errorReadingDlProg'
import InsertDlToExtract from '../components/modals/extraction/insertDLtoExtract';
import ExtractingDL from '../components/modals/extraction/extractingDl';
import ExtractingDone from '../components/modals/extraction/dlExtracted';
import ErrorReadingDlExt from '../components/modals/extraction/errorReadingDlExt';
import ErrorWritingDlProg from '../components/modals/programmingDl/errorWritingDl';
import DataloggerNotInStudy from '../components/modals/extraction/dlNotInStudy'
import RetryConnectionExt from '../components/modals/extraction/retryConnection';
import RetryConnectionRead from '../components/modals/extraction/retryConnectionRead';
import RetryConnectionProg from '../components/modals/programmingDl/retryConnection';
import {StudyServices} from '../services/StudyServices'
import {useLocation} from "react-router-dom";
import {DataloggerConnection} from '../services/DLConnection'
import {DataloggerServices} from '../services/DataloggerServices'
import * as Yup from 'yup'

const {DateManager} = require('../dateManager');

function StudyProfileView(props) {   

    let data = useLocation()
    const {study} = data.state
    console.log(study)

    
    /**
     * 
     * @param {Date} someDate 
     * @returns 
     */
    const getCorrect = (someDate) => {
        console.log('desde el study prof view')
        console.log(someDate)
        if(typeof someDate == 'string' && someDate.length == 24){
            
        }
        someDate = DateManager.convertFullDateStringToObj(someDate)
        console.log(someDate)
        try{
            //let date = new Date(someDate)
            
            // let r = someDate.slice(0,16)
            console.log(`sending back ${someDate}`)
            // let sr = `${someDate.setFullYear()}-${(someDate.getMonth()<10 ? '0'+someDate.getMonth():someDate.getMonth())}-${(someDate.getDate()<10 ? '0'+someDate.getDate():someDate.getDate())}`
            // console.log(sr)
            return someDate
        }catch(e){
            console.log('this failed sad :(')
            return '2012:12:12T12:12'
        }
    }

    const getCorrect2 = (someDate) => {
        console.log('desde el study prof view')
        console.log(someDate)
        someDate = DateManager.convertReqDateStringToObj(someDate)
        console.log(someDate)
        try{
            // let date = new Date(someDate)
            let r = someDate.toISOString().slice(0,10)
            console.log(`sending back ${r}`)
            return r
        }catch(e){
            console.log('this failed sad :(')
            return '1212:12:12T12:12'
        }
    }

    const formik = useFormik({
        initialValues: {
            studyID: props.match.params.studyID,
            client : study.clientName,
            cleanroomName: study.cleanroomName,
            reqDate :getCorrect2(study.requestDate),
            reporter : study.reporter,
            status :study.status,
            tempHighAlarm :study.maxTemp,
            tempLowAlarm : study.minTemp,
            rhHighAlarm :study.maxRH,
            rhLowAlarm: study.minRH,
            samplingRate: study.samplingFrequency*60,
            dataloggersQty: study.dataloggersQty,
            startDate:getCorrect(study.startDate),
            endDate:getCorrect(study.endDate)
        },
        enableReinitialize:true,
        onSubmit: (values) => {
            if(readOnly){}
        },
        validationSchema: Yup.object({
            studyID: Yup.string(),
            client : Yup.string()
            .required('Required*'),
            cleanroomName: Yup.string()
            .required('Required*'),
            reqDate : Yup.date()
            .max(Yup.ref('startDate'),'Needs to be before ')
            .required('Required*'),
            reporter : Yup.string()
            .required('Required*'),
            status : Yup.string(),
            tempHighAlarm :Yup.number()
            .integer()
            .moreThan(Yup.ref('tempLowAlarm'),'Needs to be higher than low alarm')
            .min(-40,'Equipment does not support any temperature lower than -40')
            .max(215,'Equipment does not support any temperature higher than 215')
            .required('Required*'),
            tempLowAlarm : Yup.number()
            .integer()
            .lessThan(Yup.ref('tempHighAlarm'),'Needs to be lower than high alarm')
            .min(-40,'Equipment does not support any temperature lower than -40')
            .max(215,'Equipment does not support any temperature higher than 215')
            .required('Required*'),
            rhHighAlarm :Yup.number()
            .positive('Needs to be a positive integer')
            .moreThan(Yup.ref('rhLowAlarm'),'Needs to be higher than low alarm')
            .min(0,'Equipment does not support any RH lower than 0')
            .max(120,'Equipment does not support any RH higher than 120')
            .required('Required*'),
            rhLowAlarm: Yup.number()
            .positive('Needs to be a positive integer')
            .lessThan(Yup.ref('rhHighAlarm'),'Needs to be lower than high alarm')
            .min(0,'Equipment does not support any RH lower than 0')
            .max(120,'Equipment does not support any RH higher than 120')
            .required('Required*'),
            samplingRate: Yup.number()
            .positive('Needs to be a positive integer')
            .required('Required*'),
            dataloggersQty: Yup.number()
            .required('Required*'),
            startDate: Yup.date()
            .min(new Date())
            .max(Yup.ref('endDate'),'Needs to be before end date')
            .required('Required*'),
            endDate: Yup.date()
            .min(Yup.ref('startDate'), 'Needs to be after start date')
            .required('Required*')
        })
    });
    
    // hook for showing programming DL modal
    const [showProgrammingDl, setShowProgrammingDl] = useState(false);
    const handleProgrammingDlClose = () => setShowProgrammingDl(false);
    // hook for including in the modal the connected datalogger
    const [connectedDl, setConnectedDl] = useState(2);
    // hook for showing insert DL to program modal
    const [showInsertDl, setShowInsertDl] = useState(false);
    const handleInsertDlClose = () => setShowInsertDl(false);
    // hook for showing Dl Programmed modal
    const [showProgrammingDone, setShowProgrammingDone] = useState(false);
    const handleProgrammingDoneClose = () => setShowProgrammingDone(false);
    // hook for showing DL not recognized modal
    const [showDlNotRecognized, setShowDlNotRecognized] = useState(false);
    const handleDlNotRecognizedClose = () => setShowDlNotRecognized(false);
    // hook for showing insert DL to extract data modal
    const [showInsertDlToExtract, setShowInsertDlToExtract] = useState(false);
    const handeInsertDlToExtractClose = () => setShowInsertDlToExtract(false);

    // hook for showing extracting DL modal
    const [showExtractingDl, setShowExtractingDl] = useState(false);
    const handleExtractingDlClose = () => setShowExtractingDl(false);
    // hook for showing reading dl error when programming 
    const [showReadingDlError, setShowReadingDlError] = useState(false);
    const handleReadingDlErrorClose = () => setShowReadingDlError(false);
    // hook for showing Dl extracted modal
    const [showExtractingDone, setShowExtractingDone] = useState(false);
    const handleExtractingDoneClose = () => setShowExtractingDone(false);
    // hook for showing reading error when extracting
    const [showReadingDlErrorExt, setShowReadingDlErrorExt] = useState(false);
    const handleReadingDlErrorExtClose = () => setShowReadingDlErrorExt(false);
    // hook for showing dl not in study 
    const [showDlNotInStudy, setShowDlNotInStudy] = useState(false);
    const handleDlNotInStudyClose = () => setShowDlNotInStudy(false);

    // hook for when datalogger is not connected to the system on extraction
    const [showRetryExt, setShowRetryExt] = useState(false);
    const handleShowRetryExtClose = () => setShowRetryExt(false);

    // hook for when the datalogger is not connected to the system on programming
    const [showRetryProg, setShowRetryProg] = useState(false);
    const handleShowRetryProgClose = () => setShowRetryProg(false);

    // hook for when datalogger is not connected to the system on extraction p2
    const [showRetryExtReading, setShowRetryExtReading] = useState(false);
    const handleShowRetryExtReadingClose = () => setShowRetryExtReading(false);
    
    // hook for when datalogger is not connected to the system on programming writing
    const [showRetryProgWriting, setShowRetryProgWriting] = useState(false);
    const handleShowRetryProgWritingClose = () => setShowRetryProgWriting(false);
    
    // Read only variable for editing 
    const [readOnly, setReadOnly] = useState(true);

    // datalogger is inserted
    const [insertedDlExtractor, setInsertedDlExtractor] = useState(false);
    const [insertedDlProgramming, setInsertedDlProgramming] = useState(false);

    // program the dataloggers with the study parameters
    const letsProgram = async () => {
        // apagar insert
        setShowInsertDl(false);
        // show programming
        setShowProgrammingDl(true);
        // get config block for DL
        let block = await DataloggerConnection.getDetails();
            // if received
            if (block){
                // get all dataloggers
                let dataloggers = await DataloggerServices.getAll();
                // find the current in the list
                for (let i = 0; i < dataloggers.length; i++){
                    // if present 
                    if (block.name == dataloggers[i].dlName){
                        // get params to program from the formik values
                        let paramsToProgram={
                            maxRH:formik.values.rhHighAlarm,
                            maxTemp:formik.values.tempHighAlarm,
                            minRH:formik.values.rhLowAlarm,
                            minTemp:formik.values.tempLowAlarm,
                            samplingFrequency:formik.values.samplingRate,
                            cleanroomName: formik.values.cleanroomName,
                            clientName:formik.values.client,
                            dataloggersQty:formik.values.dataloggersQty,
                            endDate:formik.values.endDate,
                            id:formik.values.studyID,
                            reporter:formik.values.reporter,
                            requestDate:formik.values.reqDate,
                            startDate:formik.values.startDate,
                            status:formik.values.status
                        }
                        console.log('lo que voy a programar')
                        console.log(paramsToProgram);
                        // backend function to program
                        let prog = await StudyServices.programAndAddToStudy(paramsToProgram);
                            // if programmed
                            if (prog){
                                // hide programming
                                setShowProgrammingDl(false);
                                // show programming done
                                setShowProgrammingDone(true);
                                return;
                            }
                            // else (not programmed)
                            else{
                                // hide programming
                                setShowProgrammingDl(false);
                                // set show retry prog writing
                                setShowRetryProg(true);
                            }           
                    }
                }
                // else (not present)
                // show DL not recognized
                setShowDlNotRecognized(true);
                // set inserted Dl false
                setInsertedDlProgramming(false);
                // hide programming
                setShowProgrammingDl(false);
            }
            // if not 
            else{
                // show retry prog
                setShowRetryProg(true);
                // hide programming
                setShowProgrammingDl(false);
                // set inserted DL programming false
                setInsertedDlProgramming(false);
                // return
                return;
            }       
    }

    // extract readings from the dataloggers into the study

    const letsExtract = async () => {
        // hide insert to extract
        setShowInsertDlToExtract(false);
        // show extracting
        setShowExtractingDl(true);
        // get config block
        let block = await DataloggerConnection.getDetails();
            // if yes
            if (block){
                // get DLs in study
                let studyDls = await StudyServices.getDataloggersInStudy(study);
                // find the dl in the study
                for (let i = 0; i < studyDls.length; i++){
                    // if yes
                    if (block.name == studyDls[i].dlName){
                        // setInsertedDlExtractor false
                        setInsertedDlExtractor(false);
                        // backend function to extract readings
                        let readings = await StudyServices.extractReadings(study);
                            // if yes
                            if (readings){
                                // hide extracting dl
                                setShowExtractingDl(false);
                                // show extracting done 
                                setShowExtractingDone(true);
                                // return 
                                return;
                            }
                            // else
                            else{
                                // hide extracting
                                setShowExtractingDl(false);
                                // set show retry extract
                                setShowRetryExt(true);
                                // return 
                                return;
                            }
                    }
                }
                setShowExtractingDl(false);
                // set show dl not in study
                setShowDlNotInStudy(true);
                // set inserted dl extractor false
                setInsertedDlExtractor(false);
                // return 
                return;
            }
            else{
                setShowExtractingDl(false);
                // show retry ext 
                setShowRetryExt(true);
                // set inserted dl extractor false
                setInsertedDlExtractor(false);
                // show insert dl to extract
                return;
            }          
    };

    

    const RetryConnectionWriteModal = () => {
        return (
            <Modal open={showRetryProgWriting} onClose={handleShowRetryProgWritingClose}>
                <ErrorWritingDlProg 
                    setShowInsertDl={setShowInsertDl}
                    setShowRetry={setShowRetryProgWriting}
                />
            </Modal>
        )
    }


    const RetryConnectionReadModal = () => {
        return (
            <Modal open={showRetryExtReading} onClose={handleShowRetryExtReadingClose}>
                <RetryConnectionRead 
                    setShowInsertDlToExtract={setShowInsertDlToExtract}
                    setShowRetry={setShowRetryExtReading}
                />
            </Modal>
        )
    }


    const RetryConnectionProgModal = () => {
        return( <Modal open={showRetryProg} onClose={handleShowRetryProgClose}>
            <RetryConnectionProg 
                setShowRetry={setShowRetryProg}
                setShowInsertDlToProgram={setShowInsertDl}
            />
        </Modal>)
    }

    const RetryConnectionExtModal = () => {
        return(
            <Modal open={showRetryExt} onClose={handleShowRetryExtClose}>
                <RetryConnectionExt 
                setShowRetry = {setShowRetryExt}
                setShowInsertDlToExtract={setShowInsertDlToExtract}
                />
            </Modal>
            
        )
    }

    const InsertDlToProgramModal = () => {
        return (
            <Modal open={showInsertDl} onClose={handleInsertDlClose}>
                <InsertDlToProgram
                    letsProgram={letsProgram} 
                    setInsertedDlProgramming={setInsertedDlProgramming}
                />
            </Modal>
        )
    };

    const ProgrammingDlModal = () => {
        return(
            <Modal open={showProgrammingDl} onClose={handleProgrammingDlClose}>
                <ProgrammingDL 
                setShowProgrammingDl={setShowProgrammingDl}
                setShowProgrammingDone={setShowProgrammingDone}
                />
            </Modal>
        )
    }

    const ProgrammingDoneModal = () => {
        return(
            <Modal open={showProgrammingDone} onClose={handleProgrammingDoneClose}>
                <ProgrammingDoneDl
                setShowProgrammingDone={setShowProgrammingDone}
                setShowInsertDl={setShowInsertDl}
                />
            </Modal>
        )
    }

    const DlNotRecognizedModal = () => {
        return(
            <Modal open={showDlNotRecognized} onClose={handleDlNotRecognizedClose}>
                <DataloggerWithoutProfile
                    setShowInsertDl={setShowInsertDl}
                    setShowDlNotRecognized={setShowDlNotRecognized}
                />
            </Modal>
        )
    }


    const ReadingDlErrorModal = () => {
        return(
            <Modal open={showReadingDlError} onClose={handleReadingDlErrorClose}>
                <ErrorReadingDl 
                    setShowReadingDlError={setShowReadingDlError}
                    setShowInsertDl={setShowInsertDl}
                />
            </Modal>
        )
    }

    const InsertDlToExtractModal = () => {
        return(
            <Modal open={showInsertDlToExtract} onClose={handeInsertDlToExtractClose}>
                <InsertDlToExtract
                    letsExtract={letsExtract}
                    insertedDlExtractor={insertedDlExtractor}
                    setInsertedDlExtractor={setInsertedDlExtractor}
                    setShowInsertDlToExtract={setShowInsertDlToExtract}
                    setShowExtractingDl={setShowExtractingDl}
                    setShowDlNotInStudy={setShowDlNotInStudy}
                />
            </Modal>
        )
    }

    const ExtractingDlModal = () => {
        return(
            <Modal open={showExtractingDl} onClose={handleExtractingDlClose}>
                <ExtractingDL dlId={connectedDl}
                />
            </Modal>
        )
    }


    const ExtractingDoneModal = () => {
        return(
            <Modal open={showExtractingDone} onClose={handleExtractingDoneClose}>
                <ExtractingDone 
                setShowExtractingDone={setShowExtractingDone}
                setShowInsertDlToExtract={setShowInsertDlToExtract}
                dlId={connectedDl}
                setConnectedDl={setConnectedDl}
                connectedDl={connectedDl}
                />
            </Modal>
        )
    };



    const ReadingDlErrorExtrModal = () => {
        return (
            <Modal open={showReadingDlErrorExt} onClose={handleReadingDlErrorExtClose}>
                <ErrorReadingDlExt 
                setShowReadingDlErrorExt={setShowReadingDlErrorExt}
                setShowInsertDlToExtract={setShowInsertDlToExtract}
                />
            </Modal>
        )
    };


    const DlNotInStudyModal = () => {
        return(
            <Modal open={showDlNotInStudy} onClose={handleDlNotInStudyClose}>
                <DataloggerNotInStudy
                    setShowInsertDlToExtract={setShowInsertDlToExtract}
                    setShowDlNotInStudy={setShowDlNotInStudy}
                />
            </Modal>
        )
    }



    const handleEdit = () => {
        // if editting equals false, change to true
        if (readOnly) {
            setReadOnly(false);
            return
        }
        else{
        // if Editting, wait for done signal 
        let updatedStudy ={
            id:formik.values.studyID,
            clientName: formik.values.client,
            requestDate: formik.values.reqDate,
            maxTemp: formik.values.tempHighAlarm,
            minTemp: formik.values.tempLowAlarm,
            maxRH: formik.values.rhHighAlarm,
            minRH: formik.values.rhLowAlarm,
            dataloggersQty: formik.values.dataloggersQty,
            cleanroomName: formik.values.cleanroomName,
            samplingFrequency: formik.values.samplingRate,
            startDate: formik.values.startDate,
            endDate: formik.values.endDate,
        }
        console.log(updatedStudy)
        // console.log(updatedStudy)
        StudyServices.update(updatedStudy).then((resp)=>{
            // console.log(resp)
        })
        setReadOnly(true)
        }

    };

    return (
    <div>
        <Grid container 
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center">
            <Box p ={3}>
            <Paper style={{width:'100%'}}>
                <Box p ={3}>
                    <Grid item>
                        <h2>Study Profile</h2>
                    </Grid>
                    <Grid item>
                        <StudyProfileComp study={study} handleEdit={handleEdit} readOnly={readOnly} formik={formik} studyID={props.match.params.studyID} 
                            setShowInsertDl={setShowInsertDl} setShowInsertDlToExtract={setShowInsertDlToExtract}
                            />
                    </Grid>
                </Box>
            </Paper>
            </Box>
        </Grid>

            {/* programming Dl */}
            {showInsertDl ? <InsertDlToProgramModal /> : null}
            {showProgrammingDl ? <ProgrammingDlModal /> : null}
            {showProgrammingDone ? <ProgrammingDoneModal /> : null}
            {showDlNotRecognized ? <DlNotRecognizedModal/> : null}
            {showReadingDlError ? <ReadingDlErrorModal/> : null}
            {/* Extracting Dl */}
            {showInsertDlToExtract ? <InsertDlToExtractModal /> : null}
            {showExtractingDl ? <ExtractingDlModal /> : null}
            {showExtractingDone ? <ExtractingDoneModal /> : null}
            {showReadingDlErrorExt ? <ReadingDlErrorExtrModal /> : null}
            {showDlNotInStudy ? <DlNotInStudyModal/> : null}
            {showRetryExt ? <RetryConnectionExtModal /> : null }
            {showRetryProg ? <RetryConnectionProgModal /> : null }
            {showRetryExtReading ? <RetryConnectionReadModal /> : null}
            {showRetryProgWriting ? <RetryConnectionWriteModal /> : null}
            
            </div>
    )
}

export default StudyProfileView