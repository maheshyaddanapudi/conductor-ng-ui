import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MetadataManagementService, TaskDef } from 'src/app/Rest/Conductor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-task-definitions',
  templateUrl: './task-definitions.component.html',
  styleUrls: []
})
export class TaskDefinitionsComponent implements OnInit {

  public taskdefs_list: TaskDef[]
  public paginated_taskdefs_list: TaskDef[][]
  public page_size: number = 10

  public delete_succesful: boolean = false
  public result: string

  public current_page_selected: number = 1

  public number_of_pages: number = 0
  public taskDefJsonTemp: string = ''
  public error_message: string

  constructor(private metadataManagementService: MetadataManagementService, private navigatorVarHolderService: NavigatorVarHolderService, private router: Router, private metadata_management_service: MetadataManagementService, private modalService: NgbModal) {
    this.taskdefs_list = []
    this.paginated_taskdefs_list = []
   }

  async ngOnInit() {
    await this.initiate()
  }

  async initiate()
  {
    await this.metadata_management_service.getTaskDefs().toPromise().then((taskdefs_list_response: TaskDef[]) => {
      this.taskdefs_list = taskdefs_list_response;
      console.log('Total TaskDefs - ', taskdefs_list_response.length)
      
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    if(this.taskdefs_list){
      await this.prepare_paginated_tasks(this.taskdefs_list)
    }
  }

  reset_delete_succesful(){
    this.delete_succesful = false
    this.result = undefined
  }

   async delete(task_name: string){

    let delete_succesful: boolean = false

    await this.metadataManagementService.unregisterTaskDef(task_name).toPromise().then((response: any) => {
      delete_succesful = true
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })

    if(delete_succesful)
    { 
      this.result = 'Task Deleted Successfully !';

      await this.initiate()
    }

    this.delete_succesful = delete_succesful
  }

  async update_page_size(page_size: number){
    this.page_size = page_size

    await this.prepare_paginated_tasks(this.taskdefs_list)
  }

  async update(task_name: string){
    await this.router.navigateByUrl('update/update-task-definition?task_name='+task_name, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async prepare_paginated_tasks(tasks_list:TaskDef[]){

    this.paginated_taskdefs_list = []

    this.number_of_pages = Math.ceil(tasks_list.length / this.page_size)
    console.log('Number of Pages '+tasks_list.length+' / '+this.page_size, this.number_of_pages)

    if(this.page_size>0){
      let page_counter = 0

      while(page_counter < this.number_of_pages)
      {
        this.paginated_taskdefs_list.push(tasks_list.slice(page_counter * this.page_size, (page_counter + 1) * this.page_size))
        page_counter = page_counter + 1
      }
    }
    else{
      this.number_of_pages = 0
      this.paginated_taskdefs_list.push(tasks_list)
    }
  }

  async set_current_page_selected(page_number: number)
  {
    this.current_page_selected = page_number
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

  async setTaskDefJsonTemp(tempJson: any){
    if(undefined == tempJson || '' == tempJson)
    {
      this.taskDefJsonTemp = '';
    }
    else{
      this.taskDefJsonTemp = JSON.stringify(tempJson);
    }
  }

  async update_task_def(name: string){

    this.navigatorVarHolderService.set_task_name(name)
    
    await this.router.navigateByUrl('update/update-task-definition?task_name='+name, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async viewTaskDetails(name: string)
  {
    this.navigatorVarHolderService.set_task_name(name)

    await this.router.navigateByUrl('view/task-definition-detail?task_name='+name, { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }
}
