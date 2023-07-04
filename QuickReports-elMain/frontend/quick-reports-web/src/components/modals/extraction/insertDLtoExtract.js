import {Button, Paper} from '@material-ui/core'
import UsbIcon from '@material-ui/icons/Usb';
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';

function InsertDlToExtract(props) {

    const onContinue = () => {
        props.setInsertedDlExtractor(true);
        props.letsExtract();
    }


    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Tooltip title="Click Outside Box to Exit"  aria-label="close">
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>Insert Datalogger to Extract Study Data</h2>
                <br/>
                <UsbIcon size={500} />
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

export default InsertDlToExtract
