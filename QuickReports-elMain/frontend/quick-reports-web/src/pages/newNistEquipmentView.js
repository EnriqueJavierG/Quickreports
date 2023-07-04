import React from 'react';
import NewNistProfileComp from '../components/calibrationStudies/newNistProfileComp';
import Grid from '@material-ui/core/Grid';
import Box  from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

function NewNistView(){
    return(
        <div>
            <Grid container 
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center">
                <Box p ={3}>
                    <Paper style={{width:'100%'}}>
                        <Box p ={3}>
                            <Grid item >
                                <h2>
                                    Create New NIST Equipment Profile
                                </h2>
                            </Grid>
                            <Grid item >
                                <NewNistProfileComp />
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </Grid> 
        </div>
    )
}
export default NewNistView