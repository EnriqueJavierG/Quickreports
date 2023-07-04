import Grid from '@material-ui/core/Grid';
import ReporterManagementTable from './reporterManagementTable'
import Paper from '@material-ui/core/Paper';
import { useThemeProps } from '@material-ui/data-grid';


function ApproveClientsComponent(props) {
    return(
        <>
            <Paper>
            <h2> Reporters' Account Management</h2>
            <Grid item>
                <ReporterManagementTable 
                setDone={props.setDone}
                data={props.reporterData}
                setCurrentReporter={props.setCurrentReporter}
                currentReporter={props.currentReporter}
                authorizeReporter={props.authorizeReporter}
                setAuthorizeReporter={props.setAuthorizeReporter}
                />
            </Grid>
            </Paper>
        </>
    )
}

export default ApproveClientsComponent