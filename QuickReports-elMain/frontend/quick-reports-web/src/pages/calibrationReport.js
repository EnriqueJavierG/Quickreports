
const { default: ReportEditor } = require("../components/report/report")
const CalibrationReportView = (props) => {
    return (
        <div style={{backgroundColor:'white'}}>
            <div style={{overflowX:'scroll' , overflowY:'scroll' ,marginLeft:'auto',marginRight:'auto',display:'block', height:950 , width:800 , border:'solid'}} >
            <ReportEditor isCalibration={true} study={{clientName:'Pablo'}}/>
            </div>
        </div>
    )
      
}

export default CalibrationReportView