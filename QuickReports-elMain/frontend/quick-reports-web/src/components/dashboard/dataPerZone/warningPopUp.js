import { Paper} from '@material-ui/core'
import React from 'react'
import RhPerZone from './rhPerZone';
import TempPerZone from './tempPerZone';
import Grid from '@material-ui/core/Grid'


/**
 * 
 * @param {zoneNumber, tempData, rhData} props 
 * @returns 
 */
function WarningPopUp(props) {

    console.log(props.rhData)
    console.log(props.tempData)

    let title="Zone " + props.zone + " Readings"
    return(
        <div style={{ minWidth:'90%',position: 'absolute', left:'50%',top:'50%',
        transform: 'translate(-50%, -50%)' }}>
                <Paper elevation={3}
                align="center"
                variant="outlined">
                <Grid container direction="column">
                    <Grid item>
                        <h2> {title} </h2>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing={9}>
                            <RhPerZone zone={props.zone} data={props.rhData}/>
                            
                            <TempPerZone zone={props.zone} data={props.tempData}/>
                        </Grid>
                    </Grid>
                </Grid>
                </Paper>
        </div>
    )
}

export default WarningPopUp;