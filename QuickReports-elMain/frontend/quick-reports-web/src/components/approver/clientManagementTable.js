import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Modal, TextField } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles({
    root: {
      minWidth: 100,
      minHeight: 100,
      position: 'absolute', 
      left: '50%', 
      top: '50%',
      transform: 'translate(-50%, -50%)'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

function ClientManagementTable(props){

    const classes = useStyles();

    // closes the modal and calls the backend function to update the client account status
    const onClickAuthorizationDone = () => {
        props.setDone(true);
        handleClose();
    }

    // determine the button icon based on the account status
    const authorizedSymbolHandle = (status) => {
        if(status=='not authorized'){
            return(
                <PersonAddDisabledIcon 
                variant="contained"
                style={{ marginLeft: 16 }}
                />
            )
        }
        else if(status=='authorized'){
            return (
                <HowToRegIcon
                color = 'secondary' 
                variant="contained"
                style={{ marginLeft: 16 }}
                />
            )
        }
        else{ // pending authorization
            return (
                <PersonAddIcon 
                variant="contained"
                style={{ marginLeft: 16 }}
                />
            )
        }
    }


    const columns = [
        {
            field: 'id',
            hide:true
        },
        {
            field: 'company',
            width: 170,
            headerName: 'Company'
        },
        // {
        //     field: 'phone',
        //     width: 180,
        //     headerName: 'Phone'
        // },
        {
            field: 'email',
            width: 240,
            headerName: 'Email',
        },
        {
            field: 'accountStatus',
            width:170,
            headerName: 'Account Status'
        },
        {
            field: 'actions',
            width: 120,
            headerName: 'Actions',
            renderCell: (params) => (
                <Tooltip title="Click to Authorize Client" placement="right">
                <strong>
                    {authorizedSymbolHandle(params.row.accountStatus)}
                </strong>
                </Tooltip>
            )
        }
    ];

    const [accept, setAccept] = useState('not accepted');

    const handleAccept = (event, newApproval) => {
        if (newApproval !== null){
            setAccept(newApproval);
        }
    };

    const authorizeClient = (authorization) => {
        props.setAuthorizeClient(authorization);
    }
  
    const ModalContent = () => {
        return(
            <Modal open={show} onClose={handleClose}>
            <Grid container direction="column" justify="center">
                <Grid item>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Client Account Management
                            </Typography>
                            <Typography variant="h5" component="h2">
                            {modalInfo.company}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <ToggleButtonGroup value={accept} exclusive 
                            onChange={handleAccept} aria-label="text alignment">
                                <ToggleButton value="accepted" aria-label="accepted" size="small"
                                onClick={()=>authorizeClient(true)}>
                                    AUTHORIZE
                                </ToggleButton>
                                <ToggleButton value="not accepted" aria-label="not accepted"
                                onClick={()=>authorizeClient(false)}>
                                    DENY
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </CardActions>
                        <CardActions>
                            <Tooltip title="Review Done"> 
                                <IconButton aria-label="reviewDoc"
                                onClick={()=>onClickAuthorizationDone()}>
                                <CheckCircleIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                </Grid> 
            </Grid>       
            </Modal>
        )
    }


    const [modalInfo, setModalInfo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const rowEvents = (row) => {
        setModalInfo(row);
        setShowModal(handleShow);
        props.setCurrentClient(row.id);
    }

    const [filterQuery, setFilterQuery] = useState("");

    const handleSearchChangeQuery = (e) => {
        setFilterQuery(e.target.value);
    }

    return(
        <>
            <Grid item style={{textAlign:'left'}}>
            <SearchIcon />
            <TextField onChange={handleSearchChangeQuery} placeholder='Search' />
            <Paper style={{height:'auto', width:'870px'}}>
            <DataGrid title='Error Logs' rows={filterQuery ? props.data.filter(x=>
                x['company'].toString().toLowerCase().includes(filterQuery) ||
                x['requestedProject'].toString().toLowerCase().includes(filterQuery) ||
                x['email'].toString().toLowerCase().includes(filterQuery) 
            ):props.data } 
            columns={columns} 
            autoHeight={true}
            onRowClick={(rowData)=>rowEvents(rowData.row)}
            />
            </Paper>
            </Grid>

            {show ? <ModalContent /> : null}

        </>
    )
}

export default ClientManagementTable;