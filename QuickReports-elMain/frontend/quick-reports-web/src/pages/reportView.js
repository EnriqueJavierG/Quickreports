import { useLocation } from "react-router"

const { default: ReportEditor } = require("../components/report/report")
const ReportView = (props) => {
    console.log(props.location.state)
    
    return (
        <div style={{backgroundColor:'white'}}>
            <div style={{overflowX:'scroll' , overflowY:'scroll' ,marginLeft:'auto',marginRight:'auto',display:'block', height:950 , width:690 , border:'solid'}} >
            <ReportEditor study = {props.study} />
            </div>
        </div>
    )
      
}

export default ReportView