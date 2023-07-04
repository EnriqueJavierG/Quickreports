import React, {useState, useRef, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import NistProfileComp from '../components/calibrationStudies/nistProfileComponent'
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import { useFormik } from 'formik';
import {useLocation} from "react-router-dom";
import { CalibrationServices } from '../services/CalibrationServices';

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
        position: 'absolute',
        top: theme.spacing(80),
        right: theme.spacing(37),
    },
    fab1: {
        position: 'absolute',
        top: theme.spacing(80),
        right: theme.spacing(143),
    }
}));


function NistProfileView(props) {

    const classes = useStyles();

    // use location to get the cal sess primary key from the link
    let data = useLocation();
    const {calSessPk} = data.state;

    const [readOnly, setReadOnly] = useState(true);

    // hook to store the calibration object
    const [calSessObj, setCalSessObj] = useState({});


    // useEffect to get the calibration object to fill the formik initial values
    useEffect(()=>{
        async function myApiCalls(){
            let [calSessObject] = await CalibrationServices.getById(calSessPk);
            setCalSessObj({
                nistManuf: calSessObject.nist_manufacturer, // visible
                nistNumber : calSessObject.nist_number,// visible
                nistModel : calSessObject.nist_model,// visible
                nistSerNum : calSessObject.nist_serial_number,// visible
                lowTemp : calSessObject.nom_low_temp,
                lowTempTs : calSessObject.nom_low_temp_ts.slice(0,16),
                medTemp : calSessObject.nom_med_temp,
                medTempTs : calSessObject.nom_med_temp_ts.slice(0,16),// visible
                highTemp : calSessObject.nom_high_temp,
                highTempTs: calSessObject.nom_high_temp_ts.slice(0,16),
                lowRh : calSessObject.nom_low_rh,
                lowRhTs : calSessObject.nom_low_rh_ts.slice(0,16),
                medRh : calSessObject.nom_med_rh,
                medRhTs : calSessObject.nom_med_rh_ts.slice(0,16),
                highRh :calSessObject.nom_high_rh,
                highRhTs : calSessObject.nom_high_rh_ts.slice(0,16),
                calDate: calSessObject.nom_low_temp_ts.slice(0,10)// visible
            });
            console.log(calSessObject.nom_low_temp, typeof calSessObject.nom_low_temp)
        }
        myApiCalls();
    },[]);

 
    // console.log('ANTES DE PASARLO')
    // console.log(calSessObj)
    const formik = useFormik({
        validationSchema:Yup.object({
            nistManuf: Yup.string(),
            nistNumber : Yup.string(),
            nistModel : Yup.string(),
            nistSerNum :Yup.string(),
            lowTemp : Yup.number(),
            lowTempTs : Yup.date(),
            medTemp : Yup.number(),
            medTempTs : Yup.date(),
            highTemp : Yup.number(),
            highTempTs: Yup.date(),
            lowRh : Yup.number(),
            lowRhTs : Yup.date(),
            medRh : Yup.number(),
            medRhTs : Yup.date(),
            highRh :Yup.number(),
            highRhTs :Yup.date(),
            calDate: Yup.date()
        }),
        enableReinitialize:true,
        initialValues: calSessObj,
        onSubmit: (values) => {
            // if(readOnly){
            //     alert(JSON.stringify(values, null, 2));
            // }
            
        },
    });

    const handleEdit = () => {
        if (readOnly) { 
            setReadOnly(false);
            return
        }
        console.log('los formiks values')
        console.log(formik.values)
        CalibrationServices.update(
            {
                id: calSessPk,
                ...formik.values
            }
        )
        // alert('Sending Update')
        setReadOnly(true)
    };


    
    if(!calSessObj.lowTemp){
        return(
            <div>
                Loading ... 
            </div>
        )
    }
    
    return (
        <div>
            <Grid container xs={12} justify='center'>
                <Grid item xs={9} style={{textAlign:'left'}}>
                    <br />
                    <h2>
                    NIST Equipment Profile
                    </h2>
                    <br />
                </Grid>
                <form onSubmit={formik.handleSubmit}>
                    <Grid item xs={11} style={{textAlign:'left'}}>
                        <NistProfileComp
                            formik={formik}
                            readOnly={readOnly}
                        />
                    </Grid>
                    <Grid container justify="center" directon="row" > 
                        <Grid item xs={4} justify="flex-start"> 
                            <Fab component={Link} to={'/home'} size='large' variant="extended" aria-label="add">
                                Back 
                            </Fab>
                        </Grid>
                        <Grid item xs={4} justify="flex-end" > 
                            <Fab size='large' variant="extended" color="primary" aria-label="add" type="submit"
                            onClick={handleEdit}>
                                {readOnly ? <EditIcon className={classes.extendedIcon} />: <DoneIcon className={classes.extendedIcon}/>}
                                {readOnly ? 'EDIT': 'DONE'}
                            </Fab>
                        </Grid>
                    </Grid>
                </form>
            </Grid> 
        </div>
    )
}

export default NistProfileView
