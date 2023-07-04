import React, {useState, useEffect, Component} from 'react'
import CanvasJSReact from '../../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let min = [
    {x: 1, y:  54.0},   
    {x: 2, y: 56.0},
    {x: 3, y: 54.0},
    {x: 4, y: 53.0},
    {x: 5, y: 54.5},
    {x: 6, y: 53.5},
    {x: 7, y: 53.0},
    {x: 8, y: 54.5},
    {x: 9, y: 54.0},
    {x: 10, y: 53.0}    
];

let max = [
    {x: 1, y: 58.5},
    {x: 2, y: 59.5},
    {x: 3, y: 58.5},
    {x: 4, y: 56.5},
    {x: 5, y: 57.5},
    {x: 6, y: 57.0},
    {x: 7, y: 56.5},
    {x: 8, y: 59.5},
    {x: 9, y: 59.0},
    {x: 10, y: 56.0}    
];


let avg = [
  
    {x: 1, y: 55.5},
    {x: 2, y: 57.1},
    {x: 3, y: 55.0},
    {x: 4, y: 55.0},
    {x: 5, y: 55.9},
    {x: 6, y: 54.9},
    {x: 7, y: 55.1},
    {x: 8, y: 56.0},
    {x: 9, y: 55.3},
    {x: 10, y: 54.2}    
];

let highAlarm = [
    {x: 1, y: 80},
    {x: 10, y: 80},
]

let lowAlarm = [
    {x: 1, y: 60},
    {x: 10, y: 60},
]

class RelHumiditySummaryChart extends Component {
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
                text: "Max, Min & Avg Humidity %"
            },
            subtitles: [{
              text: "Click Legend to Hide or Unhide Chart Lines"
            }],
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
                    type: "line",
                    toolTipContent: "Max RH Zone {x}: {y}%",
                    showInLegend: true,
                    name: "Maximum",
                    dataPoints: max
                    }, 
                    {
                    type: "line",
                    toolTipContent: "Avg RH Zone {x}: {y}%",
                    showInLegend: true,
                    name: "Average Reka",
                    dataPoints: avg
                    },
                    {
                    type: "line",
                    toolTipContent: "Min RH Zone {x}: {y}%",
                    showInLegend: true,
                    name: "Minimum",
                    dataPoints: min
                    },
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

export default RelHumiditySummaryChart;