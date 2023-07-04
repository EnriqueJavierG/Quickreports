import Grid from '@material-ui/core/Grid';
import ClientManagementTable from './clientManagementTable'
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Box from '@material-ui/core/Box'
function ApproveClientsComponent(props) {
    

    return(
        <>
            <Paper>
                <Box p ={2}> 
                    <h2> Clients' Account Management </h2>
                </Box>
            <Grid item xs={12}>
                <ClientManagementTable
                setDone={props.setDone}
                data={props.clientData}
                setCurrentClient={props.setCurrentClient}
                currentClient={props.currentClient}
                authorizeClient={props.authorizeClient}
                setAuthorizeClient={props.setAuthorizeClient} />
            </Grid>
            </Paper>
        </>
    )
}

export default ApproveClientsComponent