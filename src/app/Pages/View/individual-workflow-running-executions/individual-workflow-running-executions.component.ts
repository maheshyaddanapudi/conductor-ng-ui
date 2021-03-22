import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BulkResponse, SearchResultWorkflowSummary, Workflow, WorkflowBulkManagementService, WorkflowManagementService } from 'src/app/Rest/Conductor';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-individual-workflow-running-executions',
  templateUrl: './individual-workflow-running-executions.component.html',
  styleUrls: []
})
export class IndividualWorkflowRunningExecutionsComponent implements OnInit {

  public worlfow_execution_results: Workflow[]
  public workflow_ids: string[]
  public panginated_worlfow_execution_results: Workflow[][]

  public page_size: number = 10

  public current_page_selected = 1

  public all_selected: boolean = false
  public selected_workflow_execution_indexes: number[]

  public workflow_name: string
  public workflow_version: number

  public error_message: string

  public total_pages: number

  public number_of_pages: number

  public auto_refresh: boolean = false

  private auto_refresh_interval: any
  public auto_refresh_message: string
  private auto_refresh_message_interval: any

  public pause_response: BulkResponse
  public resume_response: BulkResponse
  public terminate_response: BulkResponse

  public terminate_reason: string
  public terminate_index: number = -1

  constructor(private route: ActivatedRoute, private router: Router, private workflowManagementService: WorkflowManagementService, private workflowBulkManagementService: WorkflowBulkManagementService, private modalService: NgbModal) { 
    this.auto_refresh_message = 'Initializing Auto-Refresh ...'
    this.workflow_ids = []
    this.selected_workflow_execution_indexes = []
    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
   }

  async ngOnInit() {
    await this.route.queryParams.subscribe(params => {
      console.log(params)
      this.workflow_name = params['workflow_name'];  
      this.workflow_version = Number.parseInt(params['workflow_version']);  
    });
    console.log('Workflow Executions for Workflow', this.workflow_name +' :: '+this.workflow_version)
    this.initiate()
    this.set_auto_refresh()
  }

  async initiate(){
    await this.get_workflow_executions()
  }
  async prepage_panginated_worlfow_execution_results(){

    let buffer_worlfow_execution_results: Workflow[] = []
    await this.worlfow_execution_results.forEach((execution_result: Workflow) => {
      if(execution_result.version == this.workflow_version)
      {
        buffer_worlfow_execution_results.push(execution_result)
      }
    })

    this.worlfow_execution_results = buffer_worlfow_execution_results

    this.panginated_worlfow_execution_results = []

    this.number_of_pages = Math.ceil(this.worlfow_execution_results.length / this.page_size)
    console.log('Number of Pages '+this.worlfow_execution_results.length+' / '+this.page_size, this.number_of_pages)

    let page_counter = 0

    while(page_counter < this.number_of_pages)
    {
      this.panginated_worlfow_execution_results.push(this.worlfow_execution_results.slice(page_counter * this.page_size, (page_counter + 1) * this.page_size))
      page_counter = page_counter + 1
    }
  }

  async ngOnDestroy(){
    this.set_auto_refresh_internal(false)
  }

  reset_error_message_after_seconds(seconds: number){
    const error_reset_time_out = setTimeout(()=> {
      this.error_message = undefined
      clearTimeout(error_reset_time_out);
    }, seconds*1000)
  }

  async refresh(){

    let auto_refresh: boolean = this.auto_refresh

    if(this.auto_refresh)
    {
      this.set_auto_refresh_internal(false)
    }

    let temp_auto_refresh_message = this.auto_refresh_message 
    
    this.auto_refresh_message = 'Performing Adhoc Refresh ...'
    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.pause_response = undefined
    this.resume_response = undefined
    await this.get_workflow_executions()
    this.auto_refresh_message = 'Completed Adhoc Refresh ...'
    
    const local_time_out = setTimeout(()=>{
      this.auto_refresh_message = temp_auto_refresh_message
      if(auto_refresh)
      {
        this.set_auto_refresh_internal(true)
      }
      clearTimeout(local_time_out)
    },5000)
    
  }

  async set_auto_refresh_internal(status: boolean)
  {
    console.log('Auto-Refresh Switch Internal', status)
    this.auto_refresh = status

    if(this.auto_refresh){
      this.pause_response = undefined
      this.resume_response = undefined
      this.auto_refresh_message = 'Initializing Auto-Refresh ...'

      let time_counter = 30

      this.auto_refresh_message_interval = setInterval(()=>{

        this.auto_refresh_message = 'Refreshing in '+time_counter+' Second(s) ...'
        time_counter = time_counter - 1

      },1000)

      this.auto_refresh_interval = setInterval(async ()=>{

        console.log('Refreshing workflow executions...')
        time_counter = 30
        this.worlfow_execution_results = []
        this.panginated_worlfow_execution_results = []
        this.selected_workflow_execution_indexes = []
        this.all_selected = false
        this.pause_response = undefined
        this.resume_response = undefined
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
      this.pause_response = undefined
      this.resume_response = undefined
      this.auto_refresh_message = 'Initializing Auto-Refresh ...'

      let time_counter = 30

        this.auto_refresh_message_interval = setInterval(()=>{

        this.auto_refresh_message = 'Refreshing in '+time_counter+' Second(s) ...'
        time_counter = time_counter - 1

      },1000)

      this.auto_refresh_interval = setInterval(async ()=>{

        this.auto_refresh_message = 'Refreshing workflow executions...'
        time_counter = 30
        this.worlfow_execution_results = []
        this.panginated_worlfow_execution_results = []
        this.selected_workflow_execution_indexes = []
        this.all_selected = false
        this.pause_response = undefined
        this.resume_response = undefined
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

  async pause_selected_workflow(index: number){

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_pause: string[] = []

    workflow_ids_to_pause.push(this.workflow_ids[index])

    await this.workflowBulkManagementService.pauseWorkflow(workflow_ids_to_pause).toPromise().then((response: BulkResponse)=> {
      this.pause_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.resume_response = undefined
    this.terminate_response = undefined
    await this.initiate()
  }

  async pause_all_selected_workflows(){

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_pause: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_pause.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.pauseWorkflow(workflow_ids_to_pause).toPromise().then((response: BulkResponse)=> {
      this.pause_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.resume_response = undefined
    this.terminate_response = undefined
    await this.initiate()
  }

  async resume_selected_workflow(index: number){
    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []
    
    workflow_ids_to_resume.push(this.workflow_ids[index])

    await this.workflowBulkManagementService.resumeWorkflow(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.resume_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.pause_response = undefined
    this.terminate_response = undefined
    await this.initiate()
  }

  async resume_all_selected_workflows(){

    this.auto_refresh_message = 'Pausing Auto-Refresh ...'
    this.set_auto_refresh_internal(false)
    this.auto_refresh_message = undefined

    let workflow_ids_to_resume: string[] = []

    await this.selected_workflow_execution_indexes.sort().forEach((an_index: number)=>{
      workflow_ids_to_resume.push(this.workflow_ids[an_index])
    })

    await this.workflowBulkManagementService.resumeWorkflow(workflow_ids_to_resume).toPromise().then((response: BulkResponse)=> {
      this.resume_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.pause_response = undefined
    this.terminate_response = undefined
    await this.initiate()
  }

  set_terminate_index(index: number){

    console.log('Previous Index', this.terminate_index)
    console.log('Setting Index', index)
    this.terminate_index = index
   
  }

  async terminate_all_selected_workflows(){

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
        this.terminate_response = response
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
        this.reset_error_message_after_seconds(10)
      })

      this.reset_terminate_reason();
      this.worlfow_execution_results = []
      this.panginated_worlfow_execution_results = []
      this.selected_workflow_execution_indexes = []
      this.all_selected = false
      this.pause_response = undefined
      this.resume_response = undefined
      await this.initiate()
    }
    
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
      this.terminate_response = response
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
      this.reset_error_message_after_seconds(10)
    })

    this.reset_terminate_reason();
    this.worlfow_execution_results = []
    this.panginated_worlfow_execution_results = []
    this.selected_workflow_execution_indexes = []
    this.all_selected = false
    this.pause_response = undefined
    this.resume_response = undefined
    await this.initiate()
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

  async dismiss_terminate_response_success_results(){
    if(this.terminate_response && this.terminate_response.bulkSuccessfulResults)
    {
      this.terminate_response.bulkSuccessfulResults = undefined
    }
  }

  async dismiss_terminate_response_failure_results(){
    if(this.terminate_response && this.terminate_response.bulkErrorResults)
    {
      this.terminate_response.bulkErrorResults = undefined
    }
  }

  async dismiss_pause_response_success_results(){
    if(this.pause_response && this.pause_response.bulkSuccessfulResults)
    {
      this.pause_response.bulkSuccessfulResults = undefined
    }
  }

  async dismiss_pause_response_failure_results(){
    if(this.pause_response && this.pause_response.bulkErrorResults)
    {
      this.pause_response.bulkErrorResults = undefined
    }
  }

  async dismiss_resume_response_success_results(){
    if(this.resume_response && this.resume_response.bulkSuccessfulResults)
    {
      this.resume_response.bulkSuccessfulResults = undefined
    }
  }

  async dismiss_resume_response_failure_results(){
    if(this.resume_response && this.resume_response.bulkErrorResults)
    {
      this.resume_response.bulkErrorResults = undefined
    }
  }

  async viewWorkflowDetails()
  {
    await this.router.navigateByUrl('view/workflow-detail?workflow_name='+this.workflow_name+'&workflow_version='+this.workflow_version, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async get_workflow_executions(){

    await this.workflowManagementService.getRunningWorkflow(this.workflow_name, this.workflow_version).toPromise().then(async (workflow_ids: string[])=> {
      console.log('Obtained Execution Ids', JSON.stringify(workflow_ids))

      this.workflow_ids = workflow_ids

      if(workflow_ids && workflow_ids.length > 0)
      {
        let workflow_id_counter = 0

        await workflow_ids.forEach(async (aWorkflow_id: string)=> {
          console.log('Getting Workflow Execution of',aWorkflow_id)
          await this.workflowManagementService.getExecutionStatus(aWorkflow_id).toPromise().then(async (a_workflow: Workflow)=>{
            await this.worlfow_execution_results.push(a_workflow)
            console.log('Obtained Workflow Execution',JSON.stringify(a_workflow))
            workflow_id_counter = workflow_id_counter + 1
            if(workflow_id_counter  == workflow_ids.length)
            {
              await this.prepage_panginated_worlfow_execution_results()
            }
          }).catch((err_response: HttpErrorResponse) => {
            this.error_message = err_response.message
            console.log('Response Code - ', err_response.status)
            console.log('Response Status - ', err_response.statusText)
            console.log('Response Error - ', err_response.error)
          })
        })

      }
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

  openLarge(content) {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  openSmall(content) {
    this.modalService.open(content, {
      size: 'sm'
    });
  }

  async viewWorkflowExecutionDetails(workflowName: string, workflowVersion: string, workflow_id: string)
  {
    await this.router.navigateByUrl('view/workflow-execution-detail?workflow_id='+workflow_id+'&workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
