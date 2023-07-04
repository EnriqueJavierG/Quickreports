import { Grid } from '@material-ui/core'
import ApproverStudyTable from '../components/approver/approverStudyTable'
import VerifyReportView from '../pages/verifyReportView'
import React, {useEffect, useState, useRef} from 'react'
import { StudyServices } from '../services/StudyServices';



function ApproverHomeView(){

    const initialRender = useRef(true);

    // hook to manage which components are present in the page
    const [review, setReview] = useState(false);
    // hook to determine if report is approved
    const [approved, setApproved] = useState(false);
    // hook to determine the current study being reviewed (PK)
    const [currentStudy, setCurrentStudy] = useState();
    // hook for approver study table data
    const [studies, setStudies] = useState([]);
    // hook for storing the study object that will be passed to the dashboard page
    const [studyObj, setStudyObj] = useState({});

    // for initial render
    useEffect(()=>{
        async function myApiCall(){
            let r = await StudyServices.getStudyForApproverPage();
            setStudies(r);
        }
        myApiCall();
    },[review]);

    // for when the approver verifies the report
    useEffect(()=> {
        async function myApiCall(){
            if (initialRender.current){
                initialRender.current = false;
            }
            else {
                console.log('aprobando')
                if (approved){
                    // set study status to approved
                    console.log('APPROVED')
                    console.log(currentStudy)
                    StudyServices.updateStatus(currentStudy, 4);
                }
                else{
                    // set study to not approved
                    console.log('NOT APPROVED')
                    StudyServices.updateStatus(currentStudy, 5);
                }
            }
        }
        myApiCall();
    }, [approved]);


    return(
       <>
           <Grid container justify='center' >
                <Grid item xs={7} style={{textAlign:'center'}}> 
                    {review ? 
                        <>
                        <h1> Review Report for Approval  </h1>
                        <p> Study ID: {currentStudy} </p>
                        </>
                    : 
                        <h1> Approver Home: Thermal Studies </h1>
                    }
                </Grid>
                {review ? 
                    <VerifyReportView 
                    studyObj={studyObj}
                    review={review}
                    setReview={setReview}
                    approved={approved}
                    setApproved={setApproved} 
                    currentStudy={currentStudy}
                    setCurrentStudy={setCurrentStudy}
                    /> 
                : 
                    <Grid item xs={8} style={{textAlign:'left'}}> 
                    <ApproverStudyTable
                    studyObj={studyObj}
                    setStudyObj={setStudyObj}
                    studies={studies}
                    review={review}
                    setReview={setReview} 
                    approved={approved}
                    currentStudy={currentStudy}
                    setCurrentStudy={setCurrentStudy}
                    />
                    </Grid>
                }
           </Grid>
       </> 
    )
}

export default ApproverHomeView