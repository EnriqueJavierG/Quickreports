import React, { useEffect, useRef } from 'react'
import CanvasJSReact from '../../../canvasjs.react';
import { Grid } from '@material-ui/core'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

/**
 * 
 * @param {zone - zone number,
 * data=[{x:ts, y:temp}]} props 
 * @returns 
 */
const RhPerZone = (props) => {
    const canvas = useRef(null)
    const options = {
        zone:props.zone,
        animationEnabled:false,
        exportEnabled: true,
        theme: "light2", // // "light1", "dark1", "dark2"
        zoomEnabled: true,
        title: {
            text: "Zone " + props.zone + " Relative Humidity (%)"
        },
        axisY: {
            title: 'Humidity %',
            suffix: "%"
        },
        axisX: {
            title: 'Timestamp',
            prefix: "",
        },
        toolTip: {
            shared: true
        },
        // legend: {
        //     cursor: "pointer",
        // },
        data: [{				
                type: "line",
                xValueFormatString: "MM/DD/YYYY HH:mm K",
                toolTipContent: "RH {y}% {x}",
                showInLegend: true,
                name: "Humidity %",
                dataPoints: props.data,
                markerSize: 5
                }
            ]
    }

    const saveImages = () => {
        let encoded_img = (canvas.current != null) ? canvas.current.chart.canvas.toDataURL() : 'loading'
        localStorage.setItem(`rh_chart_${props.zone}` , encoded_img)
    }

    useEffect(saveImages , [canvas , props.zone] )
    
    return (
        <>
        <Grid item xs={6} >
          <CanvasJSChart options = {options} ref={canvas}
          />
        </Grid>
        </>
    );

    
}

export default RhPerZone;