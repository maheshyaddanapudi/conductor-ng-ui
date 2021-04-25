import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataResourceService, TaskDef, WorkflowTask } from 'src/app/Rest/Conductor';
import { JSONFlattenerService } from 'src/app/Services/Helpers/jsonflattener.service';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-initiate-new-workflow-definition',
  templateUrl: './initiate-new-workflow-definition.component.html',
  styleUrls: []
})
export class InitiateNewWorkflowDefinitionComponent implements OnInit {

  public task_defs_list: TaskDef[]
  public workers_list:string[]

  public system_tasks_list: string[]

  public error_message: string

  public workflow_tasks: WorkflowTask[]

  public task_type_selected: string
  public worker_selected: string
  public task_selected: string
  public task_def_selected: any
  public task_description_selected: string
  public task_ref_name_selected: string
  public edit_task_description_selected: boolean
  public task_selected_optional: boolean

  public task_defs_buffer: TaskDef[]

  public show_loading: boolean

  constructor(private jsonFlattenerService: JSONFlattenerService, private navigatorVarHolderService: NavigatorVarHolderService, private router: Router, private datePipe: DatePipe, private metadataManagementService: MetadataResourceService, private modalService: NgbModal) {
    this.workflow_tasks = []
    this.workers_list = []
    this.task_defs_list = []
    this.system_tasks_list = ["HTTP", "Sub Workflow", "Wait", "Terminate", "Lambda", "Kafka Publish"]
    this.task_type_selected = 'Select'
    this.worker_selected = 'Select'
    this.task_defs_buffer = []
    this.task_selected_optional = true
   }

  async ngOnInit() {

    this.show_loading = true

    await this.metadataManagementService.getTaskDefs().toPromise().then((taskDefs: TaskDef[])=>{
      this.task_defs_list = taskDefs
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    if(this.task_defs_list && this.task_defs_list.length>0)
    {
      this.prepare_workers_list()
    }

    this.show_loading = false

  }

  async prepare_workers_list(){
    await this.task_defs_list.forEach(async (taskDef: TaskDef)=>{
      let match_found: boolean = false

      if(taskDef.ownerApp)
      {
        await this.workers_list.forEach((worker_name: string)=>{
          if(worker_name == taskDef.ownerApp)
          {
            match_found = true
          }
        })

        if(!match_found)
        {
          this.workers_list.push(taskDef.ownerApp)
        }
      }
      
    })
  }

  reset_for_new_selection(){
    this.task_type_selected = 'Select'
    this.worker_selected = 'Select'
    this.task_selected = 'Select'
    this.task_def_selected = undefined
    this.toggle_edit_task_description_selected(false)
    this.task_selected_optional = true
  }

  select_task_type(task_type: string){

    this.toggle_edit_task_description_selected(false)

    if(task_type != this.task_type_selected)
    {
      this.task_type_selected = task_type;
      this.worker_selected = 'Select' 
      this.task_selected = 'Select' 
      this.task_def_selected = undefined
    }
    
  }

  select_worker(worker_name: string){
    this.toggle_edit_task_description_selected(false)
    if(this.worker_selected != worker_name)
    {
      this.worker_selected = worker_name
      this.task_selected = 'Select'
      this.task_def_selected = undefined
      this.task_defs_buffer = []
      this.task_defs_list.forEach((a_task_def: TaskDef) => {
        if(this.worker_selected == a_task_def.ownerApp)
        {
          this.task_defs_buffer.push(a_task_def)
        }
      })
    }
  }

  select_task(task_def_selected: TaskDef){
    this.toggle_edit_task_description_selected(false)
    if(this.task_selected != task_def_selected.name)
    {
      this.task_selected = task_def_selected.name
      this.task_def_selected = task_def_selected

      let date = new Date();

      this.task_description_selected = "TASK_"+this.datePipe.transform(date, "yyyyMMddHHmmssSSS")
      this.task_ref_name_selected = this.task_description_selected
      this.edit_task_description_selected = false
    }
  }

  select_system_task(task_selected: string){
    console.log(task_selected)
    this.toggle_edit_task_description_selected(false)
    if(this.task_selected != task_selected)
    {
      this.task_selected = task_selected

      switch(task_selected)
      {
        case "HTTP":
          this.task_def_selected = {
            name: 'HTTP Task',
            description: 'An HTTP task is used to make calls to another microservice over HTTP',
            inputKeys: ['http_request.uri', 'http_request.method', 'http_request.accept', 'http_request.contentType', 'http_request.headers', 'http_request.body', 'http_request.vipAddress', 'http_request.asyncComplete', 'http_request.oauthConsumerKey', 'http_request.oauthConsumerSecret', 'http_request.connectionTimeOut', 'http_request.readTimeOut'],
            outputKeys: ['response', 'headers', 'statusCode', 'reasonPhrase']
          }
          break;
        case "Sub Workflow":
          this.task_def_selected = {
            name: 'Sub Workflow',
            description: 'Sub Workflow task allows for nesting a workflow within another workflow.',
            inputKeys: ['name', 'version'],
            outputKeys: ['subWorkflowId']
          }
          break;
        case "Wait":
          this.task_def_selected = {
            name: 'Wait',
            description: 'A wait task is implemented as a gate that remains in IN_PROGRESS state unless marked as COMPLETED or FAILED by an external trigger'
          }
          break;
        case "Terminate":
          this.task_def_selected = {
            name: 'Terminate',
            description: "Task that can terminate a workflow with a given status and modify the workflow's output with a given parameter. It can act as a 'return' statement for conditions where you simply want to terminate your workflow.",
            inputKeys: ['terminationStatus', 'workflowOutput'],
            outputKeys: ['output']
          }
          break;
        case "Lambda":
          this.task_def_selected = {
            name: 'Lambda',
            description: "Lambda Task helps execute ad-hoc logic at Workflow run-time, using javax & Nashorn Javascript evaluator engine.",
            inputKeys: ['scriptExpression'],
            outputKeys: ['result']
          }
          break;
        case "Kafka Publish":
          this.task_def_selected = {
            name: 'Kafka Publish',
            description: "A kafka Publish task is used to push messages to another microservice via kafka.",
            inputKeys: ['asyncComplete','bootStrapServers', 'key', 'keySerializer', 'value', 'requestTimeoutMs', 'maxBlockMs', 'headers', 'topic']
          }
          break;
      }

      let date = new Date();

      this.task_description_selected = "TASK_"+this.datePipe.transform(date, "yyyyMMddHHmmssSSS")
      this.task_ref_name_selected = this.task_description_selected
      this.edit_task_description_selected = false
    }
  }

  toggle_edit_task_description_selected(edit_task_description_selected: boolean){
    this.edit_task_description_selected = edit_task_description_selected;
  }

  openLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    });
  }

  async confirm_selected_task(){

    if(this.task_type_selected == 'System Task')
    {
      switch(this.task_selected){
        case 'HTTP':
          let httpTaskInputParams = {
            'http_request': {
              'uri': undefined,
              'method': undefined,
              'accept': undefined,
              'contentType': undefined,
              'headers': undefined,
              'body': undefined,
              'vipAddress': undefined,
              'asyncComplete': false,
              'oauthConsumerKey': undefined,
              'oauthConsumerSecret': undefined,
              'connectionTimeOut': 100,
              'readTimeOut': 150
            }
          }

          let aHttpWorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'HTTP',
            inputParameters: this.jsonFlattenerService.flatten(httpTaskInputParams),
            optional: this.task_selected_optional,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aHttpWorkflowTask);
          this.reset_for_new_selection();
        break;
        case 'Sub Workflow':
          let aSubWorkflowWorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'SUB_WORKFLOW',
            subWorkflowParam: {
              name: undefined,
              version: 0,
            },
            inputParameters: {
              name: undefined,
              version: 0,
            },
            optional: this.task_selected_optional,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aSubWorkflowWorkflowTask);
          this.reset_for_new_selection();
        break;
        case 'Wait':
          let aWaitorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'WAIT',
            optional: this.task_selected_optional,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aWaitorkflowTask);
          this.reset_for_new_selection();
        break;
        case 'Terminate':
          let aTerminateWorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'TERMINATE',
            inputParameters: {
              terminationStatus: undefined,
              workflowOutput: undefined,
            },
            optional: false,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aTerminateWorkflowTask);
          this.reset_for_new_selection();
        break;
        case 'Lambda':
          let aLambdaWorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'LAMBDA',
            inputParameters: {
              scriptExpression: undefined
            },
            optional: this.task_selected_optional,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aLambdaWorkflowTask);
          this.reset_for_new_selection();
        break;
        case 'Kafka Publish':
          let aKafkaPublishWorkflowTask: WorkflowTask = {
            name: this.task_def_selected.name,
            taskReferenceName: this.task_ref_name_selected,
            description: this.task_description_selected,
            type: 'KAFKA_PUBLISH',
            inputParameters: {
              kafka_request: {
                bootStrapServers: undefined,
                key: undefined,
                keySerializer: undefined,
                value: undefined,
                requestTimeoutMs: 100,
                maxBlockMs: 500,
                headers: undefined,
                topic: undefined
              },
              asyncComplete: false
            },
            optional: this.task_selected_optional,
            taskDefinition: this.task_def_selected
          }
      
          await this.workflow_tasks.push(aKafkaPublishWorkflowTask);
          this.reset_for_new_selection();
        break;
      }
    }
else
    {
      let inputParametersBuffer: any = {

      }
  
      await this.task_def_selected.inputKeys.forEach((a_key: string) => {
        inputParametersBuffer[a_key] = undefined
      })
  
      let aWorkflowTask: WorkflowTask = {
        name: this.task_def_selected.name,
        taskReferenceName: this.task_ref_name_selected,
        description: this.task_description_selected,
        type: 'SIMPLE',
        inputParameters: inputParametersBuffer,
        optional: this.task_selected_optional,
        taskDefinition: this.task_def_selected
      }
  
      await this.workflow_tasks.push(aWorkflowTask);
      this.reset_for_new_selection();
    }
    
  }

  async delete_task_from_selection(index:number){
    await this.workflow_tasks.splice(index, 1);
  }

  async proceed_to_next_stage(){

    this.navigatorVarHolderService.set_workflow_tasks(this.workflow_tasks);
    

    this.router.navigateByUrl('create/define-new-workflow', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
