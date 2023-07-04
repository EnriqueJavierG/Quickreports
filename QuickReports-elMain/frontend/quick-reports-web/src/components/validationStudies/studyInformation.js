import React,{useEffect,useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Box } from '@material-ui/core'
const {DateManager} = require('../../dateManager');

function StudyInformation(props) {
    const formik = props.formik
    const values = props.formik.values
    
    // UseEffect for getting a list of clients

    const getCorrect = (someDate) => {
        console.log('desde el study prof view')
        console.log(someDate)
        if(typeof someDate == 'string' && someDate.length == 24){
            
        }
        // someDate = DateManager.convertFullDateStringToObj(someDate)
        console.log(someDate)
        someDate=`${someDate}Z`
        someDate=new Date(someDate)
        try{
            //let date = new Date(someDate)
            let r = someDate.toISOString().slice(0,16)
            // console.log(`sending back  ${r}`)
            return r
        }catch(e){
            console.log('this failed sad :(')
            return '1212:12:12T12:12'
        }
    }

    // const getCorrect2 = (someDate) => {
    //     console.log('desde el study prof view')
    //     console.log(someDate)
    //     someDate = DateManager.convertReqDateStringToObj(someDate)
    //     console.log(someDate)
    //     try{
    //         // let date = new Date(someDate)
    //         let r = someDate.toISOString().slice(0,10)
    //         console.log(`sending back ${r}`)
    //         return r
    //     }catch(e){
    //         console.log('this failed sad :(')
    //         return '1212:12:12T12:12'
    //     }
    // }

    
    return (
        <Grid style={{display:'table'}} container justify='center' >
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Study Id</Typography>
                        <TextField  
                        size='small'
                        defaultValue= {values.studyID}
                        id="studyName"
                        name="studyName"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.studyID && Boolean(formik.errors.studyID)}
                        helperText={formik.touched.studyID && formik.errors.studyID}
                        value= {values.studyID}
                        variant='outlined'
                        InputProps={{readOnly: true,}}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                <Box p={2}>
                    <Typography>Client</Typography>
                    <TextField
                    size='small'
                    defaultValue= {values.client} 
                    color='secondary'
                    id="client"
                    name="client"
                    type="text"
                    onChange={formik.handleChange}
                    error={formik.touched.client && Boolean(formik.errors.client)}
                    helperText={formik.touched.client && formik.errors.client}
                    value= {values.client}
                    variant={"outlined"} 
                    InputProps={{readOnly: true,}}
                    />
                    </Box>
                </Grid>
            </Grid>
                
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                <Box p={2}>
                    <Typography >Cleanroom Name</Typography>
                    <TextField
                    size='small' 
                    defaultValue= {values.cleanroomName}
                    id="cleanroomName"
                    name="cleanroomName"
                    type="text"
                    color='secondary'
                    onChange={formik.handleChange}
                    error={formik.touched.cleanroomName && Boolean(formik.errors.cleanroomName)}
                    helperText={formik.touched.cleanroomName && formik.errors.cleanroomName}
                    value= {values.cleanroomName}
                    variant={props.readOnly ? "outlined": "filled"} 
                    InputProps={{readOnly: props.readOnly,}}
                    />
                </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                    <Typography >Request Date (mm-dd-yyyy)</Typography>
                        <TextField
                        size='small'
                        fullWidth 
                        // defaultValue= {formatDate(values.reqDate)}
                        defaultValue={values.reqDate}
                        id="reqDate"
                        name="reqDate"
                        type="date"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.reqDate && Boolean(formik.errors.reqDate)}
                        helperText={formik.touched.reqDate && formik.errors.reqDate}
                        value= {(values.reqDate)}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    {/* {props.readOnly?
                        <>
                        <Typography >Request Date (yyyy-mm-dd)</Typography>
                        <TextField
                        size='small'
                        fullWidth 
                        defaultValue= {formatDate(values.reqDate)}
                        id="reqDate"
                        name="reqDate"
                        type="text"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.reqDate && Boolean(formik.errors.reqDate)}
                        helperText={formik.touched.reqDate && formik.errors.reqDate}
                        value= {values.reqDate}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                        </>
                        :
                        <>
                        <Typography >Request Date</Typography>
                        <TextField
                        size='small'
                        fullWidth 
                        defaultValue= {values.reqDate}
                        id="reqDate"
                        name="reqDate"
                        type="date"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.reqDate && Boolean(formik.errors.reqDate)}
                        helperText={formik.touched.reqDate && formik.errors.reqDate}
                        value= {values.reqDate}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                        </>} */}
                        
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                    <Typography >Reporter</Typography>
                    <TextField 
                    size='small'
                    defaultValue= {values.reporter}
                    id="reporter"
                    name="reporter"
                    type="text"
                    color='secondary'
                    onChange={formik.handleChange}
                    error={formik.touched.reporter && Boolean(formik.errors.reporter)}
                    helperText={formik.touched.reporter && formik.errors.reporter}
                    value= {values.reporter}
                    variant={"outlined"} 
                    InputProps={{readOnly: true,}}
                    />
                    </Box>
                </Grid>  
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>Status</Typography>
                        <TextField
                        size='small' 
                        defaultValue= {values.status} 
                        value={values.status}
                        variant='outlined'
                        color='secondary'
                        InputProps={{readOnly:true}}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        {props.readOnly?<></>:<></>}
                        <Typography>Start Date</Typography>
                        <TextField 
                        size='small'
                        defaultValue= {getCorrect(values.startDate)}
                        // defaultValue= {values.startDate}
                        id="startDate"
                        fullWidth
                        name="startDate"
                        type="datetime-local"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                        value= {getCorrect(values.startDate)}
                        //value= {values.startDate}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
                <Grid style={{display:'table-cell'}} item>
                    <Box p={2}>
                        <Typography>End Date</Typography>
                        <TextField 
                        size='small'
                        fullWidth
                        defaultValue= {getCorrect(values.endDate)}
                        // defaultValue= {values.endDate}
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        color='secondary'
                        onChange={formik.handleChange}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                        value= {getCorrect(values.endDate)}
                        //value= {values.endDate}
                        variant={props.readOnly ? "outlined": "filled"} 
                        InputProps={{readOnly: props.readOnly,}}
                        />
                    </Box>
                </Grid>
            </Grid>
            
        </Grid>
    )
}

export default StudyInformation
