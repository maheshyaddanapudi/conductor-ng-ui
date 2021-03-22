import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { MetadataManagementService, SearchResultWorkflowSummary, TaskDef, WorkflowDef, WorkflowManagementService } from 'src/app/Rest/Conductor';
import { DashboardDataHolderService } from 'src/app/Services/Holders/dashboard-data-holder.service';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { UserInfoAndTokenDataHolderService } from 'src/app/Services/Holders/user-info-and-token-data-holder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workflow-dashboard',
  templateUrl: './workflow-dashboard.component.html',
  styleUrls: []
})
export class WorkflowDashboardComponent implements OnInit {

  public chartData: number[] = []
  public chartLabels: Label[] = ['Running', 'Paused', 'Completed', 'Failed', 'Terminated', 'Timed-Out'];

  public radarChartData: ChartDataSets[] = []
  public scatterChartData: ChartDataSets[] = []
  public polarAreaChartData: number[] = [];

  public error_message: string[] = []
  public loading: boolean

  public total_task_defs: number
  public total_workflow_defs: number

  public API_HITS_COUNTER_ANALYTICS_IFRAME_URL: string

  constructor(private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService, private medatadataManagementService: MetadataManagementService, private workflowManagementService: WorkflowManagementService, public dashboardDataHolderService: DashboardDataHolderService, private router: Router, private navigatorVarHolderService: NavigatorVarHolderService) { 
    this.total_task_defs = 0
    this.total_workflow_defs = 0
    if(environment.API_HITS_COUNTER_ANALYTICS_IFRAME_URL && environment.API_HITS_COUNTER_ANALYTICS_IFRAME_URL != 'undefined')
    {
      this.API_HITS_COUNTER_ANALYTICS_IFRAME_URL = environment.API_HITS_COUNTER_ANALYTICS_IFRAME_URL
    }
  }

  async ngOnInit() {

    if(!this.userInfoAndTokenDataHolderService.get_access_token() && environment.OAUTH_ENABLED && 'Y' == environment.OAUTH_ENABLED)
    { 
      this.router.navigateByUrl('login', { skipLocationChange: false },).then((fulfilled: boolean) => {
        console.log('Routing to Default')
        });
    }
    else{
      await this.refresh_dashboard_data();
    }
  }

  async refresh_dashboard_data() {

    this.loading = true

    await this.workflowManagementService.search(0,undefined, 'updateTime:DESC').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_total(search_results.totalHits)

    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"RUNNING"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_paused(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"PAUSED"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_running(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"COMPLETED"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_completed(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"FAILED"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_failed(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"TERMINATED"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_terminated(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"TIMED_OUT"').toPromise().then((search_results: SearchResultWorkflowSummary) => {
      this.dashboardDataHolderService.set_timedout(search_results.totalHits)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.medatadataManagementService.getTaskDefs().toPromise().then((taskdefs: TaskDef[]) => {
      this.total_task_defs = taskdefs.length
    }).catch((err_response: HttpErrorResponse) => {
      
      this.error_message.push(err_response.message)
      
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.medatadataManagementService.getAll().toPromise().then((workflowdefs: WorkflowDef[]) => {
      this.total_workflow_defs = workflowdefs.length
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message.push(err_response.message)
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    this.chartData = [this.dashboardDataHolderService.get_running(), this.dashboardDataHolderService.get_paused(), this.dashboardDataHolderService.get_completed(), this.dashboardDataHolderService.get_failed(), this.dashboardDataHolderService.get_terminated(), this.dashboardDataHolderService.get_timedout()]
    
    this.polarAreaChartData = [this.dashboardDataHolderService.get_running(), this.dashboardDataHolderService.get_paused(), this.dashboardDataHolderService.get_completed(), this.dashboardDataHolderService.get_failed(), this.dashboardDataHolderService.get_terminated(), this.dashboardDataHolderService.get_timedout()];
    
    console.log('Dashboard polarAreaChartData', this.polarAreaChartData)

    this.radarChartData = [
      { data: [0, 0, 0, 0, 0, 0], label: 'Referral Point' },
      { data: this.chartData, label: 'Current Trend' }
    ];

    this.scatterChartData = 
    [
      {
        data: [
          { x: 1, y: this.dashboardDataHolderService.get_running() },
          { x: 2, y: this.dashboardDataHolderService.get_paused() },
          { x: 3, y: this.dashboardDataHolderService.get_completed() },
          { x: 4, y: this.dashboardDataHolderService.get_failed() },
          { x: 5, y: this.dashboardDataHolderService.get_terminated() },
          { x: 6, y: this.dashboardDataHolderService.get_timedout() },
        ],
        label: 'Scatter Trend',
        pointRadius: 10,
      },
    ];

    this.loading = false
  }

  async workflow_executions_selection(workflow_status: string){
    this.navigatorVarHolderService.set_workflow_status(workflow_status)
    this.navigatorVarHolderService.set_workflow_details(undefined,undefined)
    
    await this.router.navigateByUrl('reports/workflow-executions', { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
