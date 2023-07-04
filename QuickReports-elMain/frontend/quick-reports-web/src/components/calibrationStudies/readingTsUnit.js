import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


/**
 * @author Fabiola Badillo Ramos
 *
 */

const container = {
    display: 'flex',
    flexDirection: 'row',
    //background: 'black',
    width: '65%'

}

function ReadingTsUnit(props) {

    const {
        name, 
        value, 
        timestamp, 
        readOnly,
        onChange,
        touched,
        touchedTs,
        error,
        errorTs,
        title
    } = props;

    
    return (
        <Paper style={container}>
            <Grid container direction='row' spacing={6} justify="space-evenly" >
                <Grid item >
                    <Typography> {title} </Typography>
                    <TextField 
                        defaultValue={value}
                        id={name}
                        name={name}
                        type="number"
                        value={value}
                        onChange={onChange}
                        error={touched && Boolean(error)}
                        helperText={touched && error}
                        variant={readOnly ? "standard": "filled"} 
                        InputProps={{readOnly: readOnly}} />
                </Grid>
                <Grid item  >
                <Typography> Timestamp: </Typography>
                <TextField 
                    defaultValue={timestamp}
                    id={`${name}Ts`}
                    name={`${name}Ts`}
                    type="datetime-local"
                    value={timestamp}
                    onChange={onChange}
                    error={touchedTs && Boolean(errorTs)}
                    helperText={touchedTs && errorTs}
                    variant={readOnly ? "standard": "filled"} 
                    InputProps={{readOnly: readOnly}} />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ReadingTsUnit

