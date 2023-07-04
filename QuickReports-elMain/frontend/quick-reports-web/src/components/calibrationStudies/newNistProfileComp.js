import React, {useState, useEffect, useRef} from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Typography, TextField, Box} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useFormik } from 'formik'
import {CalibrationServices} from '../../services/CalibrationServices';
import { Redirect } from 'react-router';
import * as Yup from 'yup'

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
        marginTop: 300,
        top: 385,
        right:'85%',
        bottom:'auto',
        left: 'auto',
        position: 'fixed',
    },
    fab1: {
        marginTop: 300,
        top: 385,
        right:'8%',
        bottom:'auto',
        left: 'auto',
        position: 'fixed',
    }
}));

/**
 * 
 * @returns form for creating new calibration session
 */
function NewNistProfileComp() {

    const classes = useStyles();

    // hook for onSubmit
    const [submit, setSubmit] = useState(false);
    const [redirect, setRedirect] = useState(false);

    let calSess={
        nistManuf:'', 
        nistNumber:'',
        nistModel: '',
        nistSerNum: '',
        lowTemp: '',
        lowTempTs: '',
        medTemp: '',
        medTempTs: '',
        highTemp: '',
        highTempTs: '',
        lowRh: '',
        lowRhTs: '',
        medRh:'',
        medRhTs: '',
        highRh: '',
        highRhTs: ''
    }

    const initialRender = useRef(true);

    const formik = useFormik({
        initialValues: {
            manufacturer: '',
            nistNumber: '',
            model: '',
            serialNumber: '',
            calibrationDate: new Date(),
            nomLowTemp: '',
            nomLowTempTs: new Date(),
            nomMedTemp: '',
            nomMedTempTs: new Date(),
            nomHighTemp: '',
            nomHighTempTs: new Date(),
            nomLowRh: '',
            nomLowRhTs: new Date(),
            nomMedRh: '',
            nomMedRhTs: new Date(),
            nomHighRh: '',
            nomHighRhTs: new Date()
        },
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            setSubmit(true);
        },
        validationSchema:Yup.object({
            manufacturer: Yup.string()
            .required('Required'),
            nistNumber:Yup.string()
            .required('Required'),
            model:Yup.string()
            .required('Required'),
            serialNumber:Yup.string()
            .required('Required'),
            calibrationDate: Yup.date()
            .required('Required'),
            nomLowTemp: Yup.number()
            .lessThan(Yup.ref('nomMedTemp'), 'Needs to be lower than nominal medium')
            .moreThan(0, 'Needs to be higher than 0')
            .required('Required'),
            nomLowTempTs: Yup.date()
            .required('Required'),
            nomMedTemp: Yup.number()
            .lessThan(Yup.ref('nomHighTemp'), 'Needs to be lower than nominal high')
            .moreThan(Yup.ref('nomLowTemp'), 'Needs to be higher than nominal low')
            .required('Required'),
            nomMedTempTs: Yup.date()
            .required('Required'),
            nomHighTemp: Yup.number()
            .moreThan(Yup.ref('nomMedTemp'), 'Needs to be higher than nominal medium')
            .required('Required'),
            nomHighTempTs: Yup.date()
            .required('Required'),
            nomLowRh: Yup.number()
            .required('Required'),
            nomLowRhTs: Yup.date()
            .required('Required'),
            nomMedRh: Yup.number()
            .required('Required'),
            nomMedRhTs: Yup.date()
            .required('Required'),
            nomHighRh: Yup.number()
            .required('Required'),
            nomHighRhTs: Yup.date()
            .required('Required')
    
        })
    });


    useEffect(()=>{
        if(initialRender.current){
            initialRender.current = false;
        }
        else{
            if(submit){
                async function myApiCalls(){
                    calSess.nistManuf = formik.values.manufacturer;
                    calSess.nistNumber = formik.values.nistNumber;
                    calSess.nistModel = formik.values.model;
                    calSess.nistSerNum = formik.values.serialNumber;
                    calSess.lowTemp = formik.values.nomLowTemp;
                    calSess.lowTempTs = formik.values.nomLowTempTs;
                    calSess.medTemp = formik.values.nomMedTemp;
                    calSess.medTempTs = formik.values.nomMedTempTs;
                    calSess.highTemp = formik.values.nomHighTemp;
                    calSess.highTempTs = formik.values.nomHighTempTs;
                    calSess.lowRh = formik.values.nomLowRh;
                    calSess.lowRhTs = formik.values.nomLowRhTs;
                    calSess.medRh = formik.values.nomMedRh;
                    calSess.medRhTs = formik.values.nomMedRhTs;
                    calSess.highRh = formik.values.nomHighRh;
                    calSess.highRhTs = formik.values.nomHighRhTs;
                    CalibrationServices.addNewCalSess(calSess);  
                    setRedirect(true);
                }
                myApiCalls();
            }
        }
    }, [submit]); //submit
    
    if (redirect){
        return(
            <Redirect to='/home'/>
        )
    }
    else{
        return (
            <div >
                <form onSubmit={formik.handleSubmit}>
                <Paper>
                    <Box p={2}>
                        <Grid style={{display:'table'}} container spacing={2}> 
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography>Manufacturer: </Typography>
                                        <TextField size='small' 
                                            id="manufacturer"
                                            name="manufacturer"
                                            value={formik.values.manufacturer}
                                            onChange={formik.handleChange}
                                            variant='outlined'
                                            error={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
                                            helperText={formik.touched.manufacturer && formik.errors.manufacturer}
                                            />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography>NIST Number: </Typography>
                                        <TextField size='small' 
                                            id="nistNumber"
                                            name="nistNumber"
                                            value={formik.values.nistNumber}
                                            variant='outlined'
                                            onChange={formik.handleChange}
                                            error={formik.touched.nistNumber && Boolean(formik.errors.nistNumber)}
                                            helperText={formik.touched.nistNumber && formik.errors.nistNumber}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography>Model: </Typography>
                                        <TextField size='small' 
                                            id="model"
                                            name="model"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            variant='outlined'
                                            error={formik.touched.model && Boolean(formik.errors.model)}
                                            helperText={formik.touched.model && formik.errors.model}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography>Serial Number: </Typography>
                                        <TextField 
                                            size='small' 
                                            id="serialNumber"
                                            name="serialNumber"
                                            value={formik.values.serialNumber}
                                            variant='outlined'
                                            onChange={formik.handleChange}
                                            error={formik.touched.serialNumber && Boolean(formik.errors.serialNumber)}
                                            helperText={formik.touched.serialNumber && formik.errors.serialNumber}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography>Calibration Date: </Typography>
                                        <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="calibrationDate"
                                            name="calibrationDate"
                                            type="date"
                                            value={formik.values.calibrationDate}
                                            onChange={formik.handleChange}
                                            error={formik.touched.calibrationDate && Boolean(formik.errors.calibrationDate)}
                                            helperText={formik.touched.calibrationDate && formik.errors.calibrationDate}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                    
                    
                        {/* nominal readings for temperature */}
                <Paper>
                    <Box p={2}>
                        <Grid style={{display:'table'}} container spacing={2}>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                        <Typography> Nominal Low Temperature (F°): </Typography>
                                        <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="nomLowTemp"
                                            name="nomLowTemp"
                                            type="number"
                                            value={formik.values.nomLowTemp}
                                            step={1.0}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomLowTemp && Boolean(formik.errors.nomLowTemp)}
                                            helperText={formik.touched.nomLowTemp && formik.errors.nomLowTemp}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Timestamp: </Typography>
                                        <TextField 
                                        size='small'
                                        variant='outlined'
                                        id="nomLowTempTs"
                                        name="nomLowTempTs"
                                        type="datetime-local"
                                        value={formik.values.nomLowTempTs}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomLowTempTs && Boolean(formik.errors.nomLowTempTs)}
                                        helperText={formik.touched.nomLowTempTs && formik.errors.nomLowTempTs}
                                    />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Nominal Med Temperature (F°): </Typography>
                                        <TextField 
                                            // label="Required"
                                            size='small'
                                            variant='outlined'
                                            id="nomMedTemp"
                                            name="nomMedTemp"
                                            type="number"
                                            value={formik.values.nomMedTemp}
                                            step={1.0}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomMedTemp && Boolean(formik.errors.nomMedTemp)}
                                            helperText={formik.touched.nomMedTemp && formik.errors.nomMedTemp}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Timestamp: </Typography>
                                            <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="nomMedTempTs"
                                            name="nomMedTempTs"
                                            type="datetime-local"
                                            value={formik.values.nomMedTempTs}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomMedTempTs && Boolean(formik.errors.nomMedTempTs)}
                                            helperText={formik.touched.nomMedTempTs && formik.errors.nomMedTempTs}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Nominal High Temperature (F°):  </Typography>
                                        <TextField 
                                            // label="Required"
                                            size='small'
                                            variant='outlined'
                                            id="nomHighTemp"
                                            name="nomHighTemp"
                                            type="number"
                                            value={formik.values.nomHighTemp}
                                            step={1.0}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomHighTemp && Boolean(formik.errors.nomHighTemp)}
                                            helperText={formik.touched.nomHighTemp && formik.errors.nomHighTemp}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Timestamp: </Typography>
                                        <TextField 
                                        size='small'
                                        variant='outlined'
                                        id="nomHighTempTs"
                                        name="nomHighTempTs"
                                        type="datetime-local"
                                        value={formik.values.nomHighTempTs}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomHighTempTs && Boolean(formik.errors.nomHighTempTs)}
                                        helperText={formik.touched.nomHighTempTs && formik.errors.nomHighTempTs}
                                    />
                                    </Box>
                                </Grid>
                            </Grid>
                             {/* nominal readings for relative humidity */}
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Nominal Low Relative Humidity(%): </Typography>
                                        <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="nomLowRh"
                                            name="nomLowRh"
                                            type="number"
                                            value={formik.values.nomLowRh}
                                            step={0.5}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomLowRh && Boolean(formik.errors.nomLowRh)}
                                            helperText={formik.touched.nomLowRh && formik.errors.nomLowRh}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}> 
                                        <Typography> Timestamp: </Typography>
                                        <TextField 
                                        size='small'
                                        variant='outlined'
                                        id="nomLowRhTs"
                                        name="nomLowRhTs"
                                        type="datetime-local"
                                        value={formik.values.nomLowRhTs}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomLowRhTs && Boolean(formik.errors.nomLowRhTs)}
                                        helperText={formik.touched.nomLowRhTs && formik.errors.nomLowRhTs}
                                    />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Nominal Med Relative Humidity(%): </Typography>
                                        <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="nomMedRh"
                                            name="nomMedRh"
                                            type="number"
                                            value={formik.values.nomMedRh}
                                            step={0.5}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomMedRh && Boolean(formik.errors.nomMedRh)}
                                            helperText={formik.touched.nomMedRh && formik.errors.nomMedRh}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Timestamp: </Typography>
                                        <TextField 
                                        size='small'
                                        variant='outlined'
                                        id="nomMedRhTs"
                                        name="nomMedRhTs"
                                        type="datetime-local"
                                        value={formik.values.nomMedRhTs}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomMedRhTs && Boolean(formik.errors.nomMedRhTs)}
                                        helperText={formik.touched.nomMedRhTs && formik.errors.nomMedRhTs}
                                    />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Nominal High Relative Humidity(%):</Typography>
                                        <TextField 
                                            size='small'
                                            variant='outlined'
                                            id="nomHighRh"
                                            name="nomHighRh"
                                            type="number"
                                            value={formik.values.nomHighRh}
                                            step={0.5}
                                            onChange={formik.handleChange}
                                            error={formik.touched.nomHighRh && Boolean(formik.errors.nomHighRh)}
                                            helperText={formik.touched.nomHighRh && formik.errors.nomHighRh}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item style={{display:'table-cell'}}>
                                    <Box p ={2}>
                                    <Typography> Timestamp: </Typography>
                                        <TextField
                                        size='small'
                                        variant='outlined' 
                                        id="nomHighRhTs"
                                        name="nomHighRhTs"
                                        type="datetime-local"
                                        value={formik.values.nomHighRhTs}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomHighRhTs && Boolean(formik.errors.nomHighRhTs)}
                                        helperText={formik.touched.nomHighRhTs && formik.errors.nomHighRhTs}
                                    />
                                    </Box>
                                </Grid>
                            </Grid>    
                        </Grid>
                    </Box>
                </Paper>
                    <Fab component={Link} to={'/home'} size='large' variant="extended" className={classes.fab} aria-label="add">
                        Cancel
                    </Fab>
                    <Fab size='large' variant="extended" className={classes.fab1} color="primary" aria-label="add" type="submit">
                        <SaveIcon className={classes.extendedIcon} />
                        SAVE
                    </Fab>
                </form>
            </div>
        )
    }
}

export default NewNistProfileComp
