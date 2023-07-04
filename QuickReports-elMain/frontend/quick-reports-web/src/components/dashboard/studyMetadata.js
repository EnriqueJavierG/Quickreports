import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core'
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  body: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  cardContainer:{
    paddingTop:'20px',
    paddingLeft: '50px',
    paddingRight: '50px'
},
  detailTitle: {
    fontSize: 16,
    textDecoration: 'underline'
  }
});


/**
 * 
 * @param {clientName,
 * requestDate
 * cleanroomName
 * loggedStart
 * loggedEnd
 * frequency
 * rhHighAlarm
 * rhLowAlarm
 * numberOfZones} props 
 * @returns 
 */
export default function StudyMetadata(props) {

  const manageDates = (dateStr) => {
    let newDate = new Date(dateStr);
    return newDate.toLocaleString();
  }

  console.log(props)

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <Grid container className={classes.cardContainer} xs={3} spacing={3}> 
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Study Information 
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Date Format in 24 hours
        </Typography>
        <Typography variant="h5" component="h2">
          {props.clientName}{bull}{props.requestDate}{bull}{props.cleanroomName}
        </Typography>
        <Divider variant="middle" />
        <Typography className={classes.body} variant="body2" component="p">
          Logged Start: 
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
          {props.loggedStart}
        </Typography>
        <Divider  />
        <Typography className={classes.body} variant="body2" component="p">
          Logged End: 
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
          {props.loggedEnd}
        </Typography>
        <Divider  />
        <Typography className={classes.body} variant="body2" component="p">
          Logged Recordings:
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
          <> Every {props.frequency} minutes</>
        </Typography>
        <Divider  />
        <Typography className={classes.body} variant="body2" component="p">
          Temperature Specifications: 
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
          {props.tempLowAlarm}°F-{props.tempHighAlarm}°F
        </Typography>
        <Divider  />
        <Typography className={classes.body} variant="body2" component="p">
          Humidity Specifications: 
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
            {props.rhLowAlarm}%-{props.rhHighAlarm}%
        </Typography>
        <Divider  />
        <Typography className={classes.body} variant="body2" component="p">
          Number of Zones: 
        </Typography>
        <Typography className={classes.detailTitle} variant="body2" component="p">
            {props.numberOfZones}   
        </Typography>
      </CardContent>
    </Card>
    </Grid>
  );
}
