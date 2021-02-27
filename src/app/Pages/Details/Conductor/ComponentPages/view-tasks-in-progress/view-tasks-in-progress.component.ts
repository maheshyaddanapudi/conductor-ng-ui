import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TaskManagementService, Workflow, WorkflowManagementService } from 'src/app/Rest/Conductor';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-view-tasks-in-progress',
  templateUrl: './view-tasks-in-progress.component.html',
  styleUrls: []
})
export class ViewTasksInProgressComponent implements OnInit {

  public tasks_list: Task[]
  public error_message: string
  public result: string

  constructor(private router: Router, private taskManagementService: TaskManagementService, private navigatorVarHolderService: NavigatorVarHolderService, private workflowManagementService: WorkflowManagementService) { }

  async ngOnInit() {

    this.navigatorVarHolderService.get_task_name()
    this.taskManagementService.getTasks(this.navigatorVarHolderService.get_task_name()).toPromise().then((tasks_list: Task[]) => {
      this.tasks_list = tasks_list

      this.result = 'Total of '+tasks_list.length+ ' In Progress Task(s) Found'
    }).catch((err_response: HttpErrorResponse) => {
        
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
    })
  }

  async back_to_task_detail(){
    await this.router.navigateByUrl('view-task-detail', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async show_workflow_execution_details(workflow_id: string){
   
   await this.workflowManagementService.getExecutionStatus(workflow_id).toPromise().then(async (workflow: Workflow) => {
    this.navigatorVarHolderService.set_workflow_details(workflow.workflowName, workflow.version)
    this.navigatorVarHolderService.set_workflow_id(workflow_id)
    await this.router.navigateByUrl('view-workflow-execution-detail', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
   }).catch((err_response: HttpErrorResponse) => {
        
    this.error_message = err_response.message
    console.log('Response Code - ', err_response.status)
    console.log('Response Status - ', err_response.statusText)
    console.log('Response Error - ', err_response.error)
})

   
  }
}
