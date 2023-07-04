import {Paper} from '@material-ui/core'
import React from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import UsbIcon from '@material-ui/icons/Usb';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';


function ExtractingDone(props) {

    const onDone = () => { 
        props.setShowExtractingDone(false);
    }

    const onNext = () => {
        props.setShowExtractingDone(false);
        props.setShowInsertDlToExtract(true);
        props.setConnectedDl(props.connectedDl + 1);
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'75%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <br />
                <br />
                <h2>Data from Datalogger Successfully Added to Study</h2>
                <CheckCircleOutlineIcon />
                <br />
                <br />
                <br />
                <h2> Connect Next Datalogger to Extract Data </h2>
                <UsbIcon />
                <p> Click the Done button to return to the Study Profile </p>
                <br />
                <br />
                <br />
                <Grid container direction='row' justify="space-between">
                <Grid item>
                <Tooltip title="Extract Another Datalogger" aria-label="next">
                    <IconButton aria-label="download" onClick={()=>onNext()}>
                    <AddIcon fontSize='large'/>
                    </IconButton>
                </Tooltip>
                </Grid>
                <Grid item>
                <Tooltip title="Done" aria-label="done">
                    <IconButton aria-label="download" onClick={()=>onDone()}>
                    <DoneAllIcon fontSize='large'/>
                    </IconButton>
                </Tooltip>
                </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default ExtractingDone
