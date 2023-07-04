import { Paper} from '@material-ui/core'
import React from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import UsbIcon from '@material-ui/icons/Usb';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';


function DLProfileCreated(props) {

    const onDone = () => {
        props.setProfileCreated(false);
    }

    const onNext = () => {
        props.setProfileCreated(false);
        props.setInsertDlToCreate(true);
    }

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'65%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <br />
                <br />
                <h2>Profile Created for Datalogger  </h2>
                <CheckCircleOutlineIcon />
                <br />
                <br />
                <br />
                <h2>Connect Another Datalogger to Create New Profile </h2>
                <UsbIcon />
                <br />
                <br />
                <br />
                
                <Grid container direction='row' justify="space-between">
                <Grid item>
                <Tooltip title="Program Another Datalogger" aria-label="done">
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

export default DLProfileCreated
