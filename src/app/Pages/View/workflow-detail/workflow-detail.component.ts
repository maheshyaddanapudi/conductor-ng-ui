import { Component, OnInit } from '@angular/core';
import { MetadataManagementService, WorkflowDef, WorkflowManagementService, StartWorkflowRequest } from 'src/app/Rest/Conductor';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowJsonMermaidConverterService } from 'src/app/Services/Converters/workflow-json-mermaid-converter.service';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: []
})
export class WorkflowDetailComponent implements OnInit {

  private workflow_name: string
  private workflow_version: number

  private startWorkflowRequest: StartWorkflowRequest

  private input_parameter: { [key: string]: any; };

  public error_message: string
  public result: string

  public workflow_run_id: string

  public workflow_def: WorkflowDef

  public workflow_def_json: string

  public graph_def: string

  public graph_def_array: string[]

  private opened_model_content: NgbModalRef

  public config = { useBothWheelAxes: true }

  private tasks_defs_buffer: any = {

  }

  constructor(private route: ActivatedRoute, private router: Router, private navigatorVarHolderService: NavigatorVarHolderService, private workflowJsonMermaidConverterService: WorkflowJsonMermaidConverterService, private metadataManagementService: MetadataManagementService, private workflowManagementService: WorkflowManagementService, private modalService: NgbModal) {
    this.input_parameter = {

    }

    localStorage.removeItem('fillory-ui-buffer_graph_def_array')
   }

   openLarge(content) {
    this.opened_model_content = this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    });
  }

  async ngOnInit() {

    await this.route.queryParams.subscribe(params => {
      console.log(params)
      this.workflow_name = params['workflow_name'];  
      this.workflow_version = Number.parseInt(params['workflow_version']);  
    });

    await this.get_workflow_detail();

    this.graph_def_array = this.workflowJsonMermaidConverterService.convert(this.workflow_def)

    if(this.graph_def_array)
    {
      localStorage.setItem('fillory-ui-buffer_graph_def_array', JSON.stringify(this.graph_def_array))
    }

  }

  async get_workflow_detail(){
    await this.metadataManagementService.get(this.workflow_name, this.workflow_version).toPromise().then((workflowDef: WorkflowDef) => {
      this.workflow_def = workflowDef
      
      console.log(JSON.stringify(this.workflow_def))

    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    this.workflow_def_json = JSON.stringify(this.workflow_def, undefined, 4)

    console.log('Master Workflow Def Json', this.workflow_def_json)
  }

  async updateInputValues(index: number, value: string)
  {
    this.input_parameter[this.workflow_def.inputParameters[index]] = value;
    console.log('I/O Composed', JSON.stringify(this.input_parameter));
  }

  async reset()
  {
    (<HTMLInputElement>document.getElementById("anInput")).value = ''
    this.input_parameter= {}
    console.log('I/O Composed', JSON.stringify(this.input_parameter));
    this.workflow_run_id = undefined
    this.error_message = undefined
  }

  async start_workflow(){

    this.startWorkflowRequest = {
      name: this.workflow_name,
      version: this.workflow_version,
      input: this.input_parameter
    }
    
    await this.workflowManagementService.startWorkflow(this.startWorkflowRequest).toPromise().then((response: string) => {
      this.workflow_run_id = response
    }).catch((err_response: HttpErrorResponse) => {

      if(err_response.status == 200)
      {
        this.workflow_run_id = err_response.error.text
      }
      else{
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      }
    })
  }

  async open_diagram_in_new_window(){
    let url = this.router.createUrlTree(['/view/workflow-diagram'], { skipLocationChange: false})
    window.open(url.toString()+'?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, '_blank')
  }

  async open_json_in_new_window(){

    let url = this.router.createUrlTree(['/display/json'], { skipLocationChange: false})
    window.open(url.toString()+'?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, '_blank')
  }

  async show_current_executions(){
    
    await this.router.navigateByUrl('view/individual-workflow-running-executions?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async show_all_executions(){
    
    await this.router.navigateByUrl('view/individual-workflow-executions?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  get_readable_date_time(timestamp: any){
    let a_date = new Date(timestamp)

    return a_date;
  }

  do_transformation_if_needed(key: string, value: any){
    if(key == 'createTime' || key == 'updateTime'){
      return this.get_readable_date_time(value)
    }
    else{
      return value
    }
  }

  async delete(){
    this.metadataManagementService.unregisterWorkflowDef(this.workflow_def.name, this.workflow_def.version).toPromise().then((response: any) => {
      
      let countdown_timer = 5;
      const time_interval_timer = setInterval(()=>{
        this.result = 'Workflow Deleted Successfully ... Please wait ... Redirecting in '+countdown_timer;
        countdown_timer = countdown_timer - 1
      }, 1000)

      const time_out_timer = setTimeout(async ()=> {

        clearInterval(time_interval_timer)

        await this.router.navigateByUrl('view-workflows', { skipLocationChange: true },).then(async (fulfilled: boolean) => {
          await this.opened_model_content.close();
          clearTimeout(time_out_timer)
          });
      }, 6000)
    }).catch((error: any) => {
      console.log(error.message || error);
  
      this.error_message = error.message || error;

      const timeout_timer = setTimeout(()=> {
        this.error_message = undefined
        clearTimeout(timeout_timer)
      }, 5000)
    })
  }
}
