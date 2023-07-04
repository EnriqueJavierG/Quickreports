import {  Button, Paper} from '@material-ui/core'
import React from 'react'

function DataloggerNotInStudy(props) {
    
    const onCancel = () => {
        props.setShowDlNotInStudy(false);
        props.setShowInsertDlToExtract(true);
    };

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>The connected datalogger is not associated to this study.</h2>
                <p> Data can be imported to the study only from dataloggers associated to the study. </p>
                <br/>
                <Button variant="contained" style={{position: 'relative', left: '0%'}}
                onClick={()=>onCancel()}>
                    Connect Another Datalogger
                </Button>
                <br/>
                <br/>

            </Paper>
        </div>
    )
}

export default DataloggerNotInStudy
