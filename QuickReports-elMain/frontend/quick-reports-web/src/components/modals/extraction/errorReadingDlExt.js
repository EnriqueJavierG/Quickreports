import {Button, Paper} from '@material-ui/core'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning';

function ErrorReadingDlExt(props) {

    const onContinue = () => {
        props.setShowReadingDlErrorExt(false);
        props.setShowInsertDlToExtract(true);
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2> Datalogger Cannot be Read by the System </h2>
                <p> Try again later </p>
                <br/>
                <WarningIcon color="secondary" fontSize="large" />
                <br/>
                <br/>

                <Button onClick={()=>onContinue()}
                style={{position: 'relative', left: '0%'}}>
                    Insert Another Datalogger
                </Button>
            </Paper>
        </div>
    )
}

export default ErrorReadingDlExt
