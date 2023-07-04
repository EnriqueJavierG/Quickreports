import React from 'react'
import ZoneMap from '../components/zoneMap/zoneMap'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
function ZoneMapView() {
    return (
        <Grid container justify='center'>
            <Paper style={{minWidth:'50%'}}>
                <Box p ={2}>
                    <Typography align='left' variant='h4'> Zones</Typography>
                    <ZoneMap />
                </Box>
            </Paper>
        </Grid>
    )
}

export default ZoneMapView
