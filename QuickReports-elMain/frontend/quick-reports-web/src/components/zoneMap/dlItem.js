import React from 'react'
import {Draggable} from 'react-beautiful-dnd'

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    border: '5px solid ',
    borderRadius:'8px',
    height: 20,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#5CB0D3',
    // styles we need to apply on draggables
    ...draggableStyle,
});

function DLItem(props) {
    return (
        <Draggable draggableId={props.item.id} key={props.item.id} index={props.index}>
            {(provided, snapshot) =>{
                return(
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    // recordar editar el estilo fuera de aqui pq si no no funciona
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                        )}
                    >
                        {props.item.content}
                    </div>
                )
            }}
        </Draggable>
    )
}


export default DLItem
