import React, {useState} from 'react';
import {DataGrid} from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button'


/**
 * 
 * @param {data = [{id, sessNum, manuf, modal, serial Num, calDate, nomReadings and timestamps},...]
 * } props 
 * @returns 
 */

function CalibrationStudyTable(props) {

    // Information for table
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide:true },
        { field: 'sessionNumber', headerName: 'Session Number', width: 160,renderCell: (params) => (
            <strong>
            <Button color='primary' component={Link}
            to={{pathname: '/nistProfile/'+params.value, state:{calSessPk:params.value}}}>
                {params.value}
            </Button>
            </strong> )},
        { field: 'manufacturer', headerName: 'Manufacturer', width: 140 },
        { field: 'model', headerName: 'Model', width: 100 },
        { field: 'serialNum', headerName:'Serial Number', width:150},
        { field: 'calibrationDate', headerName:'Calibration Date', type:'date', width:160},
        { field: 'nominalTemp', headerName:'Nominal Temperature (F)', width:212},
        { field: 'nominalRh', headerName:'Nominal Relative Humidity (%)', width:250}
    ];

    const [filterQuery, setFilterQuery] =useState("")

    // Handling changes
    const handleSearchChangeQuery = (e)=>{
        setFilterQuery(e.target.value)
    }

    

    const clickCalibrationSess = (row) => {
        props.setModalInfo(row);
        props.setShowInsertDl(true);
        props.setCalSess(row.sessionNumber);
        props.setEnableTableClick(false);
    };

    return (
        <div>
        {props.enableTableClick ? 
            <Grid container justify='center' xs={8} spacing={3}>    
                <Grid item xs={10} md={10} justify="center">
                    <SearchIcon />
                    <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
                    <Paper style={{height:'500px', width:'1200px'}}>
                        <DataGrid title='Calibration Studies' columns={columns} rows={
                            filterQuery ? props.data.filter(x=>
                                x['manufacturer'].toLowerCase().includes(filterQuery) || 
                                x['model'].toLowerCase().includes(filterQuery) ||
                                x['serialNum'].toLowerCase().includes(filterQuery) ||
                                x['calibrationDate'].toLowerCase().includes(filterQuery) ||
                                x['nominalTemp'].toString().toLowerCase().includes(filterQuery) ||
                                x['nominalRh'].toString().toLowerCase().includes(filterQuery) 
                                ):props.data
                            }
                            pageSize={10}
                            autoHeight={false}    
                            onRowClick={(rowData)=>clickCalibrationSess(rowData.row)}
                            >
                        </DataGrid>
                    </Paper>
                </Grid>
            </Grid>
        :
            <Grid container justify='center' xs={8} spacing={3}>    
                <Grid item xs={10} md={10} justify="center">
                    <SearchIcon />
                    <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
                    <Paper style={{height:'500px', width:'1200px'}}>
                        <DataGrid title='Calibration Studies' columns={columns} rows={
                            filterQuery ? props.data.filter(x=>
                                x['manufacturer'].toLowerCase().includes(filterQuery) || 
                                x['model'].toLowerCase().includes(filterQuery) ||
                                x['serialNum'].toLowerCase().includes(filterQuery) ||
                                x['calibrationDate'].toLowerCase().includes(filterQuery) ||
                                x['nominalTemp'].toString().toLowerCase().includes(filterQuery) ||
                                x['nominalRh'].toString().toLowerCase().includes(filterQuery) 
                                ):props.data
                            }
                            pageSize={10}
                            autoHeight={false}    
                            >
                        </DataGrid>
                    </Paper>
                </Grid>
            </Grid>
        }
                        
        </div>
    )
}

export default CalibrationStudyTable
