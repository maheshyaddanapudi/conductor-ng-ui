import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MetadataResourceService, WorkflowDef, WorkflowTask } from 'src/app/Rest/Conductor';
import { JSONFlattenerService } from 'src/app/Services/Helpers/jsonflattener.service';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-confirm-new-workflow-definition',
  templateUrl: './confirm-new-workflow-definition.component.html',
  styleUrls: []
})
export class ConfirmNewWorkflowDefinitionComponent implements OnInit {

  public show_loading: boolean

  public name: string
  public version: number = 1
  public schemaVersion: number = 2
  public ownerEmail: string
  public description: string
  public workflowNamesList: Set<string> = new Set()
  public workflowNamesAndVersionList: Set<string> = new Set()
  public workflow_tasks: WorkflowTask[] =[]
  public error_message: string
  public success_message: string
  public timeout_policy: string = 'TIME_OUT_WF'
  public workflow_status_listener_enabled: boolean = false
  public failure_workflow: string = 'NONE'
  public restartable: boolean = true
  public timeoutSeconds: number = 60
  public inputParameters: string[] = []

  constructor(private jsonFlattenerService: JSONFlattenerService, private metadataManagementService: MetadataResourceService, private navigatorVarHolderService: NavigatorVarHolderService) { }

  async ngOnInit() {
    this.show_loading = true;

    this.get_all_workflow_names();
    this.workflow_tasks = this.navigatorVarHolderService.get_workflow_tasks()
    this.inputParameters = this.navigatorVarHolderService.get_workflow_input_params();
    this.prepare_workflow_tasks();
    this.show_loading = false;
  }

  async get_all_workflow_names(){
    await this.metadataManagementService.getAll().toPromise().then(async (workflows_list: WorkflowDef[])=>{
      await workflows_list.forEach((a_workflow: WorkflowDef) => {
        this.workflowNamesList.add(a_workflow.name)
        this.workflowNamesAndVersionList.add(a_workflow.name+'.'+a_workflow.version)
      })
    })
  }

  async workflow_name_validity_check(){
    if(this.workflowNamesAndVersionList.has(this.name+'.'+this.version)){
      this.error_message = 'Duplicate Workflow Definition Found. Choose a different name or version !!!'
    }
    else
    {
      this.error_message = undefined
    }
  }

  async prepare_workflow_tasks(){
    await this.workflow_tasks.forEach((a_workflow_task: WorkflowTask) => {
      if(a_workflow_task.inputParameters)
      {
        let inputParameters = this.jsonFlattenerService.unflatten(a_workflow_task.inputParameters)
        console.log('Unflattened JSON Input Parameters', JSON.stringify(inputParameters))
        a_workflow_task.inputParameters = inputParameters
      }

      switch(a_workflow_task.type){
        case 'HTTP':
          a_workflow_task.taskDefinition = undefined
        break;
        case 'SUB_WORKFLOW':
          a_workflow_task.taskDefinition = undefined
          if(a_workflow_task.inputParameters['version'])
          {
            a_workflow_task.subWorkflowParam = {
              name: a_workflow_task.inputParameters['name'],
              version: a_workflow_task.inputParameters['version']
            }
            a_workflow_task.inputParameters = undefined
          }
          else{
            a_workflow_task.subWorkflowParam = {
              name: a_workflow_task.inputParameters['name'],
              version: 1
            }
            a_workflow_task.inputParameters = undefined
          }
        break;
        case 'TERMINATE':
          a_workflow_task.taskDefinition = undefined
        break;
        case 'KAFKA_PUBLISH':
          a_workflow_task.taskDefinition = undefined
        break;
        case 'LAMBDA':
          a_workflow_task.taskDefinition = undefined
        break;
      }
    })
  }

  async workflow_creation(){
    
    if(this.failure_workflow == 'NONE')
    {
      this.failure_workflow = undefined
    }

    if(this.timeout_policy == 'TIME_OUT_WF'){
      let workflow_creation_request: WorkflowDef = {
        tasks: this.workflow_tasks,
        timeoutSeconds: this.timeoutSeconds,
        name: this.name,
        version: this.version,
        restartable: this.restartable,
        failureWorkflow: this.failure_workflow,
        ownerApp: this.ownerEmail,
        ownerEmail: this.ownerEmail,
        schemaVersion: this.schemaVersion,
        timeoutPolicy: WorkflowDef.TimeoutPolicyEnum.TIMEOUTWF,
        workflowStatusListenerEnabled: this.workflow_status_listener_enabled,
        description: this.description,
        inputParameters: this.inputParameters
        }

        console.log(JSON.stringify(workflow_creation_request))

        await this.metadataManagementService.create(workflow_creation_request).toPromise().then((workflowId : string)=>{
          this.success_message = 'Workflow created successfully - '+workflowId
        }).catch((error: HttpErrorResponse) => {

          if(error.status.valueOf() == 204 )
          { 
            this.success_message = 'Workflow created successfully - '+error.message
          }
          else{
            console.log(error.message || error);
      
            this.error_message = error.message;
          }
          
        })
      }
      else{
        let workflow_creation_request: WorkflowDef = {
          tasks: this.workflow_tasks,
          timeoutSeconds: this.timeoutSeconds,
          name: this.name,
          version: this.version,
          restartable: this.restartable,
          failureWorkflow: this.failure_workflow,
          ownerApp: this.ownerEmail,
          ownerEmail: this.ownerEmail,
          schemaVersion: this.schemaVersion,
          timeoutPolicy: WorkflowDef.TimeoutPolicyEnum.ALERTONLY,
          workflowStatusListenerEnabled: this.workflow_status_listener_enabled,
          description: this.description,
          inputParameters: this.inputParameters
        }

        console.log(JSON.stringify(workflow_creation_request))

        await this.metadataManagementService.create(workflow_creation_request).toPromise().then((workflowId : string)=>{
          this.success_message = 'Workflow created successfully - '+workflowId
        }).catch((error: HttpErrorResponse) => {

          if(error.status.valueOf() == 204 )
          { 
            this.success_message = 'Workflow created successfully - '+error.message
          }
          else{
            console.log(error.message || error);
      
            this.error_message = error.message;
          }
          
        })
    }
  }

  set_timeout_policy(value: string){
    this.timeout_policy = value
  }

  set_workflow_listener_enabled(value: boolean){
    this.workflow_status_listener_enabled = value
  }

  set_restartable(value: boolean){
    this.restartable = value
  }



}
