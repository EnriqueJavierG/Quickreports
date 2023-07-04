import React , {useEffect , useRef} from 'react'
import CanvasJSReact from '../../../canvasjs.react';
import { Grid } from '@material-ui/core'


var CanvasJSChart = CanvasJSReact.CanvasJSChart;


/**
 * @author Fabiola
 * props - zone (digit), data (array of temp readings)
 * data must be in the format {x: ts, y:temp}
 * datapoints = [
                {x: new Date(2021, 0, 6, 0, 0), y:69.0},
                ... ]
 */
const TempPerZone = (props) => {
    const canvas = useRef(null)
    const options = {
        animationEnabled:false,
        exportEnabled: true,
        theme: "light2", // // "light1", "dark1", "dark2"
        zoomEnabled: true,
        title: {
            text: "Zone " + props.zone + " Temperature (°F)"
        },
        axisY: {
            title: 'Temperature (°F)',
            suffix: "°"
        },
        axisX: {
            title: 'Timestamp',
            prefix: " ",
            interval: 1
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
        },
        data: [{				
                type: "line",
                xValueFormatString: "MM/DD/YYYY HH:mm K",
                toolTipContent: "Temp {y}°F {x}",
                showInLegend: true,
                name: "Temperature",
                dataPoints: props.data,
                markerSize: 5
                }
            ]
    }

    const saveImages = () => {
        let encoded_img = (canvas.current != null) ? canvas.current.chart.canvas.toDataURL() : 'loading'
        localStorage.setItem(`temp_chart_${props.zone}` , encoded_img)
    }

    useEffect(saveImages , [canvas , props.data, props.zone] )

    return (
        <Grid item xs={6} >
          <CanvasJSChart ref={canvas} options = {options}/>
        </Grid>
      );
}
 
export default TempPerZone;