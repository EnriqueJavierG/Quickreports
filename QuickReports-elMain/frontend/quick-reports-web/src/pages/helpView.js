import { Box, Paper,Grid, Typography } from '@material-ui/core'
import React from 'react'
import HelpComp from '../components/help/helpComp'

 // calibrate|validate|client|approve

function HelpView(props) {

    // // hook for the help logs according to user role
    // const [helpLogs, setHelpLogs] = useState({});
    // hook for the current user role

    let helpLogs = [];
    
    if (props.role == 4){ // approver
        helpLogs = [
            {title:'Getting Started',
            content:'The home page presents a table with all the studies in \
            the Quick Reports system. The approver has access to the study dashboard \
            and to the final report. It will be able to review and determine the approval \
            status for the project. Also, the user accounts management view will allow \
            approvers to authorize accounts for both clients and reporters. '},

            {title:'Go to Dashboard',
            content:'Click the bar chart icon to access the dashboard for a particular study. \
            The dashboard presents the summary for the study, and presents the errors, if any, \
            of readings that were out of the valid ranges for the study.'},

            {title:'Review and Approve Report',
            content:'Click the icon on the report column to review and approve the thermal studies report. \
            It will include the information for the study and the results. The document can be downloaded \
            as a pdf. To approve a study, click on the toggle button to either approve or not approve a study. \
            Once the approval decision has been made, click on the check icon to return to the Approver Home Page. '},

            {title:'View Study Profile',
            content:'Click over the project name to view the study profile. It includes all the study information, \
            the study time window, the alarm levels for temperature and relative humidity, the number of dataloggers \
            used in the study and more.'},
            
            {title:'Authorize Clients',
            content:'On the user account management, the client account management table will allow you to authorize \
            CIQA\'s clients to access the Quick Reports platform. By clicking the user icon on the actions column, a \
            pop-up window will appear, where you determine the authorization for the client. Once the authorization \
            decision has been selected, click on the \'CHECK\' button to submit the authorization and return to the page.'},

            {title:'Autorize Reporters',
            content:'On the user account management, the reporter account management table will allow you to authorize \
            CIQA\'s employees to access the Quick Reports platform and work on either validation or calibration studies. \
            By clicking the user icon on the actions column, a pop-up window will appear, where you determine the \
            authorization for the reporter. Also, you can review that the assigned role is correct for the particular user, \
            to either work on thermal studies or calibrating dataloggers. Once the authorization and reporter\'s role\
            decision has been selected, click on the \'CHECK\' button to submit the authorization and return to the page.'}
        ];
    }
    else if (props.role == 1){ // validation
        helpLogs = [
            {title:'Getting Started - Home Page',
            content:'The main page for Quick Reports system presents a table with all the thermal studies in the system.'},

            {title:'Create New Study',
            content:'To create a new study, click on the \'NEW STUDY\' button at the top right corner of the screen. \
            Enter the information for the new thermal study and click on submit. All fields must be filled in order \
            to create a new study.'},

            {title:'Go to Study Profile',
            content:'To view in more detail a thermal study, click over the project name on the table to go to the study \
            profile. There you can view in more detail the study information and perform other actions. '},

            {title:'Edit a Study Profile',
            content:'To edit a thermal study profile, click on the \'EDIT\' button. Change the desired fields to edit \
            and click on \'Done\'.'},

            {title:'Program Dataloggers',
            content:'To program dataloggers with the desired study parameters, click on the arrows icon aside the Program Datalogger \
            label. A popup will appear to insert the datalogger for which you wish to create a profile. \
            After inserting it, click on \'Continue\'. If the datalogger does not have a profile on the system, you will be \
            prompted to create a new datalogger profile before being able to program it and use it in a study. If the datalogger has a \
            profile on the system, the system will\
            proceed to program the datalogger with the study parameters. Once programmed, the system will prompt you to program\
            another datalogger with the same parameters or to complete the programming session. '},

            {title:'Extract Data from Dataloggers',
            content:'To extract the study data from the dataloggers, click on the cloud icon aside the Import Data \
            label. A popup will appear to insert the datalogger for which you wish to extract study data. \
            After inserting it, click on \'Continue\'. If the datalogger is not associated to the study, you will be \
            prompted to insert a datalogger that is associated to the study. The system will\
            proceed to program the datalogger with the study parameters. Once programmed, the system will prompt you to program\
            another datalogger with the same parameters or to complete the programming session. '},

            {title:'Go to Dashboard',
            content:'The dashboard can be accessed through the Main Page table or the study profile. Click the bar\
            chart icon to access the dashboard for the study. \
            The dashboard presents the summary for the study, and presents the errors, if any, \
            of readings that were out of the valid ranges for the study.'},

            {title:'View and Download Validation Report',
            content:'Click on the cloud icon to view and download the final validtion report for the thermal study.'},

            {title:'Create a New Datalogger Profile',
            content:'To create a new datalogger profile, click on the \'NEW DATALOGGER PROFILE\' button at the \
            top right corner of the page. A popup will appear to insert the datalogger for which you wish to create a profile. \
            After inserting it, click on \'Continue\'. The system will create a new profile for the datalogger. You can \
            create another datalogger profile or return to the Datalogger Profile main page. If the datalogger already has a profile\
            the pop-up will close and return to the main Datalogger Profile page. '},
        ];
    }
    else if (props.role == 2){ // calibration
        helpLogs = [
            {title:'Go to Calibration Session Profile',
            content:'The main calibration page presents a table with all the calibration sessions on the system. \
            Click over the session number to go to the calibration session profile and see more details. \
            To edit a calibration session profile, click on the \'EDIT\' button, once the desired fields have been edited, \
            click on done. To go back to the main calibration page, click on the \'BACK\' button.'},

            {title:'Create a New Calibration Session',
            content:'To create a new calibration session profile, click on the \'NEW NIST EQUIPMENT PROFILE\' \
            button at the top right corner of the page. Once all fields are filled, click on save and return \
            to the main calibration page.'},

            {title:'Calibrate Dataloggers',
            content:'To calibrate a datalogger, start by clicking on the \'Start Calibration Session\' \
            at the top left corner of the screen. The calibration session table will be highlighted. Click over the \
            row for the calibration session to use to calibrate the dataloggers. Once selected, a pop up will appear \
            to insert the datalogger to be calibrated. Once inserted, click on \'Continue\'. The system will identify the datalogger\
            if it has a profile on the system, it will proceed to calibrating it. If the datalogger does not have a profile in \
            the system, a profile must be created before being able to calibrate it. Once the datalogger is calibrated, you \
            can decide to calibrate another datalogger with the same calibration session or to complete the calibration.'},

            {title:'Create a New Datalogger Profile',
            content:'To create a new datalogger profile, click on the \'NEW DATALOGGER PROFILE\' button at the \
            top right corner of the page. A popup will appear to insert the datalogger for which you wish to create a profile. \
            After inserting it, click on \'Continue\'. The system will create a new profile for the datalogger. You can \
            create another datalogger profile or return to the Datalogger Profile main page. If the datalogger already has a profile\
            the pop-up will close and return to the main Datalogger Profile page. '},
        ];
    }
    else { // client
        helpLogs = [
            {title:'Equipment Release Agreement Form',
            content:'Before CIQA can start working on the thermal study, the client must agree \
            to the equipment release statement. By clicking on the pencil icon, a pop-up will appear, \
            stating general information about the project. The client must check on the statement indicating \
            that it assumes full responsibility over the rented equipment. Once the box is checked, click on \
            the \'DONE\' button for CIQA to receive confirmation of the equipment release agreement and can start \
            working on the thermal study.'},

            {title:'Go to Dashboard',
            content:'Click the bar chart icon to access the dashboard for the study. \
            The dashboard presents the summary for the study, and presents the errors, if any, \
            of readings that were out of the valid ranges for the study.'},

            {title:'View and Download Validation Report',
            content:'Click on the cloud icon to view and download the final validtion report for the thermal study.'},

            {title:'Datalogger to Zone Mapping',
            content:'Click on the map icon to go to the datalogger to zone mapping. A drag and drop view will be \
            presented. On the right side of the screen, a panel will be presented with all the dataloggers associated \
            to the study. On the left side of the screen, a box for each cleanroom zone will be presented. Drag a datalogger \
            and drop it into the adequate zone.'}
        ];
    }
    return (
        <Grid container justify='center'>
            <Grid item xs={7} style={{textAlign:'left'}}>
                <Paper>
                    <Box p ={2}>
                        <Typography variant='h4'> FAQ </Typography>
                        {helpLogs.map((log)=>{
                            return(
                                <Box p={1}>
                                    <HelpComp log={log}></HelpComp>
                                </Box>
                            )
                        })}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default HelpView
