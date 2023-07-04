import {Button, Paper} from '@material-ui/core'
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

function ProgrammingDL(props) {


    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>Programming Datalogger </h2>
                <CircularProgress />
                <br/>
                <br/>
            </Paper>
        </div>
    )
}

export default ProgrammingDL
