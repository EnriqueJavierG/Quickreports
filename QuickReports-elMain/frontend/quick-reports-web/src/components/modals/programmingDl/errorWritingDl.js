import {Button, Paper} from '@material-ui/core'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning';

function ErrorWritingDl(props) {

    const onContinue = () => {
        props.setShowRetry(false);
        props.setShowInsertDl(true);
        props.setRetryWriteProg(true);
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2> Datalogger could not be programmed </h2>
                <p> Try reconnecting </p>
                <br/>
                <WarningIcon color="secondary" fontSize="large" />
                <br/>
                <br/>

                <Button onClick={()=>onContinue()}
                style={{position: 'relative', left: '0%'}}>
                   Try again
                </Button>
            </Paper>
        </div>
    )
}

export default ErrorWritingDl
