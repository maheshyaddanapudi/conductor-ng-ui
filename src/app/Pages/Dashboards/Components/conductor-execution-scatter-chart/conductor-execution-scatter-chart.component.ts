import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-conductor-execution-scatter-chart',
  templateUrl: './conductor-execution-scatter-chart.component.html',
  styleUrls: []
})
export class ConductorExecutionScatterChartComponent implements OnInit {

  // scatter
  public scatterChartOptions: ChartOptions = {
    responsive: true, 
    title: {
      display: true,
      text: 'Execution Scatter'
    },
    legend: {
      display: true,
      position: 'top'
    }
  };

  @Input()
  public scatterChartLabels: Label[]

  @Input()
  public scatterChartData: ChartDataSets[]
  public scatterChartType: ChartType = 'scatter';

  public chartColors = [
    {
      backgroundColor: ['rgba(0,0,255,0.3)', 'rgba(255,174,66,0.3)', 'rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(63,191,191,0.3)'],
    },
  ];

  constructor() { }

  ngOnInit() {

    
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
