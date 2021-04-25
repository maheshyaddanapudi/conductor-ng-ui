import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataResourceService, Task, TaskResourceService, WorkflowTask } from 'src/app/Rest/Conductor';
import { JSONFlattenerService } from 'src/app/Services/Helpers/jsonflattener.service';

@Component({
  selector: 'app-display-tasks-list',
  templateUrl: './display-tasks-list.component.html',
  styleUrls: []
})
export class DisplayTasksListComponent implements OnInit {

  @Input()
  tasks_list: WorkflowTask[]

  @Input()
  tasks_execution_list?: Task[]

  @Input()
  workflow_status?: string

  @Input()
  workflow_name: string

  @Input()
  workflow_version: number

  public loading: boolean = true

  private task_status_buffer_list: any = {

  }

  public taskDefJsonTemp: string

  public error_message: string

  public branch_task_list: WorkflowTask[][]
  public branch_tasks_execution_list?: Task[][]

  public branch_details: any = {

  }

  private tasks_defs_buffer: any = {

  }

  constructor(private jsonFlattenerService: JSONFlattenerService, private modalService: NgbModal, private router: Router, private metadataManagementService: MetadataResourceService, private taskManagementService: TaskResourceService) { }

  async ngOnInit() {
    await this.update_task_defs()
    if(this.tasks_execution_list && this.tasks_execution_list.length >0)
    {
      await this.update_output_data()
    }
    this.loading = false
  }

  flatten(obj: any): any{
    return this.jsonFlattenerService.flatten(obj)
  }

  async update_output_data(){
    let task_counter: number = 1;
    await this.tasks_execution_list.forEach(async (an_exec_task: Task) => {
      console.log('Parsing Task# '+task_counter, an_exec_task.referenceTaskName, an_exec_task.taskId)
      console.log('RetryCount, Seq, Status, Expected Retry Count',an_exec_task.retryCount, an_exec_task.seq, an_exec_task.status, an_exec_task.workflowTask.retryCount)
      if(
        (an_exec_task.status == 'FAILED_WITH_TERMINAL_ERROR' || an_exec_task.status == 'COMPLETED' || an_exec_task.status == 'COMPLETED_WITH_ERRORS')
        ||
        (an_exec_task.status == 'FAILED' && an_exec_task.retryCount == (an_exec_task.workflowTask.retryCount - 1))
      ){
        if(!an_exec_task.outputData){
          console.log('OP Not Found Task# '+task_counter, an_exec_task.referenceTaskName, an_exec_task.taskId)
          await this.taskManagementService.getTask(an_exec_task.taskId).toPromise().then((full_exec_task_details: Task) => {
            console.log('OP Set Task# '+task_counter, an_exec_task.referenceTaskName, an_exec_task.taskId)
            an_exec_task.outputData = full_exec_task_details.outputData
          })

          await this.tasks_list.forEach((a_task: WorkflowTask) => {
            if(an_exec_task.referenceTaskName == a_task.taskReferenceName){
              a_task.task = an_exec_task
            }
          })

        }
        else{
          console.log('OP Exists Task# '+task_counter, an_exec_task.referenceTaskName, an_exec_task.taskId)
          await this.tasks_list.forEach((a_task: WorkflowTask) => {
            if(an_exec_task.referenceTaskName == a_task.taskReferenceName){
              a_task.task = an_exec_task
            }
          })
        }
      }
      else{
        console.log('Skipping Task# '+task_counter, an_exec_task.referenceTaskName, an_exec_task.taskId)
      }

      

      task_counter = task_counter + 1
    })
  }


  get_keys_length(parameters: any):number{
    return Object.keys(parameters).length
  }

  setTaskDefJsonTemp(a_task?: WorkflowTask){
    if(a_task)
    {
      this.taskDefJsonTemp = JSON.stringify(a_task)
    }
    else
    {
      this.taskDefJsonTemp = undefined
    }
  }

  openLarge(content) {
    this.modalService.open(content,  { 
      windowClass : 'modal-x-large',
      backdrop : 'static',
      keyboard : false,
      }
    );
  }

  get_input_data_from_execution(a_task: WorkflowTask): any{

    if(a_task.task && a_task.task.inputData)
    {
      return this.flatten(a_task.task.inputData)
    }

    return null
  }

  get_status_from_execution(a_task: WorkflowTask){


    let status: string = 'SKIPPED / TBD' 

    if(this.task_status_buffer_list[a_task.taskReferenceName]){
      status = this.task_status_buffer_list[a_task.taskReferenceName];
    }
    else{

      this.tasks_execution_list.forEach((exec_task: Task)=>{
        if(exec_task.referenceTaskName == a_task.taskReferenceName)
        {
          status = exec_task.status;
          console.log(a_task.taskReferenceName+' Status Found', status)
        }
      })
    }

    if(this.workflow_status == 'COMPLETED' || this.workflow_status == 'FAILED' || this.workflow_status == 'TERMINATED' || this.workflow_status == 'TIMED_OUT')
    {
      if(status == 'SKIPPED / TBD' || status == 'SCHEDULED')
      {
        status = 'SKIPPED'
      }
    }

    this.task_status_buffer_list[a_task.taskReferenceName] = status

    return status
  }

    get_output_keys_length_from_execution(a_task: WorkflowTask): number {
      
        this.tasks_execution_list.forEach(async (an_exec_task: Task)=>{
        
        if(an_exec_task.referenceTaskName == a_task.taskReferenceName && 
          (
            (an_exec_task.status == 'FAILED_WITH_TERMINAL_ERROR' || an_exec_task.status == 'COMPLETED' || an_exec_task.status == 'COMPLETED_WITH_ERRORS')
            ||
            (an_exec_task.status == 'FAILED' && an_exec_task.retryCount == (an_exec_task.workflowTask.retryCount - 1))
          )
        )
        {
          return Object.keys(an_exec_task.outputData).length
        }
      })

      if(a_task.taskDefinition && a_task.taskDefinition.outputKeys)
      {
        return a_task.taskDefinition.outputKeys.length
      }

      return 0
    }


    enable_output_button(a_task: WorkflowTask): boolean{
      
      if(a_task.task && a_task.task.outputData)
      {
        console.log("Enabling Output Button as OP Keys from Execution length is > 0")
        return true
      }
      else if((a_task.taskDefinition && a_task.taskDefinition.outputKeys && a_task.taskDefinition.outputKeys.length > 0))
      {
        console.log("Enabling Output Button as OP Keys From Definition length is > 0")
        return true
      }
      else{
        console.log('Cannot Enable Output Button')
        return false
      }
    }


     get_output_data_from_execution(a_task: WorkflowTask): any{
      
         this.tasks_execution_list.forEach(async (an_exec_task: Task)=>{
        
        if(an_exec_task.referenceTaskName == a_task.taskReferenceName && 
          (
            (an_exec_task.status == 'FAILED_WITH_TERMINAL_ERROR' || an_exec_task.status == 'COMPLETED' || an_exec_task.status == 'COMPLETED_WITH_ERRORS')
            ||
            (an_exec_task.status == 'FAILED' && an_exec_task.retryCount == (an_exec_task.workflowTask.retryCount - 1))
          )
        )
        {
          return an_exec_task.outputData
        }
      })
      
      return null
  }

   async get_decision_cases_tasks_list(decision_task: WorkflowTask){

    let tasks_branches_list: WorkflowTask[][] = []

    let keys = await Object.keys(decision_task.decisionCases)

    await keys.forEach(async (key) => {
      await tasks_branches_list.push(decision_task.decisionCases[key])
    })

    console.log('Returning Sub Tasks', JSON.stringify(tasks_branches_list))
    this.branch_task_list = tasks_branches_list

  }

  async get_fork_tasks_list(fork_task: WorkflowTask){
    
    this.branch_task_list = fork_task.forkTasks

    console.log('Returning Sub Tasks', JSON.stringify(this.branch_task_list))

  }

  async get_do_while_tasks_list(do_while_task: WorkflowTask){
    
    this.branch_task_list.push(do_while_task.loopOver)

    console.log('Returning Sub Tasks', JSON.stringify(this.branch_task_list))

  }

  async get_sub_tasks_list(a_task: WorkflowTask)
  {
    switch(a_task.type){
      case 'DECISION':
        await this.get_decision_cases_tasks_list(a_task)
      break;
      case 'FORK_JOIN':
        await this.get_fork_tasks_list(a_task)
      break;
      case 'DO_WHILE':
        await this.get_do_while_tasks_list(a_task)
      break;
    }
  }

  get_output_data_from_task_execution_list(a_task: WorkflowTask){
    this.tasks_execution_list.forEach( (an_execution_task: Task)=>{
      if(an_execution_task.referenceTaskName == a_task.taskReferenceName)
      {
        return an_execution_task.outputData
      }
    })
    return null
  }

  async update_task_defs(){
    let task_counter = 0;

    await this.tasks_list.forEach((a_task: WorkflowTask) => {
      
      if(a_task.type == 'SIMPLE')
      {
        if(this.tasks_defs_buffer[a_task.name])
        {
          console.log('Getting from cache : Task '+task_counter,a_task.name)
          this.tasks_list[task_counter].taskDefinition = this.tasks_defs_buffer[a_task.name]
        }
        else
        {
          console.log('Getting from server : Task '+task_counter,a_task.name)
          this.get_task_def_in_line(task_counter, a_task.name)
        }
        
      }

      console.log('Finished Getting Task Defn',this.tasks_defs_buffer[a_task.name])
      task_counter = task_counter + 1
    })
  }

  async get_task_def_in_line(task_counter: number, task_name: string){

    await this.metadataManagementService.getTaskDef(task_name).toPromise().then((a_task_def: any)=>{

      this.tasks_list[task_counter].taskDefinition= a_task_def
      this.tasks_defs_buffer[task_name] = a_task_def
      
    }).catch((err_response: HttpErrorResponse) => {
      if(err_response.status == 404)
      {
        console.log('No Task Definition found', task_name)
      }
    })
  }

  async open_tasks_in_new_window(parent_task_ref_name: string){

    localStorage.setItem('fillory_ui_buffer_branch_workflow_name', this.workflow_name)
    localStorage.setItem('fillory_ui_buffer_branch_workflow_version', JSON.stringify(this.workflow_version))
    localStorage.setItem('fillory_ui_buffer_branch_task_list', JSON.stringify(this.branch_task_list))
    localStorage.setItem('fillory_ui_buffer_parent_task_ref_name', parent_task_ref_name)

    let url = this.router.createUrlTree(['display/workflow/task-branches'])
    window.open(url.toString(), '_blank')
  }

  async route_to_home(){
    await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }
}
