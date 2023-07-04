import { Grid } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import React , {useState} from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';
import ReportEditor from '../components/report/report'

function VerifyReportView(props) {

    // hook for the toggle button
    const [approve, setApprove] = useState('not approved');
    
    // ensures the toggle button always has a set value
    const handleApproval = (event, newApproval) => {
        if (newApproval !== null){
            setApprove(newApproval);
        }
    };
    console.log(props.studyObj)

    const onClickReviewResult = () => {
        let currentStudy = props.currentStudy;
        console.log("Current study " + currentStudy);
        let approvalStatus = props.approved;
        console.log("Is approved? " + approvalStatus);
        props.setReview(false);
    }


    return (
        <>
            <Grid container justify='center' direction="row" spacing={2} >
                <Grid item xs={8}>
                    <Paper style={{height:'100%', width:'100%', textAlign:'center'}}>
                        <div style={{backgroundColor:'white'}}>
                            <div style={{overflowX:'scroll' , overflowY:'scroll' ,marginLeft:'auto',marginRight:'auto',display:'block', height:950 , width:800 , border:'solid'}} >
                                <ReportEditor isCalibration={false} study={props.studyObj} readonly={true}/>
                            </div>
                        </div>  
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Grid container direction="column">
                    <Paper style={{height:'100%', width:'100%' }}>
                        <Grid item>
                            <ToggleButtonGroup value={approve} exclusive color="primary"
                            onChange={handleApproval} aria-label="text alignment">
                                <ToggleButton value="approved" aria-label="approved" size="large" onClick={() => props.setApproved(true)}>
                                    APPROVED
                                    {/* Aqui cuando se aprueba hay que hacer un write al DB para cambiar el status y que aparezca updated en el main page */}
                                </ToggleButton>
                                <ToggleButton value="not approved" aria-label="not approved" onClick={() => props.setApproved(false)}>
                                    NOT APPROVED
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Paper>
                    </Grid>
                </Grid>
                <Grid item>
                    <Tooltip title="Review Done"> 
                    <IconButton aria-label="reviewDoc"
                    onClick={()=>onClickReviewResult()}>
                    <CheckCircleIcon fontSize="large" />
                    </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    )
}

export default VerifyReportView;