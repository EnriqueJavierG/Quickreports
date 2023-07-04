import {Button, Paper} from '@material-ui/core'
import UsbIcon from '@material-ui/icons/Usb';
import React, {useState} from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';


function InsertDlToCalibrate(props) {

    // hook for icon 
    const [loading, setLoading] = useState(false);

    const onContinue = () => {
        console.log('clicking')
        // setLoading(true);
        props.setConnectedDl(true);
        props.letsCalibrate();
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Tooltip title="Click Outside Box to Exit"  aria-label="close">
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>Insert Datalogger to be Calibrated</h2>
                <p> Session Number: {props.calSess}</p>
                <br/>
                {loading ? <LinearProgress /> : <UsbIcon size={500} />}
                
                <br/>
                <br/>
                <Button onClick={()=>onContinue()}
                style={{position: 'relative', left: '25%'}}>
                    Continue
                </Button>
            </Paper>
            </Tooltip>
        </div>
    )
}

export default InsertDlToCalibrate
