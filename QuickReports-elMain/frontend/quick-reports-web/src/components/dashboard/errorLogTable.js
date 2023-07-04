import clsx from 'clsx';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Modal, TextField } from '@material-ui/core';
import React, {useState} from 'react'
import Paper from '@material-ui/core/Paper';
import WarningPopUp from './dataPerZone/warningPopUp';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search'
import { GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';




/**
 * 
 * @param {*
 * 
 * errors = [{id, dataloggerId, zoneNumber, temp, rh, timestamp, errorType}, {...}, ... ]
   tempHighAlarm (number) 
   tempLowAlarm
   rhHighAlarm
   rhLowAlarm
   readingsFromErrorZones  - all the readings for each zone that is involved in a warning

 * } props 
 * @returns 
 */

export default function ErrorLogTable(props) {

  // console.log('los props de error log table')
  // console.log(props)

  const highlightErrorsRh = (ds) => {
        for (let i = 0; i<ds.length; i++){
            if (ds[i].y > props.rhHighAlarm || ds[i].y < props.rhLowAlarm){
                ds[i]['markerType']="cross";
                ds[i]['color']='red';
            }
        }
    return ds;
  }  

  const highlightErrorsTemp = (ds) => {
      for (let i = 0; i<ds.length; i++){
          if (ds[i].y > props.tempHighAlarm || ds[i].y < props.tempLowAlarm){
              ds[i]['markerType']="cross";
              ds[i]['color']='red';
          }
      }
    return ds;
  }  

  const columns = [
    {
      field: 'zoneNumber',
      width: 85,
      headerName: 'Zone',
      type: 'number',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'dataloggerId',
      width: 130,
      type: 'text',
      headerName: 'Datalogger',
      cellClassName: 'super-app-theme--cell',
    },
    {
    field: 'temp',
    width: 120,
    headerName: 'Temp(°F)',
    type: 'number',
    cellClassName: (params) =>
      clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeTemp: (params.value > props.tempHighAlarm || params.value < props.tempLowAlarm), // aqui va el temp alarm para el estudio
        nearRangeTemp:((params.value = props.tempHighAlarm)|| (params.value = props.tempLowAlarm )||( params.value = props.tempHighAlarm-1) || (params.value = props.tempLowAlarm+1))
      }),
    },
    {
    field: 'rh',
    width: 120,
    headerName: 'Hum %',
    type: 'number',
    cellClassName: (params) =>
        clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeRh: (params.value > props.rhHighAlarm || params.value < props.rhLowAlarm), // aqui va el rh alarm para el estudio
        nearRangeRh:((params.value = props.rhHighAlarm )|| (params.value = props.rhLowAlarm )||( params.value = props.rhHighAlarm-0.5) || (params.value = props.rhLowAlarm+0.5))
        }),
    },
    {
      field: 'timestamp',
      width: 180,
      headerName: 'Date',
      type: 'dateTime'
    },
    {
      field: 'errorType',
      width: 150,
      headerName: 'Error Type',
      cellClassName: 'super-app-theme--cell'
    }
  ];

  const [filterQuery, setFilterQuery] =useState("")

    // Handling changes
    const handleSearchChangeQuery = (e)=>{
        setFilterQuery(e.target.value)
    }

  const useStyles = makeStyles({
    root: {
      '& .super-app-theme--cell': {
        textAlign: 'left'
      },
      '& .super-app.negative': {
        backgroundColor: 'rgba(157, 255, 118, 0.49)',
        color: '#1a3e72',
        fontWeight: '600',
      },
      '& .super-app.outOfRangeTemp': {
        backgroundColor: '#f58d25',
        color: '#1a3e72',
        fontWeight: '600',
      },
      '& .super-app.outOfRangeRh': {
          backgroundColor: '#ffbc12',
          color: '#1a3e72',
          fontWeight: '600',
        },
        '& .super-app.nearRangeTemp': {
          backgroundColor: '#f58d25',
          color: '#1a3e72',
          fontWeight: '600',
        },
        '& .super-app.nearRangeRh': {
          backgroundColor: '#ffbc12',
          color: '#1a3e72',
          fontWeight: '600',
        },
    },
  });
  // #f9da10 <- yellow
  // #f58d25 <- orange
  // #ffbc12 <- lighter orange
  // #d47483 <- redish
  

  const getModalData = (row) => {
    let data = props.readingsFromErrorZones
    let zoneNumber = row.zoneNumber;
    let tData = '';
    let hData = '';
    for (let i = 0; i<data.length; i++){
        if (data[i].zoneNumber.zone_number == zoneNumber){
            tData = data[i].tempData;
            hData = data[i].rhData;
        }
    }
    return {tData, hData};
  }

  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const rowEvents = (row) => {
      setModalInfo(row);
      let modData = getModalData(row);
      // console.log(modData)
      setModalData(modData);
      toggleTrueFalse();
  }

  const toggleTrueFalse = () => {
      setShowModal(handleShow);
  };

  const ModalContent = () => {
    // console.log(highlightErrorsRh(modalData.hData))
    // console.log(highlightErrorsTemp(modalData.tData))
      return(
        <Modal open={show} onClose={handleClose}>
            <WarningPopUp zone={modalInfo.zoneNumber}
            rhData={highlightErrorsRh(modalData.hData)} 
            tempData={highlightErrorsTemp(modalData.tData)}/>    
        </Modal>
      )
  }

  const CustomToolBar = () => {
    return(
        <GridToolbarContainer>
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
};

  const classes = useStyles();
  
  return (
    <div style={{width: '88%'}} > 
        <Grid item className={classes.root} style={{textAlign:'center'}}> 
            <Tooltip title='Click row to view zone graphs' aria-label="add">
            <h1> Error Log </h1>
            </Tooltip>
            </Grid> 
            <Grid item className={classes.root} style={{textAlign:'left'}}> 
            <SearchIcon />
            <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
            <Paper style={{height:'500px', width:'870px'}}>
            <DataGrid title='Error Logs' rows={filterQuery ? props.errors.filter(x=>
                x['zoneNumber'].toString().toLowerCase().includes(filterQuery) ||
                x['dataloggerId'].toLowerCase().includes(filterQuery) ||
                x['temp'].toString().toLowerCase().includes(filterQuery) ||
                x['rh'].toString().toLowerCase().includes(filterQuery) ||
                x['timestamp'].toString().toLowerCase().includes(filterQuery) ||
                x['errorType'].toString().toLowerCase().includes(filterQuery)
            ):props.errors } 
            columns={columns} 
            autoHeight={false}
            pageSize={10}
            components={{Toolbar:CustomToolBar}}
            onRowClick={(rowData)=>rowEvents(rowData.row)}
            />
            </Paper>
        </Grid> 

        {show ? <ModalContent /> : null}
        
    </div>
  );
}
