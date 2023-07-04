import React from 'react'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    headerOptions:{
        display: 'flex',
        flex:1,
        justifyContent:'space-evenly'
    },
    navBar:{
        background: 'linear-gradient(to right,#222227,#5CB0D3)'
    }
    }));

function Links() {
    const classes = useStyles();

    if(localStorage.getItem('role') === 'reporter'){
        return (
            <div className={classes.headerOptions}>
                <Button component={Link}  to='/home' variant='contained'>Home</Button>
                <Button component={Link} to='/dataloggerProfiles' variant='contained'>Dataloggers Profiles</Button>
                <Button component={Link} to='/help' variant='contained'>Help</Button>
            </div>
        )
    }   
    if(localStorage.getItem('role') === 'approver'){
        return (
            <div className={classes.headerOptions}>
                <Button component={Link} to='/approverhome' variant='contained'>Home</Button>
                <Button component={Link} to='/accounts' variant='contained'>Dataloggers Profiles</Button>
                <Button component={Link} to='/help' variant='contained'>Help</Button>
            </div>
        )
    }   
    if(localStorage.getItem('role') === 'client'){
        return (
            <div className={classes.headerOptions}>
                
            </div>
        )
    }   
}

export default Links