import Grid from '@material-ui/core/Grid'
import React from 'react'
import StudyTable from '../components/validationStudies/StudyTable'
function ValidationStudyView() {
    return (
        <>
            <Grid container justify='center'>
                <Grid item xs={11} sm={9} md={8} lg={6} style={{textAlign:'left'}}>
                    <h2> 
                        Cleanroom Validation Thermal Studies
                    </h2>
                    <StudyTable /> 
                </Grid>
            </Grid>
        </>
    ) 
}
export default ValidationStudyView