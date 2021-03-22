import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-conductor-execution-pie-chart',
  templateUrl: './conductor-execution-pie-chart.component.html',
  styleUrls: ['./conductor-execution-pie-chart.component.scss']
})
export class ConductorExecutionPieChartComponent implements OnInit {

  @Input()
  pieChartLabels: Label[]

  @Input()
  pieChartData: number[]

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'Execution Pie',
      display: true
    },
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  
  //public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  //public pieChartData: number[] = [300, 500, 100];
  
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,0,255,0.3)', 'rgba(255,174,66,0.3)', 'rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(63,191,191,0.3)'],
    },
  ];

  constructor() {
    
   }

   ngOnInit() {
    console.log('Labels ', this.pieChartLabels)
    console.log('Data', this.pieChartData)
  }

}
