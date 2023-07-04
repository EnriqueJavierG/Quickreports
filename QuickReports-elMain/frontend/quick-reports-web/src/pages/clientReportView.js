import { Grid } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import React from 'react';
import ReportEditor from '../components/report/report'
import {useLocation} from "react-router-dom"

function ClientReportView(){

    let data = useLocation();
    const {study} = data.state;

    return(
        <>
            <Grid container justify='center' direction="row" spacing={2} >
                <Grid item xs={8}>
                    <Paper style={{height:'100%', width:'100%', textAlign:'center'}}>
                        <div style={{backgroundColor:'white'}}>
                        <div style={{overflowX:'scroll' , overflowY:'scroll' ,marginLeft:'auto',marginRight:'auto',display:'block', height:950 , width:650 , border:'solid'}} >
                        <ReportEditor study = {study} />
                        </div>
                        </div>  
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default ClientReportView;