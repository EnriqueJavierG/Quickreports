import React, {useState, useEffect, Component, useRef} from 'react'
import CanvasJSReact from '../../canvasjs.react';
import Paper from '@material-ui/core/Paper';


var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const TemperatureSummaryChart = (props) => {
    const canvas = useRef(null)
    const options = {
        animationEnabled:false,
        exportEnabled: true,
        theme: "light2", // // "light1", "dark1", "dark2"
        zoomEnabled: true,
        title: {
            text: "Maximum, Minimum & Average Temperatures (°F)"
        },
        axisY: {
            title: 'Temperature (°F)',
            suffix: "°"
        },
        axisX: {
            title: 'Zone Number',
            prefix: "Zone ",
            interval: 1
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            // itemclick: this.toggleDataSeries
        },
        data: [{				
                type: "scatter",
                markerType: "square",
                markerSize: 15,
                toolTipContent: "Zone {x}: Avg Temp {y}°",
                showInLegend: true,
                name: "Average Temperature",
                dataPoints: props.avg
                },
                {				
                type: "error",
                whiskerThickness: 5,
                toolTipContent: "Min Temp {y[0]}° Max Temp {y[1]}°",
                showInLegend: true,
                name: "Minimum and Maximum Temperature",
                dataPoints: props.range
                }
            ]
    }

    const saveImages = () => {
        setTimeout(()=>{
            console.log('took temp sc')
            let encoded_img = (canvas.current != null) ? canvas.current.chart.canvas.toDataURL() : 'open the charts page'
            localStorage.setItem(`temp_summary` , encoded_img)
        }, 1500)
        
    }

    useEffect((saveImages) , [canvas , props.zone] )
        
   return (
      <div>
        <Paper elevation={3}> 
        <CanvasJSChart ref={canvas} options = {options}/>
        </Paper>
      </div>
    );
}


export default TemperatureSummaryChart;