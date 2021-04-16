import { Component, OnInit } from '@angular/core';
import { WorkflowManagementService, SearchResultWorkflowSummary, MetadataManagementService, WorkflowDef, WorkflowSummary, WorkflowBulkManagementService, BulkResponse, Workflow } from 'src/app/Rest/Conductor';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/Services/LibraryOverrides/toastr.service';
import { JSONFlattenerService } from 'src/app/Services/Helpers/jsonflattener.service';

@Component({
  selector: 'app-workflow-executions',
  templateUrl: './workflow-executions.component.html',
  styleUrls: []
})
export class WorkflowExecutionsComponent implements OnInit {

  public search_results: SearchResultWorkflowSummary

  public page_size: number = 10

  public current_page_selected = 1

  public workflow_status: string

  public error_message: string

  public total_pages: number

  public numbers: number[] = []

  public auto_refresh: boolean = false

  public terminate_reason: string

  public auto_refresh_interval: any
  public auto_refresh_message: string
  public auto_refresh_message_interval: any

  public workflow_ids: string[]

  public all_selected: boolean = false
  public selected_workflow_execution_indexes: number[]  
  public action_response: BulkResponse

  public terminate_index: number = -1

  public workflow_execution_details_buffer: Map<string, Workflow> = new Map();
  public show_loading: boolean = false

  constructor(public jsonFlattenerService: JSONFlattenerService, private workflowBulkManagementService: WorkflowBulkManagementService, private toastrService: ToastrService, private metadataManagementService: MetadataManagementService, private router: Router, private workflowManagementService: WorkflowManagementService, private modalService: NgbModal, private navigatorVarHolderService: NavigatorVarHolderService) { 
    this.auto_refresh_message = 'Initializing Auto-Refresh ...'
    this.workflow_ids = []
    this.selected_workflow_execution_indexes = []
   }

  async ngOnInit() {

    this.workflow_status = this.navigatorVarHolderService.get_workflow_status()
    console.log(this.workflow_status)
    await this.initiate()
    this.set_auto_refresh_internal(false)
  }

  async initiate(){
    await this.get_workflow_executions()
    await this.get_workflow_ids()
  }


  async get_workflow_ids(){
    this.workflow_ids = []
    await this.search_results.results.forEach((a_search_result: WorkflowSummary)=>{
      this.workflow_ids.push(a_search_result.workflowId)
    })
  }

  async ngOnDestroy(){
    this.set_auto_refresh_internal(false)
  }

  async refresh(){

    let auto_refresh: boolean = this.auto_refresh

    if(this.auto_refresh)
    {
      this.set_auto_refresh_internal(false)
    }

    let temp_auto_refresh_message = this.auto_refresh_message 
    
    this.auto_refresh_message = 'Performing Adhoc Refresh ...'
    this.search_results = undefined
    this.all_selected = false 
    await this.get_workflow_executions()
    this.auto_refresh_message = 'Completed Adhoc Refresh ...'
    
    const local_time_out = setTimeout(()=>{
      this.auto_refresh_message = temp_auto_refresh_message
      if(auto_refresh)
      {
        this.set_auto_refresh_internal(true)
      }
      clearTimeout(local_time_out)
    },2000)
    
  }

  async set_auto_refresh_internal(status: boolean)
  {
    console.log('Auto-Refresh Switch Internal', status)
    this.auto_refresh = status

    if(this.auto_refresh){
      this.auto_refresh_message = 'Initializing Auto-Refresh ...'

      let time_counter = 30

      this.auto_refresh_message_interval = setInterval(()=>{

        this.auto_refresh_message = 'Refreshing in '+time_counter+' Second(s) ...'
        time_counter = time_counter - 1

      },1000)

      this.auto_refresh_interval = setInterval(async ()=>{

        console.log('Refreshing workflow executions...')
        time_counter = 30
        this.search_results = undefined
        this.all_selected = false
        await this.get_workflow_executions()

      }, 30000)
    }
    else{

      this.auto_refresh_message = 'Shutting down Auto-Refresh ...'

      if(this.auto_refresh_message_interval)
      {
        await clearInterval(this.auto_refresh_message_interval)
        console.log('Cleared Refresh Message Interval')
      }

      if(this.auto_refresh_interval)
      {
        await clearInterval(this.auto_refresh_interval)
        console.log('Cleared Refresh Interval')
      }

      this.auto_refresh_message = undefined

    }
  }

  async set_auto_refresh(event?: any)
  {
    if(event)
    {
      console.log('Auto-Refresh Switch', event.srcElement.checked)
      this.auto_refresh = event.srcElement.checked
    }
    else
    {
      this.auto_refresh = true
    }

    if(this.auto_refresh){
      this.auto_refresh_message = 'Initializing Auto-Refresh ...'

      let time_counter = 30

        this.auto_refresh_message_interval = setInterval(()=>{

        this.auto_refresh_message = 'Refreshing in '+time_counter+' Second(s) ...'
        time_counter = time_counter - 1

      },1000)

      this.auto_refresh_interval = setInterval(async ()=>{

        this.auto_refresh_message = 'Refreshing workflow executions...'
        time_counter = 30
        this.search_results = undefined
        this.all_selected = false
        await this.get_workflow_executions()

      }, 30001)
    }
    else{

      this.auto_refresh_message = 'Shutting down Auto-Refresh ...'

      if(this.auto_refresh_message_interval)
      {
        await clearInterval(this.auto_refresh_message_interval)
        console.log('Cleared Refresh Message Interval')
      }

      if(this.auto_refresh_interval)
      {
        await clearInterval(this.auto_refresh_interval)
        console.log('Cleared Refresh Interval')
      }

      this.auto_refresh_message = undefined

    }
  }

  async set_current_page_selected(page_number: number){
    this.current_page_selected = page_number
    this.search_results = undefined
    await this.get_workflow_executions()
  }

  async update_page_size(page_size: number){
    this.page_size = page_size

    await this.set_current_page_selected(1)
  }

  is_active_page(page_number: number): boolean{
    if(this.current_page_selected == (page_number))
    {
      return true
    }
    else
    {
      return false
    }
  }

  conver_json_to_string(json_item: any): string{
    return JSON.stringify(json_item)
  }

  async get_workflow_executions(){

    if(!this.workflow_status || this.workflow_status == 'All'){
      await this.workflowManagementService.search(((this.current_page_selected-1) * this.page_size), this.page_size, 'updateTime:DESC').toPromise().then((search_results: SearchResultWorkflowSummary) => {
        this.search_results = search_results

        console.log('Total Hits', this.search_results.totalHits)

        this.total_pages = Math.ceil(this.search_results.totalHits / this.page_size)

        this.numbers = Array(this.total_pages).fill(0).map((x,i)=>i+1);

        console.log('Numbers', this.numbers)

      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      })
    }
    else{
 
      console.log('Getting Status enum for status', this.workflow_status)

      let status: string = 'RUNNING'
      switch(this.workflow_status){
        case 'Running':
          status = 'RUNNING'
        break;
        case 'Paused':
          status = 'PAUSED'
        break;
        case 'Failed':
          status = 'FAILED'
        break;
        case 'Completed':
          status = 'COMPLETED'
        break;
        case 'Timed Out':
          status = 'TIMED_OUT'
        break;
        case 'Terminated':
          status = 'TERMINATED'
        break;
      }

      console.log('Getting workflows for status', status)

      //await this.workflowManagementService.search(0,undefined,'updateTime:DESC','status:'+status).toPromise().then((search_results: SearchResultWorkflowSummary) => {
        await this.workflowManagementService.search(0,undefined,'updateTime:DESC',undefined,'status\u003d"'+status+'"').toPromise().then(async (search_results: SearchResultWorkflowSummary) => {
        this.search_results = search_results
        console.log('Total Hits', this.search_results.totalHits)

        this.total_pages = Math.ceil(this.search_results.totalHits / this.page_size)

        this.numbers = Array(this.total_pages).fill(0).map((x,i)=>i+1);

        console.log('Numbers', this.numbers)
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      })
    }
  }

  get_workflow_input_parameters(workflow_run_id: string){
    this.show_loading = true
    if(this.workflow_execution_details_buffer.get(workflow_run_id)){
      this.show_loading = false
      return this.jsonFlattenerService.flatten(this.workflow_execution_details_buffer.get(workflow_run_id).input)
    }

    this.workflowManagementService.getExecutionStatus(workflow_run_id, true).toPromise().then((workflow_execution_detail : Workflow) =>{
      this.workflow_execution_details_buffer.set(workflow_run_id, workflow_execution_detail);
      this.show_loading = false
      return this.jsonFlattenerService.flatten(workflow_execution_detail.input)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    });
  }

  get_workflow_output_parameters(workflow_run_id: string){
    this.show_loading = true
    if(this.workflow_execution_details_buffer.get(workflow_run_id)){
      this.show_loading = false
      return this.jsonFlattenerService.flatten(this.workflow_execution_details_buffer.get(workflow_run_id).output)
    }

    this.workflowManagementService.getExecutionStatus(workflow_run_id, true).toPromise().then((workflow_execution_detail : Workflow) =>{
      this.workflow_execution_details_buffer.set(workflow_run_id, workflow_execution_detail);
      this.show_loading = false
      return this.jsonFlattenerService.flatten(workflow_execution_detail.output)
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    });
  }

   convert_string_to_json(an_item: string): any{

    let item_converted_to_json = {

    }

    an_item =  an_item.replace('{','')
    an_item =  an_item.replace('}','')
    
    let an_item_sub_items: string[] =  an_item.split(', ')

     an_item_sub_items.forEach((sub_item: string) =>{
      let key_value: string[] = sub_item.split('=')
      let final_value = ''
      let counter = 0
      key_value.forEach((value: string) =>{

        if(counter > 0){
          if(final_value == '')
          {
            final_value = value
          }
          else{
            final_value = final_value + '=' + value
          }
          
        }
        counter = counter + 1
      })
      item_converted_to_json[key_value[0]] = final_value
    })

    return item_converted_to_json
  }

  openSmall(content) {
    this.modalService.open(content, {
      size: 'sm'
    });
  }

  openLarge(content) {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  async viewWorkflowExecutionDetails(workflowName: string, workflowVersion: string, workflow_id: string)
  {
    this.navigatorVarHolderService.set_workflow_details(workflowName, Number.parseInt(workflowVersion))
    this.navigatorVarHolderService.set_workflow_id(workflow_id)

    
    await this.router.navigateByUrl('view/workflow-execution-detail?workflow_id='+workflow_id+'&workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  get_workflow_output_params_from_definition(name: string, version: number): any{
    this.metadataManagementService.get(name, version).toPromise().then((worlfow_def: WorkflowDef) => {
      console.log('Returning o/p from def', JSON.stringify(worlfow_def))
      return worlfow_def.outputParameters;
    })
  }

  pause_workflow(workflow_id: string){
    this.workflowManagementService.pauseWorkflow(workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(workflow_id, "Workflow Pause Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Pause Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  resume_workflow(workflow_id: string){
    this.workflowManagementService.resumeWorkflow(workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(workflow_id, "Workflow Resume Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Resume Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  restart_workflow(workflow_id: string){
    this.workflowManagementService.restart(workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(workflow_id, "Workflow Restart Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Restart Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  retry_workflow(workflow_id: string){
    this.workflowManagementService.retry(workflow_id).toPromise().then((response: any) => {
      this.toastrService.success(workflow_id, "Workflow Retry Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Retry Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  terminate_workflow(workflow_id: string, reason?: string){
    this.workflowManagementService.terminate(workflow_id, reason).toPromise().then((response: any) => {
      this.toastrService.success(workflow_id, "Workflow Termination Success !")
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Termination Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  delete_workflow(workflow_id: string, archive: boolean, dont_show_toast?: boolean){
    this.workflowManagementService._delete(workflow_id, archive).toPromise().then((response: any) => {
      if(!dont_show_toast)
      {
        this.toastrService.success(workflow_id, "Workflow Deletion Success !")
      }
      this.initiate_with_delay(1)
    }).catch((err_response: HttpErrorResponse) => {
      this.toastrService.error(err_response.error.message, "Workflow Deletion Failed !")
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  reset_error_message_after_seconds(seconds: number){
    const error_reset_time_out = setTimeout(()=> {
      this.error_message = undefined
      clearTimeout(error_reset_time_out);
    }, seconds*1000)
  }

  async initiate_with_delay(seconds: number)
  {
    let initiate_delay_timeout = setTimeout(()=>{
      this.initiate()
      clearTimeout(initiate_delay_timeout);
    },seconds*1000)
  }

  async pause_selected_workflow(index: number){

    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_pause: string[] = []

    workflow_ids_to_pause.push(this.workflow_ids[index])

    await this.workflowBulkManagementService.pauseWorkflow(workflow_ids_to_pause).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    
  }

  async pause_all_selected_workflows(){

    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_pause: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_pause.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.pauseWorkflow(workflow_ids_to_pause).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  async resume_selected_workflow(index: number){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()
    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []
    
    workflow_ids_to_resume.push(this.workflow_ids[index])

    await this.workflowBulkManagementService.resumeWorkflow(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  async resume_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_resume.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.resumeWorkflow(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(1)
  }

  set_terminate_index(index: number){

    console.log('Previous Index', this.terminate_index)
    console.log('Setting Index', index)
    this.terminate_index = index
   
  }

  async terminate_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    if(this.terminate_index > -1)
    {
      await this.terminate_selected_workflow(this.terminate_index);
    }
    else{
      this.auto_refresh_message = 'Pausing Auto-Refresh ...'
      this.set_auto_refresh_internal(false)
      this.auto_refresh_message = undefined

      let workflow_ids_to_terminate: string[] = []

      await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
        workflow_ids_to_terminate.push(this.workflow_ids[an_index])
      })

      await this.workflowBulkManagementService.terminate(workflow_ids_to_terminate, this.terminate_reason).toPromise().then((response: BulkResponse)=> {
        this.action_response = response
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
        this.reset_error_message_after_seconds(10)
      })

      this.reset_terminate_reason();
      this.search_results = undefined
      this.all_selected = false
      this.selected_workflow_execution_indexes = []
      this.all_selected = false
      await this.initiate_with_delay(0.5)
    }
    
  }

  async restart_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_resume.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.restart(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  async retry_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_resume.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.retry(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  async archive_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    await this.selected_workflow_execution_indexes.sort().forEach(async (an_index: number)=>{
      await this.delete_workflow(this.workflow_ids[an_index], true, true)
    })

    this.toastrService.success("Archived Selected Workflows Successfully !", "Workflows Archival Successful");

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  async delete_all_selected_workflows(){
    this.dismiss_action_response_success_results() ; this.dismiss_action_response_failure_results()

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    await this.selected_workflow_execution_indexes.sort().forEach(async (an_index: number)=>{
      await this.delete_workflow(this.workflow_ids[an_index], false, true)
    })

    this.toastrService.success("Deleted Selected Workflows Successfully !", "Workflows Deletion Successful");

    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  get_selected_workflow_ids(): string{

    let workflow_ids_list = ''
    
    if(this.terminate_index > -1)
    {
      if(workflow_ids_list != '')
      {
        workflow_ids_list = workflow_ids_list + ', ' + this.workflow_ids[this.terminate_index]
      }
      else{
        workflow_ids_list = this.workflow_ids[this.terminate_index]
      }
    }
    else{
      this.selected_workflow_execution_indexes.forEach((an_index: number) => {
        if(workflow_ids_list != '')
        {
          workflow_ids_list = workflow_ids_list + ', ' + this.workflow_ids[an_index]
        }
        else{
          workflow_ids_list = this.workflow_ids[an_index]
        }
      })
    }

    return workflow_ids_list
  }

  async terminate_selected_workflow(index: number){

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_terminate: string[] = []

    workflow_ids_to_terminate.push(this.workflow_ids[index])

    await this.workflowBulkManagementService.terminate(workflow_ids_to_terminate, this.terminate_reason).toPromise().then((response: BulkResponse)=> {
      this.action_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.reset_terminate_reason();
    this.search_results = undefined
    this.all_selected = false
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    await this.initiate_with_delay(0.5)
  }

  set_terminate_reason(value: string){
    this.terminate_reason = value;
  }

  reset_terminate_reason(){
    this.terminate_reason = undefined
  }

  get_object_length(an_object: any): number{
    return Object.keys(an_object).length
  }

  async manage_select_all_switch(){
    if(!this.all_selected)
    {
      this.selected_workflow_execution_indexes = []
    }
    else
    {
      this.selected_workflow_execution_indexes = []
      let workflow_id_counter = 0
      await this.workflow_ids.forEach(()=> {
        this.selected_workflow_execution_indexes.push(workflow_id_counter)
        workflow_id_counter = workflow_id_counter + 1
      })
    }
  }

  add_remove_selection(index: number){
    console.log('Got Index', index)
    if(index > this.selected_workflow_execution_indexes.length)
    {
      this.selected_workflow_execution_indexes.push(index)
    }
    else
    {
      if(index == this.selected_workflow_execution_indexes.sort()[index])
      {
        console.log('matched index', this.selected_workflow_execution_indexes.sort()[index])
        this.selected_workflow_execution_indexes.sort().splice(index, 1)
        console.log(this.selected_workflow_execution_indexes)
        this.all_selected = false
      }
      else{
        this.selected_workflow_execution_indexes.push(index)
      }
    }
  }

  check_selection_contains_index(index: number): boolean{
    if(!this.all_selected){
      if(index > this.selected_workflow_execution_indexes.length)
      {
        return false
      }
      else
      {
        let match_found: boolean = false
        this.selected_workflow_execution_indexes.forEach((an_index: number) => {
          if(!match_found && index == an_index)
          {
            match_found = true
          }
        })

        return match_found
      }
    }
    else
    {
      return true
    }
  }

  async dismiss_action_response_success_results(){
    if(this.action_response && this.action_response.bulkSuccessfulResults)
    {
      this.action_response.bulkSuccessfulResults = undefined
    }
  }

  async dismiss_action_response_failure_results(){
    if(this.action_response && this.action_response.bulkErrorResults)
    {
      this.action_response.bulkErrorResults = undefined
    }
  }

}
