import React from 'react'
import List from '@material-ui/core/List'
import {Collapse, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Redirect} from "react-router"
import {Auth} from 'aws-amplify'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function UserMenu(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const user = props.user
    const handleClick = () => {
        setOpen(!open);
    }
    const logout = () => {
        // console.log(props.auth)
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
            localStorage.clear();
            props.userHasAuthenticated(false)
            return
    }
    return (
        <>
            <List>
                <ListItem button onClick={handleClick} className={classes.nested}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={user}/>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button onClick={logout} className={classes.nested}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </>
    )
}

export default UserMenu
