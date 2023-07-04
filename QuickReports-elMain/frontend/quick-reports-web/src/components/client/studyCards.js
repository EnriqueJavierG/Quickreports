import React , {useState, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { Alert, AlertTitle } from '@material-ui/lab';
import CreateIcon from '@material-ui/icons/Create';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import ReleaseForm from './releaseForm'
import Paper from '@material-ui/core/Paper';
import {UserServices} from '../../services/UserServices';
import {StudyServices} from '../../services/StudyServices';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
  },
  modal: {
    minWidth: 400,
    minHeight: 100,
    position: 'absolute', 
    left: '50%', 
    top: '50%',
    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));


function StudyCards(props) {

    const initialRender = useRef(true);

    // hook to manage page view, if signing or if viewing study cards
    const [showReleaseForm, setShowReleaseForm] = useState(false);
    const handleClose = () => {
        setShowReleaseForm(false);
    }
    const handleShow = () => {
        setShowReleaseForm(true);
    }

    // hook to determine if the release form was filled for a particular study
    // it will have an object {studyID: #, isSigned:bool}
    const [isSigned, setIsSigned] = useState();

    // hook to determine if signature warning should be visible 
    const [showWarning, setShowWarning] = useState(true);
    // hook to indicate the study status
    const [showInProgress, setShowInProgress] = useState(false);
    // hook to indicate the study completion
    const [showCompletion, setShowCompletion] = useState(false);
    // hook to determine if it was submited or not
    const [submit, setSubmit] = useState(false);
    // hook to set the object for the current study
    const [studyObj, setStudyObj] = useState({});
    // rerender after change in status
    const [refresh, setRefresh] = useState(0);
    const hitRefresh = () => setRefresh(refresh+1);


    // get study object for card
    useEffect(()=>{
      async function myApiCalls(){
          let s = await StudyServices.getStudyById(props.studyID);
          setStudyObj(s.r);
      }
      myApiCalls();
      
    }, [])

    // change the study status if the agreement is accepted
    useEffect(()=>{
        async function myApiCall(){
            if (initialRender.current){
                initialRender.current = false;
            }
            else {
              if (isSigned.isSigned){
                    StudyServices.updateStatus(props.studyID, 1);
                    let s = await StudyServices.getStudyById(props.studyID);
                    setStudyObj(s.r);
                    hitRefresh();
                }
            }
            setSubmit(false);
        }
        myApiCall();
    },[submit]);


    useEffect(()=>{
      async function myApiCall(){

        if ((props.status == 'Created'||props.status == 'cannot be determined') & (studyObj.status == 0 || studyObj.status==undefined)){
          setShowWarning(true);
          setShowInProgress(false);
          setShowCompletion(false);
        }
        else if (props.status == 'Agreement Form Completed' || props.status == 'In Progress' || props.status == 'Pending Approval'
        || studyObj.status == 1 || studyObj.status == 2 || studyObj.status == 3){
          setShowWarning(false);
          setShowInProgress(true);
          setShowCompletion(false);
        }
        else { // completed, either approved or not approved
          setShowWarning(false);
          setShowInProgress(false);
          setShowCompletion(true);
        }
      } myApiCall();
    },[refresh]);

    const classes = useStyles();

    const ModalContent = () => {
      return (
          <Modal open={showReleaseForm} onClose={handleClose} >
          <Paper>
              <ReleaseForm 
              setSubmit={setSubmit}
              isSigned={isSigned} 
              setIsSigned={setIsSigned}
              studyID={props.studyID}
              handleClose={handleClose}
              setShowWarning={setShowWarning}
              projectName={props.projectName}
              clientName={props.clientName}
              dlQty={props.dlQty}
              />
          </Paper>
          </Modal>
      )
  }

    return (
        <>
            <Grid item className={classes.root} xs={6} justify="center">
            <Card className={classes.root}>
            <CardHeader           
                title={props.projectName}
                subheader={"Cleanroom Thermal Study " + props.studyID}
            />
            <CardContent>
                {(showWarning ) ? 
                    <Alert severity="warning" 
                    action={
                    <Tooltip title="Sign Form">
                    <Button size="small" onClick={()=>handleShow()}> 
                        <CreateIcon/>
                    </Button>
                    </Tooltip>
                    }>
                        <AlertTitle>Action Required</AlertTitle>
                        Please sign <strong> equipment release form.</strong>
                    </Alert> 
                :null} 

                {(showInProgress) ? 
                    <Alert severity="info">
                    <AlertTitle>Project Status:</AlertTitle> 
                    {props.status}</Alert>
                :null}

                {(showCompletion) ? 
                    <Alert severity="success">
                    <AlertTitle>Project Status:</AlertTitle> 
                    {props.status}</Alert>
                :null}
                    
            </CardContent>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                Click on the icons to explore thermal study results or to provide zone-to-datalogger mapping information. 
                </Typography>
            </CardContent>
            <CardActions classes={{spacing:'40px'}}>

                <Tooltip title="Go to Dashboard">
                <IconButton
                color='secondary'
                disabled={props.status ==='Created' || props.status === 'Agreement Form Completed'} 
                aria-label="dashboard" component={Link} 
                to={{pathname:'/dashboard/'+props.studyID, state:{study:studyObj}}}
                >
                <AssessmentIcon fontSize='large'/>
                </IconButton>
                </Tooltip>

                <Tooltip title="Download Report">
                <IconButton
                color='secondary'
                disabled={props.status ==='Created' || props.status === 'Agreement Form Completed'}
                aria-label="download"
                component={Link}
                to={{pathname:'/report', state:{study:studyObj}}}>
                <CloudDownloadIcon fontSize='large'/>
                </IconButton>
                </Tooltip>

                
                <Tooltip title="Map Zone to Datalogger">
                <IconButton
                color='secondary'
                disabled={props.status ==='Created' || props.status === 'Agreement Form Completed'}
                aria-label="zonteToDl"
                component={Link}
                to={{pathname:'/zoneMap/'+props.studyID, state:{study:studyObj}}}>
                <AccountTreeIcon fontSize='large'/>
                </IconButton>
                </Tooltip>
                
            </CardActions>
            </Card>
            </Grid>


            {showReleaseForm ? <ModalContent/> : null}
    </>
    );
}

export default StudyCards
