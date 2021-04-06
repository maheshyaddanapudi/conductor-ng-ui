import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataManagementService, Task, Workflow, WorkflowDef, WorkflowManagementService } from 'src/app/Rest/Conductor';
import { WorkflowExecutionJsonMermaidConverterService } from 'src/app/Services/Converters/workflow-execution-json-mermaid-converter.service';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { ToastrService } from 'src/app/Services/LibraryOverrides/toastr.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workflow-execution-detail',
  templateUrl: './workflow-execution-detail.component.html',
  styleUrls: []
})
export class WorkflowExecutionDetailComponent implements OnInit {

  public workflow_name: string
  public workflow_version: number
  public workflow_id: string
  public workflow_def: WorkflowDef
  public error_message: string
  public workflow_execution: Workflow

  public workflow_execution_json: string
  public workflow_def_json: string

  public graph_def: string

  public graph_def_array: string[]

  public show_loading: boolean
  public terminate_reason: string

  constructor(private route: ActivatedRoute, private toastrService: ToastrService, private router: Router, private modalService: NgbModal, private navigatorVarHolderService: NavigatorVarHolderService, private metadataManagementService: MetadataManagementService, private workflowManagementService: WorkflowManagementService, private workflowExecutionJsonMermaidConverterService: WorkflowExecutionJsonMermaidConverterService) {
    
  }

  async ngOnInit() {
    this.show_loading = true

    await this.route.queryParams.subscribe(params => {
      console.log(params)
      this.workflow_name = params['workflow_name'];  
      this.workflow_id = params['workflow_id'];  
      this.workflow_version = Number.parseInt(params['workflow_version']);  
    });

    console.log('workflow_id', this.workflow_id)
    console.log('workflow_id', this.workflow_id)
    console.log('workflow_name', this.workflow_name)

    if(!this.workflow_id || ! this.workflow_name)
    {
      this.error_message = "No Workflow Details Recieved. Please select a workflow to view details"
    }
    else{
      await this.init();
    }

    this.show_loading = false
    
  }

  async initiate_with_delay(seconds: number)
  {
    let initiate_delay_timeout = setTimeout(()=>{
      this.init()
      clearTimeout(initiate_delay_timeout);
    },seconds*1000)
  }

  async init(){

    this.show_loading = true

    await this.get_workflow_detail();
    await this.get_workflow_execution_detail();

    this.graph_def_array = this.workflowExecutionJsonMermaidConverterService.convert(this.workflow_def, this.workflow_execution)

    if(this.graph_def_array)
    {
      localStorage.setItem('fillory-ui-buffer_graph_def_array', JSON.stringify(this.graph_def_array))
    }

    this.show_loading = false
  }

  openLarge(content) {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  async get_workflow_detail(){
    await this.metadataManagementService.get(this.workflow_name, this.workflow_version).toPromise().then((workflowDef: WorkflowDef) => {
      this.workflow_def = workflowDef
      this.workflow_def_json = JSON.stringify(this.workflow_def, undefined, 4)
      console.log(this.workflow_def_json)

    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  get_readable_date_time(timestamp: any){
    let a_date = new Date(timestamp)

    return a_date;
  }

  do_transformation_if_needed(key: string, value: any){
    if(key == 'createTime' || key == 'updateTime' || key == 'endTime' || key == 'startTime' || key == 'lastRetriedTime'){
      return this.get_readable_date_time(value)
    }
    else{
      return value
    }
  }

  async get_workflow_execution_detail(){
    await this.workflowManagementService.getExecutionStatus(this.workflow_id).toPromise().then((workflow: Workflow) => {
      this.workflow_execution = workflow
      this.workflow_execution_json = JSON.stringify(workflow, undefined, 4)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  async open_json_in_new_window(json_data_type: string){

    if(json_data_type == 'DEFINITION')
    {
      let url = this.router.createUrlTree(['/display/json'])
      window.open(url.toString()+'?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, '_blank')
    }
    if(json_data_type == 'EXECUTION')
    {
      let url = this.router.createUrlTree(['/display/json'])
      window.open(url.toString()+'?workflow_id='+this.workflow_id, '_blank')
    }
    
  }

  pause_workflow(){
    this.workflowManagementService.pauseWorkflow(this.workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(this.workflow_id, "Workflow Pause Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Pause Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  resume_workflow(){
    this.workflowManagementService.resumeWorkflow(this.workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(this.workflow_id, "Workflow Resume Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Resume Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  restart_workflow(){
    this.workflowManagementService.restart(this.workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(this.workflow_id, "Workflow Restart Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Restart Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  retry_workflow(){
    this.workflowManagementService.retry(this.workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(this.workflow_id, "Workflow Retry Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Retry Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  terminate_workflow(){
    this.workflowManagementService.terminate(this.workflow_id, this.terminate_reason).toPromise().then((response: any) => {
      this.toastrService.success(this.workflow_id, "Workflow Termination Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Termination Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  delete_workflow(archive: boolean){
    this.workflowManagementService._delete(this.workflow_id, archive).toPromise().then(async(response: any) => {
      if(!archive)
      {
        this.toastrService.success(this.workflow_id, "Workflow Deletion Success !")
        this.initiate_with_delay(1)
        await this.router.navigateByUrl('view-workflow-executions', { skipLocationChange: true },).then((fulfilled: boolean) => {
          console.log('Routed')
          });
      }
      else
      {
        this.toastrService.success(this.workflow_id, "Workflow Archival Success !")
        this.initiate_with_delay(1)
      }
    }).catch((err_response: HttpErrorResponse) => {
      if(!archive)
      {
        this.toastrService.error(err_response.error.message, "Workflow Deletion Failed !")
      }
      else
      {
        this.toastrService.error(err_response.error.message, "Workflow Archival Failed !")
      }
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  reset_terminate_reason(){
    this.terminate_reason = undefined
  }

  async open_diagram_in_new_window(){
    let url = this.router.createUrlTree(['/view/workflow-execution-diagram'])
    window.open(url.toString()+'?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version+'&workflow_id='+this.workflow_id, '_blank')
  }
}
