import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import React , {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { Tooltip } from '@material-ui/core';

function ReleaseForm(props) {

    const manageSignature = () => {
        if (checked){
            // isSigned lo asigne al estudio actual
            props.setIsSigned({studyID: props.studyID, isSigned: true});
            // setee el warning a no show en el card con el estudio actual
            props.setShowWarning(false);
        }
        else{
            // isSigned lo asigne al estudio actual
            props.setIsSigned({studyID: props.studyID, isSigned: false});
        }
        // cierre el modal
        props.handleClose()
        props.setSubmit(true);
    }

    const [checked, setChecked] = useState(false);
    
    const handleChange = (event) => {
        setChecked(event.target.checked);
      };

    return(
        <>
        <div style={{ minWidth:'60%',position: 'absolute', left:'50%',top:'50%',
        transform: 'translate(-50%, -50%)' }}>
        <Paper elevation={3} align = "center" >
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid container direction="column" justify="center">

                        <h2>EQUIPMENT RELEASE FORM </h2>
                </Grid>
                <Grid container direction="column" justify="flex-start">
                    <Grid item>
                    
                        <br/>
                        <u>Company:</u> {props.clientName}   
                        <br/>
                        <br/>
                        <u>Study:</u> {props.projectName}
                    </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" justify="space-around">
                    <Grid item>
                    <u> Description:</u> EZ - Temperature & Humidity Loggers
                    </Grid>
                    <Grid item>
                    <u>Quantity:</u> {props.dlQty}
                    </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                    <div>
                    <Tooltip title="Agree to Terms">
                        <Checkbox
                            style={{float: "left", width: "5%"}}
                            color="primary"
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Tooltip>
                    {/* </Grid>
                    <Grid item> */}
                    I, in representation of <strong> {props.clientName}</strong>, assume total responsibility over the validation equipment 
                    rented by CIQA to perform thermal studies. 
                    </div>
                    </Grid>
                </Grid>
                <br/>
                <Grid container direction="column" justify="flex-end">
                    <Grid item>
                        <u>Today's Date:</u> {new Date().toLocaleString()}
                    </Grid>
                </Grid>
            </Grid>
            <Tooltip title='Done'>
            <Button size="large" 
            style={{position: 'relative', left: '40%'}}
            onClick={()=>manageSignature()}> 
                 <DoneOutlineIcon /> 
                {/* Done */}
            </Button>
            </Tooltip>
        </Paper>
            
            </div>

        </>
    )
}

export default ReleaseForm;