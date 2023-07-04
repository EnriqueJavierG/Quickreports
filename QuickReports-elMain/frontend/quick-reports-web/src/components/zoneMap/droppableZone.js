import React from 'react'
import { Droppable } from 'react-beautiful-dnd'

const grid = 8;
const overflow = {overflow: 'auto'}
const getListStyle = (isDraggingOver, overflow) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    border: '5px solid ',
    borderRadius:'8px',
    width: 250,
    maxHeight: '50vh',
    overflow,
});

function DroppableZone(props) {
    return (
        <Droppable droppableId={props.id}>
            {(provided,snapshot) =>{
                return(
                    <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getListStyle(snapshot.isDraggingOver ,overflow)}
                    >
                    {props.children}
                    {provided.placeholder}
                </div>
                )
            }}
        </Droppable>
        
    )
}

export default DroppableZone
