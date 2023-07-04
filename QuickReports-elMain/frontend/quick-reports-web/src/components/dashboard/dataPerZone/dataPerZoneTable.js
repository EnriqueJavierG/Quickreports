import React, {useState, useEffect, Component} from 'react'
import {DataGrid} from '@material-ui/data-grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Grid, Typography} from '@material-ui/core'
import { GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';


// Styling components
const useStyles = makeStyles({
    root: {
      '& .super-app-theme--cell': {
        textAlign: 'left'
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
 * @param {
 * zone - number
 * readings - {temp, rh, ts}
 * } props 
 * @returns 
 */
const DataPerZoneTable = (props) => {
    console.log(props)
    // Information for table
const columns = [
    { 
        field: 'id', headerName: 'ID', width: 70, hide:true
    },
    {
        field: 'temp',
        width: 170,
        headerName: 'Temperature (°F)',
        type: 'number',
        cellClassName: (params) =>
            clsx('super-app', {
                // negative: params.value < 60,
                outOfRangeTemp: (params.value < props.study.minTemp || params.value > props.study.maxTemp), //TODO aqui va el temp alarm para el estudio
            }),
    },
    {
        field: 'rh',
        width: 150,
        headerName: 'Humidity %',
        type: 'number',
        cellClassName: (params) =>
            clsx('super-app', {
            // negative: params.value < 60,
            outOfRangeRh: (params.value < props.study.minRh || params.value > props.study.maxRh), // TODO aqui va el rh alarm para el estudio
            }),
    },
    {
        field: 'ts',
        width: 190,
        headerName: 'Date time (24 hr)',
        type: 'dateTime'
    }
];

    const classes = useStyles();
    let title=" Zone " + props.zone +" Temperature and Humidity Data";
        return(
            <Grid item className={classes.root} xs={6} justify="center">
                <Paper style={{height:'500px', width:'550px'}}>
                    <h2>  {title} </h2>
                    <DataGrid rows={props.readings}
                    columns={columns}
                    components={{Toolbar:CustomToolBar}}                            
                    />
                </Paper>
            </Grid>
        );
}

export default DataPerZoneTable
