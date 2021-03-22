import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-log-aggregation-dashboard',
  templateUrl: './log-aggregation-dashboard.component.html',
  styleUrls: []
})
export class LogAggregationDashboardComponent implements OnInit {

  public LOG_AGGREGATOR_ANALYTICS_IFRAME_URL: string

  constructor() { 
    if(environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL && environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL != 'undefined')
    {
      this.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL = environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL
    }
  }

  ngOnInit() {
  }

}
