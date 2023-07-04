import { Typography, Modal, Paper, Grid, TextField } from '@material-ui/core'
import React from 'react'

function NewDataloggerModal() {
    return (
        <Modal>
            <Paper>
                <Grid container alignContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography>Add new datalogger</Typography>
                    </Grid>
                </Grid>
                <Grid container alignContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography>Serial Number:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField />
                    </Grid>
                </Grid>
                <Grid container alignContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography>Serial Number:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField />
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    )
}

export default NewDataloggerModal
