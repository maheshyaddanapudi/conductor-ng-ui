import { Component, Input, OnInit } from '@angular/core';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-conductor-execution-polar-chart',
  templateUrl: './conductor-execution-polar-chart.component.html',
  styleUrls: []
})
export class ConductorExecutionPolarChartComponent implements OnInit {

  @Input()
  public polarAreaChartLabels?: Label[]

  @Input()
  public chartData?: number[] = []

  public polarAreaChartData: SingleDataSet = []

  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

   // POLAR
   public polarChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'Execution Polar',
      display: true
    },
    legend: {
      position: 'top',
    }
  };

  public chartColors = [
    {
      backgroundColor: ['rgba(0,0,255,0.3)', 'rgba(255,174,66,0.3)', 'rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(63,191,191,0.3)'],
    },
  ];

  constructor() { }

  ngOnInit() {
     let polarAreaChartData: SingleDataSet = [this.chartData[0], this.chartData[1], this.chartData[2], this.chartData[3], this.chartData[4], this.chartData[5]];

    this.polarAreaChartData = polarAreaChartData

    console.log('Component polarAreaChartData', this.polarAreaChartData)
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
