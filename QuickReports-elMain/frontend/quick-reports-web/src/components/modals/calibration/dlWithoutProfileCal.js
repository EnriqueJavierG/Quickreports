import {  Button, Paper} from '@material-ui/core'
import React from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Link } from 'react-router-dom'

function DataloggerWithoutProfile(props) {
    
    const onCancel = () => {
        props.setShowDlNotRecognized(false);
        props.setShowInsertDl(true);
    };

    return (
        <div style={{ minWidth:'50%',position: 'absolute', left:'50%',top:'50%',
            transform: 'translate(-50%, -50%)' }}>
            <Paper elevation={3} 
                align = "center" 
                style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}
                variant="outlined">
                <h2>The connected datalogger does not have a profile in the system.</h2>
                <p>  Every datalogger used must have a profile in order to be included in a study. </p>
                <br/>
                <Button variant="contained" style={{position: 'relative', left: '-8%'}}
                onClick={()=>onCancel()}>
                    Connect Another Datalogger
                </Button>
                <Button variant="contained" 
                component={Link}
                to={'/dataloggerProfiles'}
                endIcon={<AddBoxIcon/>}
                color="primary"
                style={{position: 'relative', left: '8%'}}>
                    Create New Datalogger Profile
                </Button>
                <br/>
                <br/>

            </Paper>
        </div>
    )
}

export default DataloggerWithoutProfile
