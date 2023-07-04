import React , {useState, useEffect,useRef} from 'react'
import Header from './components/Header';
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import {Switch} from "react-router";
import ValidationStudyView from './pages/validationStudyView'
import NewStudyView from'./pages/newStudyView';
import DataloggerProfilesView from './pages/dataloggerProfilesView'
import LoginView from './pages/loginView'
import StudyProfileView from './pages/studyProfileView'
import ReportView from './pages/reportView'
import ZoneMapView from './pages/zoneMapView'
import CalibrationStudyView from './pages/calibrationStudyView'
import NistProfileView from './pages/editNistprofile'
import NewNistView from './pages/newNistEquipmentView'
import DashboardView from './pages/dashboardView'
import TempPerZoneView from './pages/tempPerZoneView'
import RhPerZoneView from './pages/rhPerZoneView'
import StudyMetadata from './components/dashboard/studyMetadata'
import ErrorLogTable from './components/dashboard/errorLogTable'
import DataPerZoneTable from './components/dashboard/dataPerZone/dataPerZoneTable'
import DataPerZoneView from './pages/dataPerZoneView'
import {NextDataloggerModalTest, ProgramDLModalTest, ProgramDLDoneModalTest,
  DlNotIdentified, InsertDlToCalibrateModalTest, CalibratingDLModalTest,
  CalibrationDoneDLModalTest, ErrorReadingDlTest} from './pages/modalTest'
import ApproverHomeView from './pages/approverHomeView'
import VerifyReportView from './pages/verifyReportView'
import ApproverAccountsView from './pages/approverAccountsView'
import ClientHomeView from './pages/clientHomeView'
import StudyCards from './components/client/studyCards'
import EquipmentReleaseFormView from './pages/equipmentReleaseFormView'
import { makeStyles } from '@material-ui/core/styles'
import HelpView from './pages/helpView'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator  } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import CalibrationReportView from './pages/calibrationReport';
import ClientReport from './pages/clientReportView';
import DownloadPage from './pages/downloadPage';

Amplify.configure(awsconfig);

const useStyles = makeStyles((theme) => ({
  background:{
    backgroundColor:'#E0E0E0'
  }
}));
function App(props) {
  const initialRender = useRef(true);
  const classes = useStyles();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [role, setRole] = useState(0) // 1:Validator, 2:Calibrator, 3:Client, 4:Approver
  const [user, setUser] = useState('')
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if(initialRender.current){
      initialRender.current = false;
  }
  else{
    if(isAuthenticated){
      console.log(role)
    }
  }
    return () => {
      
    }
  }, [isAuthenticated])
  async function onLoad() {
    // try {
    //   await Auth.currentSession();
    //   userHasAuthenticated(true);
    // } catch (e) {
    //   alert(e);
    // }
  }

  if(!isAuthenticated){
    return(
      <>
      <LoginView 
      role={role} 
      setRole={setRole} 
      setUser={setUser} 
      user={user}
      setGroups={setGroups} 
      userHasAuthenticated={userHasAuthenticated}
      />
      </>
      
    )
    
  }
  else {
    if(role === 1){ // Validator
      return (
        <div className={classes.background}>
        <BrowserRouter history = {props.history}>
            {/* <AmplifySignOut/> */}
            <Header 
            user={user}
            role={role} 
            userHasAuthenticated = {userHasAuthenticated}
            />
            <Switch>
              <Route exact exact path='/'> {<Redirect to="/home" />}</Route>
              <Route exact path='/dataloggerProfiles' component={DataloggerProfilesView} />
              <Route exact path='/home' component={ValidationStudyView} />
              <Route exact path='/newStudy' component={NewStudyView} />
              <Route exact path='/studyProfile/:studyID' component={StudyProfileView} />
              <Route exact path='/zoneMap/:studyID' component={ZoneMapView} />
              <Route exact path='/report' component={ReportView}/>
              <Route exact path='/reportDev'  component={ReportView}/>
              <Route exact path='/dashboard/:studyID' component={DashboardView} />
              <Route exact path='/tempPerZone/:studyID' component={TempPerZoneView} />
              <Route exact path='/rhPerZone/:studyID' component={RhPerZoneView} />
              <Route exact path='/studyMetadata' component={StudyMetadata} />
              <Route exact path='/error' component={ErrorLogTable} />
              <Route exact path='/dataPerZoneTable' component={DataPerZoneTable} />
              <Route exact path='/dataPerZone/:studyID' component={DataPerZoneView} />
              <Route exact path='/modal' component={ErrorReadingDlTest} />
              <Route exact path='/downloads' component={DownloadPage} />
              <Route exact path='/help' render={(props) => <HelpView role={role} {...props} />} />
              {/* <Route path='/help' component={HelpView} /> */}
            </Switch>
        </BrowserRouter>
        </div>
      );
    }
    if(role === 2){ // calibrator
      return (
        <div className={classes.background}>
        <BrowserRouter history = {props.history}>
            {/* <AmplifySignOut/> */}
            <Header 
            user={user}
            role={role} 
            userHasAuthenticated = {userHasAuthenticated}
            />
            <Switch>
              <Route exact exact path='/'> {<Redirect to="/home" />}</Route>
              <Route exact path='/dataloggerProfiles' component={DataloggerProfilesView} />
              <Route exact path='/home' component={CalibrationStudyView} />
              <Route exact path='/newStudy' component={NewStudyView} /> 
              {/* la ruta de arriba esta mal */}
              <Route exact path='/nistProfile/:calibrationID' component={NistProfileView} />
              <Route exact path='/newCal' component={NewNistView} />
              <Route exact path='/insertDl' component={InsertDlToCalibrateModalTest} />
              <Route exact path='/help' render={(props) => <HelpView role={role} {...props} />} />
            </Switch>
        </BrowserRouter>
        </div>
      );
    }
    if(role === 3){ // client
      return (
        <div className={classes.background}>
        <BrowserRouter history = {props.history}>
            {/* <AmplifySignOut/> */}
            <Header 
            user={user}
            role={role} 
            userHasAuthenticated = {userHasAuthenticated}
            />
            <Switch>
              <Route exact path='/'> {<Redirect to="/home" />}</Route>
              <Route exact path='/home' component={ClientHomeView} />
              <Route exact path='/zoneMap/:studyID' component={ZoneMapView} />
              <Route exact path='/report' component={ReportView}/>
              <Route exact path='/dashboard/:studyID' component={DashboardView} />
              <Route exact path='/tempPerZone/:studyID' component={TempPerZoneView} />
              <Route exact path='/rhPerZone/:studyID' component={RhPerZoneView} />
              <Route exact path='/dataPerZone/:studyID' component={DataPerZoneView} />
              <Route exact path='/studyCards' component={StudyCards} />  
              <Route exact path='/releaseForm' component={EquipmentReleaseFormView} /> 
              <Route exact path='/help' render={(props) => <HelpView role={role} {...props} />} />
              <Route exact path='/clientReport/:studyID' component={ClientReport} /> 
            </Switch>
        </BrowserRouter>
        </div>
      );
    }
    if(role ===4){ // approver
      return (
        <div className={classes.background}>
        <BrowserRouter history = {props.history}>
            {/* <AmplifySignOut/> */}
            <Header 
            user={user}
            role={role} 
            userHasAuthenticated = {userHasAuthenticated}
            />
            <Switch>
              <Route exact path='/'> {<Redirect to="/home" />}</Route>
              <Route exact path='/dataloggerProfiles' component={DataloggerProfilesView} />
              <Route exact path='/home' component={ApproverHomeView} />
              <Route exact path='/studyProfile/:studyID' component={StudyProfileView} />
              <Route exact path='/zoneMap/:studyID' component={ZoneMapView} />
              <Route exact path='/report' component={ReportView}/>
              <Route exact path='/dashboard/:studyID' component={DashboardView} />
              <Route exact path='/tempPerZone/:studyID' component={TempPerZoneView} />
              <Route exact path='/rhPerZone/:studyID' component={RhPerZoneView} />
              <Route exact path='/studyMetadata' component={StudyMetadata} />
              <Route exact path='/error' component={ErrorLogTable} />
              <Route exact path='/dataPerZoneTable' component={DataPerZoneTable} />
              <Route exact path='/dataPerZone/:studyID' component={DataPerZoneView} />
              <Route exact path='/modal' component={ErrorReadingDlTest} /> 
              <Route exact path='/verifyReport/:studyID' component={VerifyReportView} />
              <Route exact path='/accounts' component={ApproverAccountsView} />
              <Route exact path='/releaseForm' component={EquipmentReleaseFormView} /> 
              <Route exact path='/errorRead' component={ErrorReadingDlTest} /> 
              <Route exact path='/help' render={(props) => <HelpView role={role} {...props} />} />
            </Switch>
        </BrowserRouter>
        </div>
      );
    }
  }
}

// export default withAuthenticator(App);
export default App;

