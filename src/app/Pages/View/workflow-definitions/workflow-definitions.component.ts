import { Component, OnInit } from '@angular/core';
import { MetadataResourceService, StartWorkflowRequest, WorkflowDef, WorkflowResourceService } from 'src/app/Rest/Conductor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { JSONFlattenerService } from 'src/app/Services/Helpers/jsonflattener.service';

@Component({
  selector: 'app-workflow-definitions',
  templateUrl: './workflow-definitions.component.html',
  styleUrls: []
})
export class WorkflowDefinitionsComponent implements OnInit {

  public workflowDefs: WorkflowDef[];

  public paginated_workflow_defs: WorkflowDef[][]

  public error_message: string;

  public workflowDefJsonTemp: string;

  public object: Object = new Object()

  public page_size: number = 10

  public current_page_selected: number = 1

  public number_of_pages: number = 0

  public search_string: string = ''

  public result: string

  public workflow_run_id: string

  public delete_succesful: boolean = false

  private input_parameter: any

  private startWorkflowRequest: StartWorkflowRequest

  constructor(private jsonFlattenerService: JSONFlattenerService, private workflowManagementService: WorkflowResourceService, private router: Router, private navigatorVarHolderService: NavigatorVarHolderService, private metadataManagementService: MetadataResourceService, private modalService: NgbModal) { 

    this.workflowDefs = [];
    this.paginated_workflow_defs = [];
    this.reset_input_parameter()
  }

  async ngOnInit() {

    await this.initiate()

  }

  async reset_input_parameter(){
    this.input_parameter = {

    }
    console.log('I/O Composed', JSON.stringify(this.input_parameter));
  }

  async reset_input_parameter_with_div(){
   (<HTMLInputElement>document.getElementById("a_workflow_input")).value = ''
      this.reset_input_parameter()
      this.workflow_run_id = undefined
      this.error_message = undefined
  }

  async start_workflow(workflow_name: string, workflow_version: number){

    this.startWorkflowRequest = {
      name: workflow_name,
      version: workflow_version,
      input: this.jsonFlattenerService.unflatten(this.input_parameter)
    }

    console.log(this.startWorkflowRequest)
    
    await this.workflowManagementService.startWorkflow1(this.startWorkflowRequest).toPromise().then((response: string) => {
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

  async updateInputValues(workflow_def: WorkflowDef, index: number, value: string)
  {
    this.input_parameter[workflow_def.inputParameters[index]] = value;
    console.log('I/O Composed', JSON.stringify(this.input_parameter));
  }

  async initiate(){

    this.error_message = undefined
    this.workflowDefJsonTemp = '';
    this.workflowDefs = undefined
    this.reset_input_parameter()

    await this.metadataManagementService.getAll().toPromise().then((response: WorkflowDef[]) => {

      this.workflowDefs = response;

      console.log('Total WorkflowDefs - ', response.length)

    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.prepare_workflows_list_for_paginated_display(this.workflowDefs)
  }

  is_active_page(page_number: number): boolean{
    if(this.current_page_selected == (page_number+1))
    {
      return true
    }
    else
    {
      return false
    }
  }

  async set_current_page_selected(page_number: number)
  {
    this.current_page_selected = page_number
  }

  async update_page_size(page_size: number){
    this.page_size = page_size

    await this.prepare_workflows_list_for_paginated_display(this.workflowDefs)

    this.set_current_page_selected(1)
  }

  async prepare_workflows_list_for_paginated_display(workflowDefs: WorkflowDef[]){
    
    this.paginated_workflow_defs = []

    if(this.page_size>0){
      this.number_of_pages = Math.ceil(workflowDefs.length / this.page_size)
      console.log('Number of Pages '+workflowDefs.length+' / '+this.page_size, this.number_of_pages)

      let page_counter = 0

      while(page_counter < this.number_of_pages)
      {
        this.paginated_workflow_defs.push(workflowDefs.slice(page_counter * this.page_size, (page_counter + 1) * this.page_size))
        page_counter = page_counter + 1
      }
    }
    else{
      this.number_of_pages = 0
      this.paginated_workflow_defs.push(workflowDefs)
    }
  }

  async setworkflowDefJsonTemp(tempJson: any){
    if(undefined == tempJson || '' == tempJson)
    {
      this.workflowDefJsonTemp = '';
    }
    else{
      this.workflowDefJsonTemp = JSON.stringify(tempJson);
    }
  }

  openSmall(content) {
    this.modalService.open(content, {
      size: 'sm'
    });
  }

  openLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    });
  }

  async viewWorkflowDetails(workflowName: string, workflowVersion: string)
  {
    this.navigatorVarHolderService.set_workflow_details(workflowName, Number.parseInt(workflowVersion))
    
    await this.router.navigateByUrl('view/workflow-detail?workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async show_current_executions(workflowName: string, workflowVersion: string){
    
    await this.router.navigateByUrl('view/individual-workflow-running-executions?workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async show_all_executions(workflowName: string, workflowVersion: string){
    
    await this.router.navigateByUrl('view/individual-workflow-executions?workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  reset_delete_succesful(){
    this.delete_succesful = false
    this.result = undefined
  }

   async delete(workflow_name: string, workflow_version: number){

    let delete_succesful: boolean = false

    await this.metadataManagementService.unregisterWorkflowDef(workflow_name, workflow_version).toPromise().then(async (response: any) => {
      delete_succesful = true
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    if(delete_succesful)
    { 
      this.result = 'Workflow Deleted Successfully !';

      await this.initiate()
    }

    this.delete_succesful = delete_succesful
  }
}
