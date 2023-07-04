import { Grid,Typography, Button, Box } from '@material-ui/core'
import React, {useState, useEffect, useRef} from 'react'
import { useFormik } from 'formik'
import NewStudyInformation from './NewStudyInformation'
import NewStudyParameters from './newStudyParameters'
import {Redirect, useHistory} from 'react-router-dom'
import {StudyServices} from '../../services/StudyServices'
import * as Yup from 'yup'
function CreateCompleteStudy(props) {
    let history = useHistory()
    const initialRender = useRef(true);
    const [submitting, setSubmitting] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const formik = useFormik({
        initialValues:{
            clientName:'',
            cleanRoomName:'',
            requestDate: new Date(),
            numDataloggers:'',
            highAlarmTemp: '',
            lowAlarmTemp: '',
            highAlarmRH: '',
            lowAlarmRH: '',
            startDate: new Date().toISOString,
            endDate: new Date().toISOString,
            samplingRate:'',
        },
        onSubmit: (values) => {
            setSubmitting(true)
        },
        validationSchema:Yup.object({
            clientName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .min(2, 'Must be 2 characters or more')
            .required('Required*'),
            cleanRoomName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .min(2, 'Must be 2 characters or more')
            .required('Required*'),
            requestDate : Yup.date()
            .max(Yup.ref('startDate'),'Needs to be before start day ')
            .required('Required*'),
            numDataloggers: Yup.number()
            .positive('Needs to be a positive number')
            .integer('Needs to be an integer')
            .required('Required*'), 
            lowAlarmTemp: Yup.number()
            .integer()
            .min(-40,'Equipment does not support any temperature lower than -40')
            .max(215,'Equipment does not support any temperature higher than 215')
            .lessThan(Yup.ref('highAlarmTemp'),'Needs to be lower than the high alarm')
            .required('Required*'),
            highAlarmTemp: Yup.number()
            .integer()
            .min(-40,'Equipment does not support any temperature lower than -40')
            .max(215,'Equipment does not support any temperature higher than 215')
            .moreThan(Yup.ref('lowAlarmTemp'),'Needs to be higher than the low alarm')
            .required('Required*'),
            lowAlarmRH: Yup.number()
            .integer()
            .min(0,'Equipment does not support any RH lower than 0')
            .max(120,'Equipment does not support any RH higher than 120')
            .lessThan(Yup.ref('highAlarmRH'),'Needs to be lower than the high alarm')
            .required('Required*'),
            highAlarmRH: Yup.number()
            .integer()
            .min(0,'Equipment does not support any RH lower than 0')
            .max(120,'Equipment does not support any RH higher than 120')
            .moreThan(Yup.ref('lowAlarmRH'),'Needs to be higher than the low alarm')
            .required('Required*'),
            startDate: Yup.date('Needs a date')
            .min(Yup.ref('requestDate'), 'Needs to be after request date')
            .max(Yup.ref('endDate'),'Needs to be before end date')
            .required('Required*'),
            endDate: Yup.date('Needs a date')
            .min(Yup.ref('startDate'), 'Needs to be after start date')
            .required('Required*'),
            samplingRate: Yup.number()
            .required('Required*')

        })
    });

    const handleClose = () =>{
        history.goBack()
    } 
    // useEffect to to create study
    useEffect(() => {
        if(initialRender.current){
            initialRender.current = false;
        }
        else{
            if(submitting){
                let study = {
                    cleanroomName:formik.values.cleanRoomName,
                    clientName:formik.values.clientName,
                    dataloggersQty:formik.values.numDataloggers,
                    maxRH:formik.values.highAlarmRH,
                    maxTemp:formik.values.highAlarmTemp,
                    minRH:formik.values.lowAlarmRH,
                    minTemp:formik.values.lowAlarmTemp,
                    projectName:formik.values.clientName + formik.values.requestDate + formik.values.cleanRoomName,
                    requestDate:formik.values.requestDate,
                    samplingFrequency:formik.values.samplingRate/60,
                    startDate:formik.values.startDate,
                    endDate:formik.values.endDate
                }
                /**
                 * @TODO get current user from auth amplify
                 * 
                 */
                let name = localStorage.getItem('name')
                let employeeId = localStorage.getItem('id')
                var stringArray = name.split(/(\s+)/);
                let fName = stringArray[0]
                let lName = stringArray[2]
                let reporter ={
                    fname:fName,
                    lname:lName,
                    employeeId: employeeId,
                }
                StudyServices.createNewStudy(study,reporter).then((resp) =>console.log(resp)).catch((err)=>console.log(err))

                
            }
        }
        return () => {
            setSubmitting(false)
            setRedirect(true)
        }
    }, [submitting])

    if(redirect){
        history.push('/home')
        return(<Redirect to='/'/>)

    }
    else{
        return (
            <div>
                <form  onSubmit={formik.handleSubmit}>
                    <Grid style={{display:'table'}} container spacing={3}>
                        <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                            <Grid item style={{display:'table-cell'}}> 
                                <Box p={2}>
                                    <Typography align='center' variant='h5'>Study Information</Typography>
                                    <NewStudyInformation formik={formik}></NewStudyInformation>
                                </Box>
                            </Grid>
                            <Grid item style={{display:'table-cell'}}> 
                                <Box p={2}>
                                    <Typography align='center' variant='h5'>Study Parameters</Typography>
                                    <NewStudyParameters formik={formik}></NewStudyParameters>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button color="primary" variant="contained" type="submit">
                            Submit
                        </Button>
                        <Button color="primary" variant="contained" onClick={handleClose} >
                            Cancel
                        </Button>
                    </Grid>
                </form>
            </div>
        )
    }
    
}

export default CreateCompleteStudy
