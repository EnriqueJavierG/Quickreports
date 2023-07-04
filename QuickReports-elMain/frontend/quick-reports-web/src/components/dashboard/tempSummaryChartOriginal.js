import React, {useState, useEffect, Component} from 'react'
import CanvasJSReact from '../../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let min = [
    {x: 1, y:  68.0},   
    {x: 2, y: 68.0},
    {x: 3, y: 69.0},
    {x: 4, y: 68.0},
    {x: 5, y: 68.0},
    {x: 6, y: 68.0},
    {x: 7, y: 68.0},
    {x: 8, y: 68.0},
    {x: 9, y: 68.0},
    {x: 10, y: 69.0}    
];

let max = [
    {x: 1, y: 70.0},
    {x: 2, y: 70.0},
    {x: 3, y: 70.0},
    {x: 4, y: 71.0},
    {x: 5, y: 70.0},
    {x: 6, y: 71.0},
    {x: 7, y: 71.0},
    {x: 8, y: 70.0},
    {x: 9, y: 70.0},
    {x: 10, y: 71.0}    
];


let avg = [
    {x: 1, y: 69.1},
    {x: 2, y: 69.4},
    {x: 3, y: 69.6},
    {x: 4, y: 69.4},
    {x: 5, y: 68.6},
    {x: 6, y: 69.5},
    {x: 7, y: 69.2},
    {x: 8, y: 68.9},
    {x: 9, y: 69.4},
    {x: 10, y: 69.7}    
];

let highAlarm = 80;

let lowAlarm = 60;

class TemperatureSummaryChart extends Component {
    constructor() {
        super();
        this.toggleDataSeries = this.toggleDataSeries.bind(this);
    }
  
    toggleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        }
        else{
          e.dataSeries.visible = true;
        }
        this.chart.render();
    }

    render() {
        const options = {
            animationEnabled:true,
            exportEnabled: true,
            theme: "light2", // // "light1", "dark1", "dark2"
            zoomEnabled: true,
            title: {
                text: "Max, Min & Avg Temperatures (°F)"
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Chart Lines"
            }],
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
                itemclick: this.toggleDataSeries
            },
            data: [{				
                    type: "line",
                    toolTipContent: "Max Temp Zone {x}: {y}°",
                    showInLegend: true,
                    name: "Maximum",
                    dataPoints: max
                    }, 
                    {
                    type: "line",
                    toolTipContent: "Avg Temp Zone {x}: {y}°",
                    showInLegend: true,
                    name: "Average",
                    dataPoints: avg
                    },
                    {
                    type: "line",
                    toolTipContent: "Min Temp Zone {x}: {y}°",
                    showInLegend: true,
                    name: "Minimum",
                    dataPoints: min
                    }
                ]
        }
            
       return (
          <div>
            <CanvasJSChart options = {options}
                onRef = {ref => this.chart = ref}
            />
          </div>
        );
      }
};

export default TemperatureSummaryChart;