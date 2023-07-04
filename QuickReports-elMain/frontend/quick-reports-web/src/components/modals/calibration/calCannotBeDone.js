import {Button, Paper} from '@material-ui/core'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning';

function CalCannotBeDone(props) {

    const onContinue = () => {
        props.setShowCalibrationCannotBeDone(false);
        // props.setShowInsertDl(true);
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2> Datalogger Cannot be Calibrated with the Selected Calibration Session </h2>
                <p> No readings at the time of the nominal values could be found </p>
                <br/>
                <WarningIcon color="secondary" fontSize="large" />
                <br/>
                <br/>

                <Button onClick={()=>onContinue()}
                style={{position: 'relative', left: '0%'}}>
                    Select Another Calibration Session
                </Button>
            </Paper>
        </div>
    )
}

export default CalCannotBeDone
