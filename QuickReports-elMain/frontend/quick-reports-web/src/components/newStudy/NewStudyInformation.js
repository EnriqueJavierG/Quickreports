import React,{useEffect, useState} from 'react'
import { Box, Grid, MenuItem, TextField, Typography} from '@material-ui/core'
import {UserServices} from '../../services/UserServices'
import { FormikProvider } from 'formik'
function NewStudyInformation(props) {
    const formik = props.formik
    const [clients,setClients] = useState([])
    // UseEffect for getting a list of clients
    useEffect(() => {
        // get all client names
        let clients =[]
        async function myApi() {
            let c = await UserServices.getAllClientsForApprover();
            for(var i =0; i < c.length; i++){
                clients.push(c[i].company)
            }
            setClients(clients);
            
        }
        myApi();
        return () => {
            
        }
    }, [])

    return (
        <Grid style={{display:'table'}} container justify='center' >
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box  p={2}>
                        <Typography>Client</Typography>
                        <TextField
                        size='small' 
                        fullWidth
                        select
                        id="clientName"
                        name="clientName"
                        variant='outlined'
                        value={formik.values.clientName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                        helperText={formik.touched.clientName && formik.errors.clientName}
                        >
                            {clients.map(company=>{
                                return <MenuItem value={company}>{company}</MenuItem>
                            })}
                        </TextField>
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box  p={2}>
                        <Typography>Cleanroom Name: </Typography>
                        <TextField
                        size='small'
                        fullWidth
                        id="cleanRoomName"
                        name="cleanRoomName"
                        variant='outlined'
                        value={formik.values.cleanRoomName}
                        onChange={formik.handleChange}
                        error={formik.touched.cleanRoomName && Boolean(formik.errors.cleanRoomName)}
                        helperText={formik.touched.cleanRoomName && formik.errors.cleanRoomName}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box  p={2}>
                    <Typography>Request Date: </Typography>
                    <TextField
                    size='small'
                    fullWidth
                    id="requestDate"
                    name="requestDate"
                    variant='outlined'
                    type="date"
                    value={formik.values.requestDate}
                    onChange={formik.handleChange}
                    error={formik.touched.requestDate && Boolean(formik.errors.requestDate)}
                    helperText={formik.touched.requestDate && formik.errors.requestDate}
                    />
                    </Box>
                </Grid>
            </Grid>
            <Grid style={{display:'table-row'}} container alignContent="space-between" alignItems="center" >
                <Grid style={{display:'table-cell'}} item>
                    <Box  p={2}>
                        <Typography>Number of Dataloggers: </Typography>
                        <TextField
                        size='small'
                        fullWidth
                        id="numDataloggers"
                        name="numDataloggers"
                        variant='outlined'
                        type="number"
                        value={formik.values.numDataloggers}
                        onChange={formik.handleChange}
                        error={formik.touched.numDataloggers && Boolean(formik.errors.numDataloggers)}
                        helperText={formik.touched.numDataloggers && formik.errors.numDataloggers}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NewStudyInformation

