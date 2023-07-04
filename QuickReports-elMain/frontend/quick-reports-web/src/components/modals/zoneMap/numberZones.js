import React,{useState, useEffect, useRef} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { TextareaAutosize, Typography } from '@material-ui/core';
function NumberZones(props) {
    const initialRender = useRef(true);
    const [submitting, setSubmitting] = useState(false)
    const [zones,setZones] = useState(1)
    useEffect(() => {
        if(initialRender.current){
            initialRender.current = false;
        }
        else{
            if(submitting){
                props.setNZones(zones) // number of zones
                props.setNumberZoneSet(true) 
                console.log(zones)
            }
        }
        return () => {
            //cleanup
        }
    }, [submitting])

    const handleChange = (e) =>{
        console.log(e.target.value)
        setZones(e.target.value)
    }
    return (
        <div  style={{position: 'absolute', left: '50%', top: '15%',
        transform: 'translate(-50%)' }}>
            <Paper elevation={3}>
            <Typography variant='h5'>Number of Zones to associate to Study</Typography>
            <TextField
            variant='outlined'
            color='secondary'
            type='number'
            onChange={handleChange}
            />
            <Button onClick={()=>setSubmitting(TextareaAutosize)} color='primary'> Submit</Button>
            </Paper>
        </div>
    )
}

export default NumberZones
