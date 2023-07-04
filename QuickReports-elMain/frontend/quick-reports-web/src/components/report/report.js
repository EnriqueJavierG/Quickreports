import axios from 'axios';
import React, { useRef , useEffect, useState } from 'react'
import TemperatureSummaryChart from '../dashboard/tempSummaryChart';
import {StudyServices} from '../../services/StudyServices'
import { Study } from '../../services/objects/Study';
import {IconButton , Button, Tooltip} from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
// import DownloadIcon from '@material-ui/icons/Download';
import { makeStyles } from '@material-ui/core/styles';
import {useLocation} from "react-router-dom";
import { UserServices } from '../../services/UserServices';
import { CalibrationServices } from '../../services/CalibrationServices';
const PAGEBREAK = "<!-- pagebreak -->"

// const html2PDF = require('jspdf-html2canvas')
const html2canvas = require('html2canvas')
const {jsPDF} = require('jspdf')

/**
 * fetch the HTML template of the public react src 
 * @param {String} templateName 
 * @returns {Promise<String}
 */
const getTemplate =  async (templateName) => {
  // console.log(`templates/${templateName}.html`)
  const res = await fetch(`templates/${templateName}.html`);
  const reportTemplate = await res.text();
  return reportTemplate;
}

/**
 * 
 * @param {string} pageName 
 * @returns the HTML response from https://thisapp.com/pageName
 */
const getPage =  async (pageName) => {
  // console.log(`${pageName}`)
  const res = await fetch('rhPerZone/10');
  const reportTemplate = await res.text();
  // console.log(reportTemplate)
  return reportTemplate;
}
if(document.getElementById("-1_ifr") != null){

  //console.log(document.getElementById("-1_ifr").contentWindow)
  // document.getElementById("1_chart").setAttribute("src" , localStorage.getItem("2_chart"))
}


const whereIsPhoto = (index) => {
  return index%2
}

/**
   * This function loads up from the localstorage the charts generated for this report 
   * It construct the HTML tags needed 
   * @returns HTML formatted images as string for Report Charts
   */
 const generateImgsHTML = (zonesQty) => {

  let rhCharts = ' '
  let tempCharts = ' '
  let tempSummary = (` <img class="plotsSummary" alt="Try clearing cache and storage" src="${localStorage.getItem(`temp_summary`)}" >`)
  let rhSummary = ` <img class="plotsSummary" alt="Try clearing cache and storage" src="${localStorage.getItem(`rh_summary`)}" >`
  for(let zone_number = 1 ; zone_number <= /*myStudy.zones*/ zonesQty; zone_number++){
    rhCharts += (` <img class="plots-${whereIsPhoto(zone_number - 1)}" alt="Try clearing cache and storage" src="${localStorage.getItem(`rh_chart_${zone_number}`)}" >`)
    tempCharts += (` <img class="plots-${whereIsPhoto(zone_number - 1)}" alt="Try clearing cache and storage" src="${localStorage.getItem(`temp_chart_${zone_number}`)}" >`)
  }

  rhCharts += PAGEBREAK
  tempCharts += PAGEBREAK

  return {rhCharts , tempCharts , tempSummary , rhSummary}
}

const ReportEditor = (props) => {
  let data = useLocation().state
  // console.log(data)
  // console.log(props)
  const [template , setTemplate] = useState(null)
  const[study , setStudy] = useState(data ? data.study : props.study)
  const [zonesQty , setNumZones] =  useState('');
  let u = template == null

  const initialCalls = async () => {
    if(!props.isCalibration){
      // const userInfo = await Auth.currentUserInfo();
      // const attributes = await userInfo.attributes
      // employeeId =attributes['custom:name'];
      // const reporter = await UserServices.get
      // setStudy({...study , })
      let zq = await StudyServices.getNumberOfZones(study)
      // console.log(zq)
      setNumZones(zq[0].number_of_zones)
      // console.log(`Changed zones to ${zonesQty} ${zq[0].number_of_zones}`)
    }else{
      let r = await CalibrationServices.getReportInfo(props.dlName)
      console.log(r)
      setStudy(r[0])
    }
  }
  useEffect(() => {
    initialCalls().then(() => {
      
      getTemplate(!props.isCalibration ? 'validationReport' : 'calibrationReport').then(r => {
        let charts = generateImgsHTML(zonesQty)
        // console.log(zonesQty)
        if(!props.isCalibration){
          study.reporterName = study.reporter;
          study.approvedDate = study.requestDate.toString()
          Object.keys(study).forEach(key =>{
              r=r.replace(new RegExp(`-${key}-`, 'g') , study[key])
          })
          r += (charts.rhSummary + charts.tempSummary + charts.rhCharts + charts.tempCharts )
          r = r.replace(new RegExp(`-zonesQty-`, 'g' ), zonesQty)
        }else{
          //calibration
          console.log(study)

          try{
            Object.keys(study).forEach(key =>{
              r=r.replace(new RegExp(`-${key}-`, 'g') , study[key])
            })
          }catch(e){
            r = '<h1 style="color:"blue";margin:"auto";display:"block">No Calibration ... yet</h1>'
          }

        }
         
          setTemplate(r)
        })
    })
    
    
  } , [u , props.isCalibration , props.study] )
  
  const downloadReport = () => {

    let el = document.getElementById("myReport").cloneNode(true)
    document.body.appendChild(el)
    html2canvas(el).then((canvas) => {
      var a = document.createElement("a")
      a.download = "report.pdf"
      
      var reportImg = canvas.toDataURL('image/png')
      var pdf = new jsPDF('p' ,"px")  
      let canvas_w = canvas.width
      let canvas_h = canvas.height
      var page_w = pdf.internal.pageSize.getWidth()
      let page_h = pdf.internal.pageSize.getHeight()
      var relative_h = canvas_h*page_w/canvas_w
      var heightLeft = relative_h; // all space left
      let position = 0
      
      pdf.addImage(reportImg , 'PNG' , 0 , position , page_w ,  relative_h )
      heightLeft -= page_h
      let i = 1
      while(heightLeft >= 0 ){
        // console.log(relative_h)
        position = i++*-page_h
        pdf.addPage()
        pdf.addImage(reportImg , 'PNG' , 0 , position , page_w ,  relative_h )
        heightLeft -= page_h
      }
      pdf.save(`${study.clientName}-${study.cleanroomName}`)
    })
    el.remove()
  
  }

  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
  
  const classes = useStyles();
  
  
  return (
          <  >
            <Tooltip title="save">
            <Button
              style ={{
                position:'relative',
                float:'right',
                right:'5%',
                zIndex:5
              }}
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={downloadReport}
            >
              Save
            </Button>
            </Tooltip>
            {/* <iframe id="m" ref={editor} title='Validation Report' srcdoc={template} style={{width:1000 , height:1000}} >
                Failed to load Template , sorry mate 
            </iframe> */}
            <div id ="myReport" style = {{display:'block',position:'relative',backgroundColor:'white',marginRight:'auto',marginLeft:'auto',height:props.isCalibration? 631.4175*2: (631.4175*7) ,width:650 }} dangerouslySetInnerHTML={{__html:template}}  >

            </div>
          </ >
          // <div style={{height:1000 , width:1000}} dangerouslySetInnerHTML={{__html: template}}></div>
          // {/* <img alt='could not find' src={localStorage.getItem('1_chart')}/> */}
          //   {/* <Editor ref={editor} id ={'-1'}
          //   value={template}
          //   init={configurations}
          //   onEditorChange={handleEditorChange}
          // /> */}
          
        );
      
    }

export default ReportEditor;