import React,{useState ,useEffect, useRef} from 'react'
import Grid from '@material-ui/core/Grid'
import { Paper, Typography, Box } from '@material-ui/core'
import DLItem from './dlItem'       
import DroppableZone from './droppableZone'
import { v4 as uuid } from 'uuid'
import {DragDropContext} from 'react-beautiful-dnd'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom'
import {StudyServices} from '../../services/StudyServices'
import {useLocation,useHistory} from 'react-router-dom'
import NumberZones from '../modals/zoneMap/numberZones'
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
        right: theme.spacing(10),
    },
    fab2: {
        position: 'absolute',
        top: theme.spacing(70),
        right: theme.spacing(10),
    },
    background:{
        backgroundColor:'#E0E0E0'
    }
}));

function ZoneMap() {
    // hooks
    let data = useLocation()
    let history = useHistory();
    let {study} = data.state
    const [nZones,setNZones] = useState(0)
    const [numberZoneSet, setNumberZoneSet] = useState(false)
    const [redirect,setRedirect] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const classes = useStyles();
    const initialRender = useRef(true);
    const [submitting, setSubmitting] = useState(false)
    const [dlZones,setDLZones] = useState([])
    // items for droppable zones
    const dlList = {
        [0]:{ 
            name:'Drop Zone',
            items: []
        }
    }
    const zoneList = {
        
    }
    const deleteList = {
        [uuid()]:{
        name:'To delete',
        items: []
        }
    }
    const zoneMapDroppables = {
        zoneList:zoneList,
        dlList: dlList,
        deleteList:deleteList
    }
    const [state, setState] = useState(zoneMapDroppables)
    // useeffect for getting dataloggers and zones
    useEffect(() => {
        async function myApiCall(){
            if (initialRender.current){
                if(typeof(study) =='number'){
                    try{
                        study = await StudyServices.getStudyById(study)
                        study = study['r'][0]
                        console.log('Busque el estudio')
                    }catch{
                        console.log('Error looking for study')
                    }

                }
                
                // Check if a datalogger was associated with a zone
                console.log('Verificando si algun datalogger esta')
                let r = await StudyServices.getZoneToDL(study)
                console.log('llamada nueva',r)
                // if one datalogger is associated with any zone set Editing to true
                let associated = false
                for(var i= 0; i < r.length; i++){
                    if(r[i]['zone_number'] !== null) {associated = true}
                }

                if(associated){
                    for(var i= 0; i < r.length; i++){
                    
                        console.log('Verificando si hay dataloggers asociados a alguna zona')
                        let numberOfZones = await StudyServices.getNumberOfZones(study)
                        console.log('Buscando numero de zonas')
                        console.log(numberOfZones[0]['number_of_zones'])
                        setNZones(numberOfZones[0]['number_of_zones'])
                        setDLZones(r)
                        setIsEditing(true)
                        setNumberZoneSet(true)
                        
                    }
                }
                
                initialRender.current = false;
            }
            else {
                
                setState(prev=>{
                    prev={...prev}
                    let zone = {}
                    var i
                    
                    for(i = 0; i < nZones ; i++){
                        let n = i + 1
                        zone[n] ={
                            name:'Zone ' + n,
                            items: []
                        }
                    } 
                    prev.zoneList = zone
                    return prev
                })
                if(typeof(study) =='number'){
                    try{
                        study = await StudyServices.getStudyById(study)
                        study = study['r'][0]
                    }catch{
                        console.log('Error looking for study')
                    }
                }
                console.log('Verifico si estas editando')
                console.log(isEditing)
                if(isEditing){
                    setState(prev=>{
                        prev={...prev}
                        // associate each datalogger to its respective zone
                        console.log('atando dataloggers a las zonas')
                        const zone =prev.zoneList
                        console.log('Zones',zone)
                        for(var i =1; i<=nZones; i++){
                            console.log(prev.zoneList[i])
                            for(var j =0; j < dlZones.length; j++){
                                // si la zona es igual al indice
                                if(dlZones[j]['zone_number'] == i){
                                    let datalogger = {id:dlZones[j]['dl_ID_number'].toString(),content:dlZones[j]['dl_ID_number']}
                                    console.log('Como se ve el datalogger',datalogger)
                                    prev.zoneList[i]['items'].push(datalogger)
                                }
                                
                            }
                        }
                        
                        return prev
                    })
                    
                }
                else{
                    console.log('Buscando Dataloggers')
                    let dataloggers = await StudyServices.getDataloggersInStudy(study)
                        // dlname
                    console.log(dataloggers)
                    setState(prev=>{
                        prev={...prev}
                        let dls = dataloggers.map((dl) =>{return {id:dl.dlName.toString(),content:dl.dlName}})
                        
                        //console.log(dls)
                        prev.dlList[0].items=dls
                        return prev
                    }) 
                }
                
            }
        }
        myApiCall();
        // set state to all the zones need
        
        return () => {
        }
    }, [numberZoneSet])
    // useEffect for submitting zones
    useEffect(() => {
        if(initialRender.current){
            initialRender.current = false;
        }
        else{
            if(submitting){
                async function myApiCalls(){
                    const zone = Object.entries(state.zoneList)
                    var i
                    const len = zone.length
                    for(i=0; i<len;i++){
                        const item = zone[i][1].items
                        // console.log(zone[i][0])
                        // console.log(item)
                        var j;
                        const l = item.length
                        for(j =0; j < l; j++){
                            let datalogger ={
                                dlName:item[j].id
                            }
                            let r = await StudyServices.attachDataloggerToZone(zone[i][0], study, datalogger)
                            console.log(r)
                            // StudyServices.attachDataloggerToZone(zone, study, datalogger).then((resp)=>{
                            //     console.log(resp)
                            // })
                        }
                }
            }myApiCalls();
                
            }
        }
        return () => {
            //cleanup
            setRedirect(true)
        }
    }, [submitting])


    // handle all the droppable situations
    const handleDragEnd=({destination, source})=>{
        
        // if grabbing from zoneList
        if(source.droppableId in state.zoneList){
            // if going nowhere
            if(!destination){
                return
            }
            // if dropped to the same droppable and same place
            if(destination.index ===source.index && destination.droppableId === source.droppableId){
                return
            }

            const itemCopy = {...state.zoneList[source.droppableId].items[source.index]} 
            // if moving to other zone or the same
            if(destination.droppableId in state.zoneList){
                // update state
                setState(prev=>{
                    prev={...prev}
                    // delete from list
                    prev.zoneList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.zoneList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
            // to delete
            if(destination.droppableId in state.deleteList){
                // update state
                setState(prev=>{
                    prev={...prev}
                    // delete from list
                    prev.zoneList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.deleteList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
            // if moving to dropZone
            if(destination.droppableId in state.dlList){
                setState(prev=>{
                    prev={...prev}
                    // delete from list
                    prev.zoneList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.dlList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
        }
        
        // if grabbing from datalogger initial drop zone
        if(source.droppableId in state.dlList){

            // if going nowhere
            if(!destination){
                return
            }
    
            // if dropped to the same droppable and same place
            if(destination.index ===source.index && destination.droppableId === source.droppableId){
                return
            }
            // copy grabbed item
            const itemCopy = {...state.dlList[source.droppableId].items[source.index]} 
            if(destination.droppableId === source.droppableId){
                // update state
                setState(prev=>{
                        prev={...prev}
                        
                        // delete from list
                        prev.dlList[source.droppableId].items.splice(source.index, 1)
                        // add to list
                        prev.dlList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                        return prev
                    })
            }
            // if going to zonelist
            if(destination.droppableId in state.zoneList){
                setState(prev=>{
                    prev={...prev}
                    
                    // delete from list
                    prev.dlList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.zoneList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
            // to delete
            if(destination.droppableId in state.deleteList){
                setState(prev=>{
                    prev={...prev}
                    
                    // delete from list
                    prev.dlList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.deleteList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
        }
         // From deleteList 
        if(source.droppableId in state.deleteList){
                // if going nowhere
            if(!destination){
                return
            }

            // if dropped to the same droppable and same place
            if(destination.index ===source.index && destination.droppableId === source.droppableId){
                return
            }

            const itemCopy = {...state.deleteList[source.droppableId].items[source.index]} 
            // same place
            if(destination.droppableId === source.droppableId){
                // update state
                setState(prev=>{
                        prev={...prev}
                        
                        // delete from list
                        prev.deleteList[source.droppableId].items.splice(source.index, 1)
                        // add to list
                        prev.deleteList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                        return prev
                    })
            }
            // going to zone list
            if(destination.droppableId in state.zoneList){
                setState(prev=>{
                    prev={...prev}
                    
                    // delete from list
                    prev.deleteList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.zoneList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }
            // if moving to dropZone
            if(destination.droppableId in state.dlList){
                setState(prev=>{
                    prev={...prev}
                    // delete from list
                    prev.deleteList[source.droppableId].items.splice(source.index, 1)
                    // add to list
                    prev.dlList[destination.droppableId].items.splice(destination.index,  0, itemCopy)
                    return prev
                })
            }

        }
    }

    const handleSubmit =()=>{
        // Check all the zones in the zoneList, if one of the zones has an empty itemList, then do not submit 
        const zone = Object.entries(state.zoneList)
        var i
        const len = zone.length
        var missingDL = false
        for(i=0; i<len;i++){
            const item = zone[i][1].items
            if(item.length === 0){
                missingDL = true
                break
            }
        }
        if(missingDL){
            alert("Need to have at least one datalogger per zone")
        }
        if(!missingDL){

            setSubmitting(true)
        }
    }

    if(redirect){
        history.goBack()
        return null
        // return(<Redirect to={{pathname:'/studyProfile/'+ study.id,
        // state:{study:study }}}></Redirect>)
    }
    if(numberZoneSet){
        return (
            <>
            <Fab onClick={handleSubmit} size='large' variant="extended" color="primary" className = {classes.fab} aria-label="done">
                    <DoneIcon className={classes.extendedIcon} />
                    Done
                </Fab>
                <Fab component={Link} to={{pathname:'/studyProfile/' + study.id,state:{study:study}}} size='large' variant="extended" color="primary" className = {classes.fab2} aria-label="back">
                    <ArrowBackIcon className={classes.extendedIcon} />
                    Go Back
                </Fab>
                <Grid container justify='center' direction='row'>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/* Left Grid of the page, has all the zones */}
                        {/* has overflow in auto to make it scrollable(the grid) without making the whole page scrollable */}
                        <Grid item xs={8} style={{maxHeight: 600, overflow: 'auto'}}>
                            <Paper style={{height:'100%', width:'100%'}}>
                                <Grid container spacing={3}>
                                    {/* Render all droppable zones */}
                                    {Object.entries(state.zoneList).map(([id,content])=>{
                                        return(
                                            <Grid item >
                                                    <div key={id}>
                                                        <Grid item>
                                                            <h2>{content.name}</h2>
                                                        </Grid>
                                                        <Grid item >
                                                            <DroppableZone id={id}>
                                                                {content.items.map((item, index)=>{
                                                                    return(
                                                                        <DLItem item={item} index={index} />
                                                                    )})}
                                                            </DroppableZone>
                                                        </Grid>
                                                    </div>
                                            </Grid>
                                        )
                                    })} 
                                </Grid>
                            </Paper>
                        </Grid>
                        {/* Right Grid, has all the initial dataloggers */}
                        <Grid item xs={3}>
                            <Grid container direction='column'>
                                <Paper style={{height:'100%', width:'100%'}}>
                                    <Grid item>
                                        {Object.entries(state.deleteList).map(([id,content])=>{
                                            return(
                                                <Grid item >
                                                    <div key={id} > 
                                                        <Grid item >
                                                            <Typography>{content.name}</Typography> <DeleteIcon />
                                                        </Grid> 
                                                        {/* Make the list scrollable */}
                                                        <Grid item style={{maxHeight: 100, overflow: 'auto'}}>
                                                            {/* Only one droppable zone in this case */}
                                                            <DroppableZone id={id}>
                                                                {content.items.map((item,index)=>{
                                                                    return(
                                                                        <DLItem item={item} index={index}></DLItem>
                                                                    )
                                                                })}
                                                            </DroppableZone>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <Grid container direction='column'>
                                    {/*Mapping all the datalogger ids to the droppable zone in initial render */}
                                    {Object.entries(state.dlList).map(([id,content])=>{
                                        return(
                                            <Grid item >
                                                <div key={id} > 
                                                    <Grid item >
                                                        <h2>{content.name}</h2>
                                                    </Grid> 
                                                    {/* Make the list scrollable */}
                                                    <Grid item style={{maxHeight: 500, overflow: 'auto'}}>
                                                        {/* Only one droppable zone in this case */}
                                                        <DroppableZone id={id}>
                                                            {content.items.map((item,index)=>{
                                                                return(
                                                                    <DLItem item={item} index={index}></DLItem>
                                                                )
                                                            })}
                                                        </DroppableZone>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        )
                                    })} 
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DragDropContext>
                </Grid>
            </>
        )
    }
    else if(!numberZoneSet){
        return(
        <NumberZones
        setNZones= {setNZones}
        setNumberZoneSet={setNumberZoneSet}
        />
        )
        
    }
    
}

export default ZoneMap

