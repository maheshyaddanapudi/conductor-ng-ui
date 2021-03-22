import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PollData, TaskManagementService } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-queues-and-poll-data',
  templateUrl: './queues-and-poll-data.component.html',
  styleUrls: []
})
export class QueuesAndPollDataComponent implements OnInit {

  
  public task_queue_all_data: any
  public poll_queue_all_data: PollData[]

  public error_message: string

  constructor(private taskManagementService: TaskManagementService) { 
    
  }

  async ngOnInit() {
    await this.taskManagementService.getAllPollData().toPromise().then((poll_data_result: PollData[]) => {
      this.poll_queue_all_data = poll_data_result
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    await this.taskManagementService.all().toPromise().then((task_queue_data: any)=>{
      this.task_queue_all_data = task_queue_data
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
    if(key == 'lastPollTime'){
      return this.get_readable_date_time(value)
    }
    else{
      return value
    }
  }

}
