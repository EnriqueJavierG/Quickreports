import {Button, Paper} from '@material-ui/core'
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';


function CalibratingDL(props) {


    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>Calibrating Datalogger {props.dlId} </h2>
                <br/>
                <CircularProgress />
                <br/>
                <br/>

                
            </Paper>
        </div>
    )
}

export default CalibratingDL
