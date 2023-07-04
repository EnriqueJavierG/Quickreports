import React from 'react'
import NistProfileComp from '../components/calibrationStudies/nistProfileComponent'
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    fab: {
        position: 'absolute',
        top: theme.spacing(80),
        right: theme.spacing(37),
    },
    fab1: {
        position: 'absolute',
        top: theme.spacing(80),
        right: theme.spacing(143),
    }
}));

function NistProfileView(props) {
    const classes = useStyles();
    return (
        <div>
            <Grid container xs={12} justify='center'>
                <Grid item xs={9} style={{textAlign:'left'}}>
                    <br />
                    <h2>
                    NIST Equipment Profile
                    </h2>
                    <br />
                </Grid>
                <Grid item xs={11} style={{textAlign:'left'}}>
                    <NistProfileComp
                        manufacturer={'Vaisala'}
                        nistNumber={'NN'}
                        model={'model'}
                        serialNumber={'ser num'}
                        calDate={'2021-01-01'}
                        nomLowTemp={60}
                        nomLowTempTs={'2021-01-01'}
                        nomMedTemp={60}
                        nomMedTempTs={'2021-01-01'}
                        nomHighTemp={60}
                        nomHighTempTs={'2021-01-01'}
                        nomLowRh={60}
                        nomLowRhTs={'2021-01-01'}
                        nomMedRh={60}
                        nomMedRhTs={'2021-01-01'}
                        nomHighRh={60}
                        nomHighRhTs={'2021-01-01'}
                    />
                </Grid>
                <Grid container justify="center" directon="row" > 
                    <Grid item xs={4} justify="flex-start"> 
                        <Fab component={Link} to={'/calibrationStudies'} size='large' variant="extended" aria-label="add">
                            Cancel
                        </Fab>
                    </Grid>
                    <Grid item xs={4} justify="flex-end" > 
                        <Fab size='large' variant="extended" color="primary" aria-label="add" type="submit">
                            <EditIcon className={classes.extendedIcon} />
                            EDIT
                        </Fab>
                    </Grid>
                </Grid>
            </Grid> 
        </div>
    )
}

export default NistProfileView
