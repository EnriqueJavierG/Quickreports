import React from 'react'
import { Grid, TextField, Typography,Box, MenuItem} from '@material-ui/core'
function NewStudyParameters(props) {
    const formik = props.formik
    return (
        <Grid style={{display:'table'}} container direction='column' spacing={2}>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Start Date</Typography>
                        <TextField
                        size='small'
                        variant='outlined'
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                        />  
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>End Date</Typography>
                        <TextField
                        size='small'
                        id="endDate"
                        name="endDate"
                        variant='outlined'
                        type="datetime-local"
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Temperature High Alarm (°F) </Typography>
                        <TextField
                        size='small'
                        id="highAlarmTemp"
                        name="highAlarmTemp"
                        variant='outlined'
                        type="number"
                        value={formik.values.highAlarmTemp}
                        onChange={formik.handleChange}
                        error={formik.touched.highAlarmTemp && Boolean(formik.errors.highAlarmTemp)}
                        helperText={formik.touched.highAlarmTemp && formik.errors.highAlarmTemp}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Temperature Low Alarm (°F) </Typography>
                        <TextField
                        size='small'
                        id="lowAlarmTemp"
                        name="lowAlarmTemp"
                        variant='outlined'
                        type="number"
                        value={formik.values.lowAlarmTemp}
                        onChange={formik.handleChange}
                        error={formik.touched.lowAlarmTemp && Boolean(formik.errors.lowAlarmTemp)}
                        helperText={formik.touched.lowAlarmTemp && formik.errors.lowAlarmTemp}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Relative Humidity High Alarm(%) </Typography>
                        <TextField
                        size='small'
                        id="highAlarmRH"
                        name="highAlarmRH"
                        variant='outlined'
                        type="number"
                        value={formik.values.highAlarmRH}
                        onChange={formik.handleChange}
                        error={formik.touched.highAlarmRH && Boolean(formik.errors.highAlarmRH)}
                        helperText={formik.touched.highAlarmRH && formik.errors.highAlarmRH}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Relative Humidity Low Alarm(%) </Typography>
                        <TextField
                        size='small'
                        id="lowAlarmRH"
                        name="lowAlarmRH"
                        variant='outlined'
                        type="number"
                        value={formik.values.lowAlarmRH}
                        onChange={formik.handleChange}
                        error={formik.touched.lowAlarmRH && Boolean(formik.errors.lowAlarmRH)}
                        helperText={formik.touched.lowAlarmRH && formik.errors.lowAlarmRH}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                    <Typography>Sampling Rate: </Typography>
                        <TextField 
                        select
                        fullwidth
                        size='small'
                        id="samplingRate"
                        name="samplingRate"
                        onChange={formik.handleChange}
                        error={formik.touched.samplingRate && Boolean(formik.errors.samplingRate)}
                        helperText={formik.touched.samplingRate && formik.errors.samplingRate}
                        value= {formik.values.samplingRate}
                        variant={"outlined"} 
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
            </Grid> 
        </Grid>
    )
}

export default NewStudyParameters
