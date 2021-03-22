import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResultWorkflowSummary, WorkflowManagementService } from 'src/app/Rest/Conductor';


@Component({
  selector: 'app-individual-workflow-executions',
  templateUrl: './individual-workflow-executions.component.html',
  styleUrls: []
})
export class IndividualWorkflowExecutionsComponent implements OnInit {

  public search_results: SearchResultWorkflowSummary

  public page_size: number = 10

  public current_page_selected = 1

  public workflow_name: string
  public workflow_version: number

  public error_message: string

  public total_pages: number

  public numbers: number[] = []

  public auto_refresh: boolean = false

  private auto_refresh_interval: any
  public auto_refresh_message: string
  private auto_refresh_message_interval: any

  constructor(private route: ActivatedRoute,private router: Router, private workflowManagementService: WorkflowManagementService, private modalService: NgbModal, private navigatorVarHolderService: NavigatorVarHolderService) { 
    this.auto_refresh_message = 'Initializing Auto-Refresh ...'
   }

  async ngOnInit() {

    await this.route.queryParams.subscribe(params => {
      console.log(params)
      this.workflow_name = params['workflow_name'];  
      this.workflow_version = Number.parseInt(params['workflow_version']);  
    });
    console.log('Workflow Executions for Workflow', this.workflow_name +' :: '+this.workflow_version)
    await this.get_workflow_executions()
    this.set_auto_refresh_internal(false)
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
    
    if(this.workflow_name && this.workflow_version){
      await this.workflowManagementService.search(((this.current_page_selected-1) * this.page_size), this.page_size, 'updateTime:DESC','workflowType\u003d"'+this.workflow_name+'" && version='+this.workflow_version).toPromise().then((search_results: SearchResultWorkflowSummary) => {
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
      this.error_message = 'No Workflow Name or Version was received to get the execution history !!!'
    }
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
    await this.router.navigateByUrl('view/workflow-execution-detail?workflow_id='+workflow_id+'&workflow_name='+workflowName+'&workflow_version='+workflowVersion, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
