import React from 'react'
import DataloggerProfilesTable from '../components/dataloggersProfiles/DataloggerProfilesTable'
import Grid from '@material-ui/core/Grid'
function DataloggerProfilesView() {
    return (
        <div>
            <Grid container  justify='center'>
                <Grid item xs={11} sm={9} md={8} lg={6} style={{textAlign:'left'}}>
                    <h2 > 
                        Datalogger Profiles
                    </h2>
                    <DataloggerProfilesTable/>
                </Grid>
            </Grid>
        </div>
    ) 
}
export default DataloggerProfilesView