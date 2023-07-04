import React from 'react'
import Grid from '@material-ui/core/Grid'
import StudyParameters from './studyParameters'
import StudyInformation from './studyInformation'
import StudyActions from './studyActions'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core'
function StudyProfileComp(props) {
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
            top: theme.spacing(30),
            right: theme.spacing(0),
        }
    }));


    const classes = useStyles();
    
    const formik = props.formik;

    const handleEdit= props.handleEdit
    const readOnly = props.readOnly

    const study = props.study
    return (
        <>
        <Fab size='large' variant="extended" color="primary" aria-label="add" type="submit"
            onClick={handleEdit}
            >
            {readOnly ? <EditIcon className={classes.extendedIcon} />: <DoneIcon className={classes.extendedIcon}/>}
            {readOnly ? 'EDIT': 'DONE'}
        </Fab>
        <Grid style={{display:'table'}} justify='center' alignItems='center' container>
            <form onSubmit={formik.handleSubmit}>
                <Grid style={{display:'table-row'}} container justify='center' alignItems='center'>     
                    <Grid item style={{display:'table-cell'}}>   
                    <Box p={2}>
                    <Typography variant='h5'>Study Information</Typography>  
                        <StudyInformation readOnly={props.readOnly} formik={formik} studyID={props.studyID}></StudyInformation>
                    </Box>  
                    </Grid>
                    
                    <Grid item style={{display:'table-cell'}}>
                        <Box p={2}>
                            <Typography variant='h5'>Study Parameters</Typography>
                            <StudyParameters  study={study} readOnly={props.readOnly} formik={formik} studyID={props.studyID}></StudyParameters>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container 
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center">
                <Box p={2}>
                    <StudyActions 
                    study={study} 
                    studyID={props.studyID}
                    formik={formik}
                    setShowInsertDl={props.setShowInsertDl}
                    setShowInsertDlToExtract={props.setShowInsertDlToExtract}
                    >
                    </StudyActions>
                </Box>
                </Grid>
            </form>
        </Grid>
        </>
    )
}

export default StudyProfileComp
