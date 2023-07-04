import {  Button, Paper} from '@material-ui/core'
import React from 'react'

function RetryConnectionRead(props) {
    
    const onCancel = () => {
        console.log('ESTOY DONDE ES?')
        props.setShowRetry(false);
        props.setRetryReadExt(true);
        props.setShowInsertDlToExtract(true);
    };

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>Error on datalogger connection</h2>
                <p> Please make sure the server is running and a functional Datalogger is connected</p>
                <p> Reconnect the datalogger and click retry</p>

                <br/>
                <Button variant="contained" style={{position: 'relative', left: '0%'}}
                onClick={()=>onCancel()}>
                    Retry
                </Button>
                <br/>
                <br/>

            </Paper>
        </div>
    )
}

export default RetryConnectionRead;
