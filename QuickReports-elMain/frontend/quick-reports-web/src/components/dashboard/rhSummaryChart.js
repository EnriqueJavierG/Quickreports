import React, {useState, useEffect, Component, useRef} from 'react'
import CanvasJSReact from '../../canvasjs.react';
import Paper from '@material-ui/core/Paper';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

/**
 * 
 * @param {
 * range = [{x:zone, y:[min,max]}, ...]
 * avg = [{x:zone, y:avg}, ...]
 * } props 
 * @returns 
 */
const RelHumiditySummaryChart = (props) => {
    const canvas = useRef(null)
    const options = {
        animationEnabled:false,
        exportEnabled: true,
        theme: "light2", // // "light1", "dark1", "dark2"
        zoomEnabled: true,
        title: {
            text: "Maximum, Minimum & Average Humidity %"
        },
        axisY: {
            title: 'Humidity %',
            suffix: "%"
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
            cursor: "pointer"
        },
        data: [{				
                type: "scatter",
                markerType: "square",
                markerSize: 15,
                toolTipContent: "Zone {x}: Avg RH {y}%",
                showInLegend: true,
                name: "Average Relative Humidity",
                dataPoints: props.avg
                },
                {				
                type: "error",
                whiskerThickness: 5,
                toolTipContent: "Min RH {y[0]}% Max RH {y[1]}%",
                showInLegend: true,
                name: "Minimum and Maximum Relative Humidity",
                dataPoints: props.range
                }
            ]
    }

    
    const saveImages = () => {
        setTimeout(()=>{
            console.log('took screenshot')
            let encoded_img = (canvas.current != null) ? canvas.current.chart.canvas.toDataURL() : 'open the charts page'
            localStorage.setItem(`rh_summary` , encoded_img)
        }, 1500)
        
    }

    useEffect(saveImages , [canvas , props.zone , props.data] )

    return (
        <div>
        <Paper elevation={3}> 
        <CanvasJSChart ref={canvas} options = {options}/>
        </Paper>
        </div>
      );
}


export default RelHumiditySummaryChart;