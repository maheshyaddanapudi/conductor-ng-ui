import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetadataResourceService, PollData, TaskDef, TaskResourceService } from 'src/app/Rest/Conductor';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-task-definition-detail',
  templateUrl: './task-definition-detail.component.html',
  styleUrls: []
})
export class TaskDefinitionDetailComponent implements OnInit {

  public task_def: TaskDef
  public task_name: string
  public error_message: string
  public result: string
  public task_poll_data: any[] = []

  private opened_model_content: NgbModalRef 

  constructor(private route: ActivatedRoute, private taskManagementService: TaskResourceService, private router: Router, private modalService: NgbModal, private navigatorVarHolderService: NavigatorVarHolderService, private metadataManagementService: MetadataResourceService) { }

  async ngOnInit() {
    
    await this.route.queryParams.subscribe(params => {
      console.log(params)
      this.task_name = params['task_name'];  
    });

    if(this.task_name)
    {
      this.metadataManagementService.getTaskDef(this.task_name).toPromise().then((task_def: TaskDef) => {

        this.task_def = task_def
      }).catch((err_response: HttpErrorResponse) => {
        
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
    })
    }
  }

  openLarge(content) {
    this.opened_model_content = this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
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
    this.metadataManagementService.unregisterTaskDef(this.task_name).toPromise().then((response: any) => {
      
      let countdown_timer = 5;
      const time_interval_timer = setInterval(()=>{
        this.result = 'Task Deleted Successfully ... Please wait ... Redirecting in '+countdown_timer;
        countdown_timer = countdown_timer - 1
      }, 1000)

      const time_out_timer = setTimeout(async ()=> {

        clearInterval(time_interval_timer)

        await this.router.navigateByUrl('view/task-definitions', { skipLocationChange: true }).then(async (fulfilled: boolean) => {
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

  async update(){
    await this.router.navigateByUrl('update/update-task-definition?task_name='+this.task_name, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async view_tasks_in_progress(){
    await this.router.navigateByUrl('view-tasks-in-progress', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async requeue(){
    await this.taskManagementService.requeuePendingTask(this.task_name).toPromise().then((response: string) => {
      this.result = ' Task Requeued Successfully !!!'
      const timeout_timer = setTimeout(()=> {
        this.result = undefined
        clearTimeout(timeout_timer)
      },5000)
    })
  }

  async dismiss_results(){
    this.result = undefined
    this.error_message = undefined
  }

  async get_poll_data(){
    this.taskManagementService.getPollData(this.task_name).toPromise().then((task_poll_data: PollData[]) => {
      this.task_poll_data = task_poll_data

      if(task_poll_data.length > 0){

        this.result = 'Total of '+task_poll_data.length+' Poll Data Record(s) found.';

        let poll_data_counter = 0;

        task_poll_data.forEach((poll_data: PollData) => {
          let d = new Date(poll_data['lastPollTime'])
          
          this.task_poll_data[poll_data_counter]['lastPollTime'] = d

          poll_data_counter = poll_data_counter + 1
        })
      }
      else
      {
        this.result = 'No Poll Data Record Found';
      }

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
