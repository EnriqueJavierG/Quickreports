import {Paper } from "@material-ui/core"
import SaveIcon from '@material-ui/icons/Save';
import DescriptionIcon from '@material-ui/icons/Description';
const DownloadPage = () => {

    return(
        <>
        <Paper style ={{width:'20vw' , height:'20vh' ,marginLeft:'auto', marginRight:'auto',display:"block" , marginTop:'5vh' , marginBottom:'5vh'}}>
           <DescriptionIcon style={{color:'lightBlue' , fontSize:'50pt' ,marginLeft:'auto', marginRight:'auto',display:"block", marginTop:'auto' , marginBottom:'auto'}} />
           <Paper style={{textAlign:'center', backgroundColor:'lightBlue' , width:'80%' , height:'35%' , marginLeft:'auto' , marginRight:'auto' , display:'block' }}>
                <a href="datalogger_addon.exe" download style={{textDecoration:'none' , color:'black'}}>
                    Download x64 Local Comunnications Server
                </a>
           </Paper>
        </Paper>
        <Paper style ={{width:'20vw' , height:'20vh' ,marginLeft:'auto', marginRight:'auto',display:"block" , marginTop:'5vh' , marginBottom:'5vh'}}>
           <DescriptionIcon style={{color:'lightBlue' , fontSize:'50pt' ,marginLeft:'auto', marginRight:'auto',display:"block", marginTop:'auto' , marginBottom:'auto'}} />
           <Paper style={{textAlign:'center', backgroundColor:'lightBlue' , width:'80%' , height:'35%' , marginLeft:'auto' , marginRight:'auto' , display:'block' }}>
                <a href="datalogger_addon.exe" download style={{textDecoration:'none' , color:'black'}}>
                    Download x86 Local Comunnications Server
                </a>
           </Paper>
        </Paper>
        </>
    )
}

export default DownloadPage