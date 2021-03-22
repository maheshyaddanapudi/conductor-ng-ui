import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-conductor-execution-radar-chart',
  templateUrl: './conductor-execution-radar-chart.component.html',
  styleUrls: []
})
export class ConductorExecutionRadarChartComponent implements OnInit {

  // Radar
  public radarChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'Execution Radar',
      display: true
    },
    legend: {
      position: 'top',
    }
  };

  @Input()
  public radarChartLabels: Label[]

  @Input()
  public radarChartData: ChartDataSets[] 

  public radarChartType: ChartType = 'radar';

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
