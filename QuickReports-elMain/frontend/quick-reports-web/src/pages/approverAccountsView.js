import ApproveClientsComponent from '../components/approver/approveClientsComponent'
import ApproveReportersComponent from '../components/approver/approveReportersComponent'
import Grid from '@material-ui/core/Grid';
import React, {useEffect, useState, useRef} from 'react'
import { UserServices } from '../services/UserServices';

function ApproverAccountsView() {

    const initialRender = useRef(true);

    // hooks for client approval
    const [currentClient, setCurrentClient] = useState();
    const [authorizeClient, setAuthorizeClient] = useState(false);
    // hooks for reporter approval
    const [currentReporter, setCurrentReporter] = useState();
    const [authorizeReporter, setAuthorizeReporter] = useState(false);
    
    // hook for reporters table data
    const [reporters, setReporters] = useState([]);

    // hook for clients table data
    const [clients, setClients] = useState([]);

    // hook for determining if the authorization is done 
    const [done, setDone] = useState(false);

    // use effect for initial render
    useEffect(()=>{
        async function myApi() {
            let r = await UserServices.getAllReporters();
            setReporters(r);
            let c = await UserServices.getAllClientsForApprover();
            setClients(c);
        }
        myApi();
    }, [done]);
    
    // use effect to manage client approval
    useEffect(()=>{
        async function myApiCall(){
            if (initialRender.current){
                initialRender.current = false;
            }
            else {
                if (authorizeClient){
                    // set client status to approved
                    UserServices.updateClientAccountStatus(currentClient, 1);
                }
                else{
                    // set client to not approved
                    UserServices.updateClientAccountStatus(currentClient, 2);
                }
                setDone(false);
            }
        }
        myApiCall();
    }, [authorizeClient]);


    // use effect to manage client approval
    useEffect(()=>{
        async function myApiCall(){
            if (initialRender.current){
                initialRender.current = false;
            }
            else {
                if (authorizeReporter){
                    // set client status to approved
                    UserServices.updateReporterAccountStatus(currentReporter, 1);
                }
                else{
                    // set client to not approved
                    UserServices.updateReporterAccountStatus(currentReporter, 2);
                }
                setDone(false);
            }
        }
        myApiCall();
    }, [authorizeReporter])

    return(
        <div>
            <Grid container direction="column" justify="center" alignItems="center">
            <h1> Users' Accounts Management </h1>
                <ApproveClientsComponent 
                clientData={clients}
                currentClient={currentClient}
                setCurrentClient={setCurrentClient}
                authorizeClient={authorizeClient}
                setAuthorizeClient={setAuthorizeClient}
                setDone={setDone}
                />
                <br/>
                <ApproveReportersComponent 
                reporterData={reporters}
                currentReporter={currentReporter}
                setCurrentReporter={setCurrentReporter}
                authorizeReporter={authorizeReporter}
                setAuthorizeReporter={setAuthorizeReporter}
                setDone={setDone}
                />
            </Grid>
        </div>
    )
}

export default ApproverAccountsView 