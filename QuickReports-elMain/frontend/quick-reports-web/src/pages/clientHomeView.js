import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import StudyCards from '../components/client/studyCards'
import React , {useState, useEffect} from 'react';
import { UserServices } from '../services/UserServices';
import {Auth} from 'aws-amplify'

const useStyles = makeStyles((theme)=>({
    cardContainer:{
        paddingTop:'20px',
        paddingLeft: '50px',
        paddingRight: '50px',
    },
    fab: {
        marginTop: 300,
        top: 'auto',
        right:'8%',
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    }
}));


function ClientHomeView(props){
    const classes = useStyles();

    // hook to manage study data for client
    const [studies, setStudies] = useState({});
    const [attributes, setAttributes] =useState({})
    const [availableStudies, setAvailableStudies] = useState(false);


    // get all studies for particular client
    useEffect(()=>{
        async function myApiCall(){
            let user = await Auth.currentUserInfo();
            let attr = await user.attributes;
            setAttributes(attr);
            let studies = await UserServices.getAllStudiesForClient(attr['name']);
            setStudies(studies);            
        }
        myApiCall();
    }, [])

    return(
        <>
        {(studies['1'] == undefined) ? 

            <>
            <Grid item xs={12} style={{textAlign:'center'}}> 
                    <h1> CIQA Clients' Platform for Thermal Studies </h1>
            </Grid>
            <Grid item xs={12} style={{textAlign:'center'}}> 
                    <h2> No studies available yet </h2>
            </Grid>
            </>
            
        :
        <>
            <Grid container justify="center" direction="column" className={classes.cardContainer} >
                <Grid container style={{textAlign:'center'}}>
                <Grid item xs={12} style={{textAlign:'center'}}> 
                    <h1> CIQA Clients' Platform for Thermal Studies </h1>
                </Grid>
                </Grid>
                <Grid container spacing={6} justify="center">
                    {Object.entries(studies).map(([id, clientData])=>{
                        return(
                            <StudyCards
                            dlQty={clientData.dlQty}
                            clientName={attributes['name']}
                            status={clientData.status}
                            projectName={clientData.projectName}
                            studyID = {clientData.studyID}
                            />
                        )})}
                </Grid>
            </Grid>       
        </>
        }
        </>
        
    )
}

export default ClientHomeView;