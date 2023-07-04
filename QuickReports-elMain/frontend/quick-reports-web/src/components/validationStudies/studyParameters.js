import React,{useRef, useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import {StudyServices} from '../../services/StudyServices'
function StudyParameters(props) {
    const formik = props.formik
    const values = props.formik.values
    const initialRender = useRef(true);
    const [dlList, setDLList] = useState([])

    useEffect(() => {
        async function myApiCall(){
            console.log('Llamate esos locos')
            console.log('study',props.study)
            let dataloggers = await StudyServices.getDataloggersInStudy(props.study) 
            console.log('dataloggers',dataloggers)
            setDLList(dataloggers)
        } 
        myApiCall()
        return () => {
            
        }
    }, [])


    return (
        <Grid container style={{display:'table'}} direction='column' >
            <Grid style={{display:'table-row'}} container>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>  
                        <Typography>Temperature High Alarm (°F) &#8457;: </Typography>
                        <TextField 
                        size='small'
                        defaultValue= {values.tempHighAlarm}
                        id="tempHighAlarm"
                        name="tempHighAlarm"
                        type="number"
                        onChange={formik.handleChange}
                        error={formik.touched.tempHighAlarm && Boolean(formik.errors.tempHighAlarm)}
                        helperText={formik.touched.maxTemp && formik.errors.tempHighAlarm}
                        value= {values.tempHighAlarm}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>  
                        <Typography>Temperature Low Alarm (°F) &#8457;: </Typography>
                        <TextField
                        size='small' 
                        defaultValue= {values.tempLowAlarm}
                        id="tempLowAlarm"
                        name="tempLowAlarm"
                        type="number"
                        onChange={formik.handleChange}
                        error={formik.touched.tempLowAlarm && Boolean(formik.errors.tempLowAlarm)}
                        helperText={formik.touched.tempLowAlarm && formik.errors.tempLowAlarm}
                        value= {values.tempLowAlarm}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}> 
                        <Typography>Relative Humidity High Alarm %: </Typography>
                        <TextField 
                        size='small'
                        defaultValue= {values.rhHighAlarm}
                        id="rhHighAlarm"
                        name="rhHighAlarm"
                        type="number"
                        onChange={formik.handleChange}
                        error={formik.touched.rhHighAlarm && Boolean(formik.errors.rhHighAlarm)}
                        helperText={formik.touched.rhHighAlarm && formik.errors.rhHighAlarm}
                        value= {values.rhHighAlarm}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}> 
                        <Typography >Relative Humidity Low Alarm %: </Typography>
                        <TextField 
                        size='small' 
                        defaultValue= {values.studyName}
                        id="rhLowAlarm"
                        name="rhLowAlarm"
                        type="number"
                        onChange={formik.handleChange}
                        error={formik.touched.rhLowAlarm && Boolean(formik.errors.rhLowAlarm)}
                        helperText={formik.touched.rhLowAlarm && formik.errors.rhLowAlarm}
                        value= {values.rhLowAlarm}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}> 
                        <Typography>Sampling Rate</Typography>
                        <TextField 
                        select
                        fullwidth
                        size='small'
                        id="samplingRate"
                        name="samplingRate"
                        onChange={formik.handleChange}
                        error={formik.touched.samplingRate && Boolean(formik.errors.samplingRate)}
                        helperText={formik.touched.samplingRate && formik.errors.samplingRate}
                        value= {values.samplingRate}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        >
                        <MenuItem key ={10} value={10} >10 sec</MenuItem>
                        <MenuItem key ={15} value={15} >15 sec</MenuItem>
                        <MenuItem key ={20} value={20} >20 sec</MenuItem>
                        <MenuItem key ={30} value={30} >30 sec</MenuItem>
                        <MenuItem key ={60} value={60} >1 min</MenuItem>
                        <MenuItem key ={120} value={120} >2 min</MenuItem>
                        <MenuItem key ={300} value={300}> 5 min</MenuItem>
                        <MenuItem key ={600} value={600} >10 min</MenuItem>
                        <MenuItem key ={900} value={900} >15 min</MenuItem>
                        <MenuItem key ={1200} value={1200} >20 min</MenuItem>
                        <MenuItem key ={1800} value={1800} >30 min</MenuItem>
                        <MenuItem key ={3600} value={3600} >1 h</MenuItem>
                        <MenuItem key ={21600} value={21600} >6 h</MenuItem>
                        <MenuItem key ={43200} value={43200} >12 h</MenuItem>
                        </TextField>
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}> 
                        <Typography>Number of Dataloggers: </Typography>
                            <TextField 
                            size='small'
                            defaultValue= {values.dataloggersQty}
                            id="dataloggersQty"
                            name="dataloggersQty"
                            type="number"
                            onChange={formik.handleChange}
                            error={formik.touched.dataloggersQty && Boolean(formik.errors.dataloggersQty)}
                            helperText={formik.touched.dataloggersQty && formik.errors.dataloggersQty}
                            value= {values.dataloggersQty}
                            variant={props.readOnly ? "outlined": "filled"} 
                            InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}> 
                        <Typography>Datalogger list</Typography>
                        <TextField 
                        select
                        fullwidth
                        size='small'
                        id="samplingRate"
                        name="samplingRate"
                        variant={"outlined"} 
                        >
                        {dlList.map(dl=>{
                            return(<MenuItem value={dl['dlName']}>{dl['dlName']}</MenuItem>)
                        })}
                        </TextField>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default StudyParameters
