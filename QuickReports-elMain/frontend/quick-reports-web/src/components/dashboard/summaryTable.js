import React, {useState} from 'react'
import clsx from 'clsx';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import Paper from '@material-ui/core/Paper';
import { GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';


const useStyles = makeStyles({
  root: {
    '& .super-app-theme--cell': {
      textAlign: 'right'
    },
    '& .super-app.negative': {
      backgroundColor: 'rgba(157, 255, 118, 0.49)',
      color: '#1a3e72',
      fontWeight: '600',
    },
    '& .super-app.outOfRangeTemp': {
      backgroundColor: '#d47483',
      color: '#1a3e72',
      fontWeight: '600',
    },
    '& .super-app.outOfRangeRh': {
        backgroundColor: '#d47483',
        color: '#1a3e72',
        fontWeight: '600',
      },
  },
});


  const CustomToolBar = () => {
    return(
        <GridToolbarContainer>
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
  };

/**
 * 
 * @param {tempHighAlarm
 * tempLowAlarm
 * rhHighAlarm
 * rhLowAlarm
 * statsPerZone=[{id: 1,dataloggerId: '24',zoneNumber: 1,minTemp: 60,
      maxTemp: 81,avgTemp: 78.3,minRh: 53,maxRh: 59.3, avgRh: 56.4},{},...]
  } props 
 * @returns 
 */
export default function SummaryTable(props) {

  const columns = [
    {
        field: 'zone_number',
        width: 85,
        headerName: 'Zone',
        cellClassName: 'super-app-theme--cell',
    },
    {
        field: 'dl_ID_number',
        width: 145,
        headerName: 'Datalogger',
        cellClassName: 'super-app-theme--cell',
    },
    {
    field: 'min_temp_per_zone',
    width: 230,
    headerName: 'Minimum Temperature (°F)',
    type: 'number',
    cellClassName: (params) =>
      clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeTemp: (params.value > props.tempHighAlarm || params.value < props.tempLowAlarm), // aqui va el temp alarm para el estudio
      }),
    },
    {
    field: 'max_temp_per_zone',
    width: 230,
    headerName: 'Maximum Temperature (°F)',
    type: 'number',
    cellClassName: (params) =>
      clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeTemp: (params.value >  props.tempHighAlarm || params.value < props.tempLowAlarm), // aqui va el temp alarm para el estudio
      }),
    },
    {
    field: 'avg_temp_per_zone',
    type: 'number',
    width: 220,
    headerName: 'Average Temperature (°F)',
    cellClassName: (params) =>
      clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeTemp: (params.value >  props.tempHighAlarm || params.value < props.tempLowAlarm), // aqui va el temp alarm para el estudio
      }),
    },
    {
    field: 'min_rh_per_zone',
    width: 190,
    headerName: 'Minimum Humidity %',
    type: 'number',
    cellClassName: (params) =>
        clsx('super-app', {
        // negative: params.value < 60,
        outOfRangeRh: (params.value > props.rhHighAlarm  || params.value < props.rhLowAlarm), // aqui va el rh alarm para el estudio
        }),
    },
    {
        field: 'max_rh_per_zone',
        width: 190,
        headerName: 'Maximum Humidity %',
        type: 'number',
        cellClassName: (params) =>
          clsx('super-app', {
            // negative: params.value < 60,
            outOfRangeRh: (params.value > props.rhHighAlarm || params.value < props.rhLowAlarm), // aqui va el rh alarm para el estudio
          }),
    },
    {
        field: 'avg_rh_per_zone',
        width: 190,
        headerName: 'Average Humidity %',
        type: 'number',
        cellClassName: (params) =>
          clsx('super-app', {
            // negative: params.value < 60,
            outOfRangeRh: (params.value > props.rhHighAlarm || params.value < props.rhLowAlarm), // aqui va el rh alarm para el estudio
          }),
    }
];

  const [filterQuery, setFilterQuery] =useState("")

  // Handling changes
  const handleSearchChangeQuery = (e)=>{
      setFilterQuery(e.target.value)
}

  const classes = useStyles();

  return (
    <Grid item style={{ width: '100%' }} className={classes.root} style={{textAlign:'center'}}> 
        <h1> Study Summary </h1>
        <SearchIcon />
        <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
        <Paper style={{height:'500px', width:'100%'}}>
        <DataGrid title='Study Summary' 
        rows={filterQuery ? props.statsPerZone.filter(x=>
                x['zone_number'].toString().toLowerCase().includes(filterQuery) ||
                x['s_id'].toString().toLowerCase().includes(filterQuery) ||
                x['min_temp_per_zone'].toString().toLowerCase().includes(filterQuery) ||
                x['max_temp_per_zone'].toString().toLowerCase().includes(filterQuery) ||
                x['avg_temp_per_zone'].toString().toLowerCase().includes(filterQuery) ||
                x['min_rh_per_zone'].toString().toLowerCase().includes(filterQuery) ||
                x['max_rh_per_zone'].toString().toLowerCase().includes(filterQuery) ||
                x['avg_rh_per_zone'].toString().toLowerCase().includes(filterQuery)
            ):props.statsPerZone } 
        columns={columns} 
        autoHeight={false}
        pageSize={10}
        components={{Toolbar:CustomToolBar}}
        />
        </Paper>
    </Grid>
  );
}
