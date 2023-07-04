import React, { useEffect, useState , } from 'react'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Link , {Redirect} from  "react-router-dom/Link";
import UserMenu from './login/userMenu'
import axios from 'axios'
// import CIQA from '../images/CIQA.PNG'
import { Tooltip } from '@material-ui/core'
// style and margins
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
        background: 'linear-gradient(to right,#222227,#6EC1E4)'
    },
    buttons:{
        backgroundColor:'transparent',
        color:'white'
    }
    }));

const Header = (props) => {
    
    const classes = useStyles();
    const [isServerUp , setServerStatus] = useState(false)
    const [latestConn , setLatestConn] = useState(null)
    const [CIQA , setLogo] = useState(null)

    const checkServer = async() => {
        axios.get('http://localhost:4001/status').then(() => {
              setServerStatus(true)
        }).catch(()=>setServerStatus(false))
    }

    

    useEffect(()=>{
        const fetchLogo = async () => {
            let res = await fetch('images/image3.png')
            res = await res.blob()
            res =  URL.createObjectURL(res)
            setLogo(res)
        }
        fetchLogo()
    } , [])

    useEffect(checkServer)
    const role = props.role
    const user = props.user
    // jsx
    if(role === 4){ // Approver
        return (
            <div className={classes.root}>
                <AppBar style={{background:'linear-gradient(to right,#222227,#6EC1E4)'}} position="static">
                    <ToolBar className={classes.navBar}>
                        <IconButton>
                            <img src={CIQA} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'30%' , width:'30%' , marginTop:'5%'}}/>
                        </IconButton>
                        <div className={classes.headerOptions}>
                            <Button component={Link} to='/home' variant='contained'>Home</Button>
                            <Button component={Link} to='/accounts' variant='contained'>Account Management</Button>
                            <Button component={Link} to='/help' variant='contained'>Help</Button>
                        </div>
                        <Tooltip title={`server is ${isServerUp ?'up':'down'}`}>
                    <IconButton>
                        <span style = {{
                            height: "25px",
                            width: "25px",
                            backgroundColor: isServerUp?"green":"red",
                            borderRadius: "50%",
                            display: "inline-block",
                            zIndex:1000
                        }}class="dot">{latestConn}</span>
                        {latestConn}
                    </IconButton>
                    </Tooltip>
                        <UserMenu user={user} userHasAuthenticated = {props.userHasAuthenticated}/>
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
    if(role === 3){ // Client 
        return (
            <div className={classes.root}>
                <AppBar style={{background:'linear-gradient(to right,#222227,#6EC1E4)'}} position="static">
                    <ToolBar>
                        <IconButton>
                            <img src={CIQA} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'30%' , width:'30%' , marginTop:'5%'}}/>
                        </IconButton>
                        <div className={classes.headerOptions}>
                            <Button className={classes.buttons} component={Link}  to='/home'>Home</Button>
                            <Button className={classes.buttons} component={Link} to='/help' >Help</Button>
                        </div>
                        <Tooltip title={`server is ${isServerUp ?'up':'down'}`}>
                    <IconButton>
                        <span style = {{
                            height: "25px",
                            width: "25px",
                            backgroundColor: isServerUp?"green":"red",
                            borderRadius: "50%",
                            display: "inline-block",
                            zIndex:1000
                        }}class="dot">{latestConn}</span>
                        {latestConn}
                    </IconButton>
                    </Tooltip>
                        <UserMenu user={user} userHasAuthenticated = {props.userHasAuthenticated}/>
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
    if(role === 1){ // Validator
        return (
            <div className={classes.root}>
                <AppBar style={{background:'linear-gradient(to right,#222227,#6EC1E4)'}} position="static">
                    <ToolBar>
                        <IconButton>
                            <img src={CIQA} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'30%' , width:'30%' , marginTop:'5%'}}/>
                        </IconButton>
                        <div className={classes.headerOptions}>
                            <Button className={classes.buttons} component={Link}  to='/home' >Home</Button>
                            <Button className={classes.buttons} component={Link}  to='/dataloggerProfiles'>Dataloggers Profiles</Button>
                            <Button className={classes.buttons} component={Link} to='/help' >Help</Button>
                        </div>
                        <Tooltip title={`server is ${isServerUp ?'up':'down'}`}>
                    <Button component={Link} to="/downloads">
                        <span style = {{
                            height: "25px",
                            width: "25px",
                            backgroundColor: isServerUp?"green":"red",
                            borderRadius: "50%",
                            display: "inline-block",
                            zIndex:1000
                        }}class="dot">{latestConn}</span>
                        {latestConn}
                    </Button>
                    </Tooltip>
                        <UserMenu user={user}  userHasAuthenticated = {props.userHasAuthenticated} />
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
    if(role === 2){ // Calibrator 
        return (
            <div className={classes.root}>
                <AppBar style={{background:'linear-gradient(to right,#222227,#6EC1E4)'}} position="static">
                    <ToolBar>
                        <IconButton>
                        <img src={CIQA} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'30%' , width:'30%' , marginTop:'5%'}}/>
                        </IconButton>
                        <div className={classes.headerOptions}>
                            <Button className={classes.buttons} component={Link}  to='/home' >Home</Button>
                            <Button className={classes.buttons} component={Link}  to='/dataloggerProfiles'>Dataloggers Profiles</Button>
                            <Button className={classes.buttons} component={Link} to='/help' >Help</Button>
                        </div>
                        <Tooltip title={`server is ${isServerUp ?'up':'down'}`}>
                    <IconButton>
                        <span style = {{
                            height: "25px",
                            width: "25px",
                            backgroundColor: isServerUp?"green":"red",
                            borderRadius: "50%",
                            display: "inline-block",
                            zIndex:1000
                        }}class="dot">{latestConn}</span>
                        {latestConn}
                    </IconButton>
                    </Tooltip>
                        <UserMenu user={user} userHasAuthenticated = {props.userHasAuthenticated} />
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
    
    return ( // what is this
        <div className={classes.root}>
            <AppBar style={{background:'linear-gradient(to right,#222227,#6EC1E4)'}} position="static">
                <ToolBar>
                    <IconButton>
                        <img src={CIQA} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'30%' , width:'30%' , marginTop:'5%'}}/>
                    </IconButton>
                    <div className={classes.headerOptions}>
                        <Button className={classes.buttons} component={Link}  to='/home' >Home</Button>
                        <Button className={classes.buttons} component={Link}  to='/dataloggerProfiles'>Dataloggers Profiles</Button>
                        <Button className={classes.buttons} component={Link} to='/help' >Help</Button>
                    </div>
                    <Tooltip title={`server is ${isServerUp ?'up':'down'}`}>
                    <IconButton>
                        <span style = {{
                            height: "25px",
                            width: "25px",
                            backgroundColor: isServerUp?"green":"red",
                            borderRadius: "50%",
                            display: "inline-block",
                            zIndex:1000
                        }}class="dot">{latestConn}</span>
                        {latestConn}
                    </IconButton>
                    </Tooltip>
                </ToolBar>
            </AppBar>
        </div>
    )
}

export default Header
