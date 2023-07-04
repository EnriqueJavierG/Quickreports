import { Box, Paper } from '@material-ui/core'
import React from 'react'
import CreateCompleteStudy from '../components/newStudy/createCompleteStudy'
function NewStudyView(){
    return(
        <div style={{transform: 'translate(-50%)',position: 'absolute', left: '50%', top:'15%' }}>
            <Paper>
                <Box p ={2}>
                    <h2>New Study</h2>
                    <CreateCompleteStudy />
                </Box>
            </Paper>
        </div>
    )
}
export default NewStudyView