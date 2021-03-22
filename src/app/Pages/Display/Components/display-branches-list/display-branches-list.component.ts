import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, WorkflowTask } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-display-branches-list',
  templateUrl: './display-branches-list.component.html',
  styleUrls: []
})
export class DisplayBranchesListComponent implements OnInit {

  @Input()
  branch_task_list: WorkflowTask[][]

  @Input()
  tasks_execution_list?: Task[]

  @Input()
  workflow_name: string

  @Input()
  workflow_version: number

  @Input()
  workflow_status?: string

  @Input()
  parent_task_ref_name: string

  public display_warning: boolean

  constructor(private router: Router) { }

  async ngOnInit() {

    if(!this.branch_task_list || !this.workflow_name || !this.workflow_version || !this.parent_task_ref_name)
    {
      this.display_warning = true
    }

    if(!this.branch_task_list && localStorage.getItem('fillory_ui_buffer_branch_task_list'))
    { 
      this.branch_task_list = JSON.parse(localStorage.getItem('fillory_ui_buffer_branch_task_list'))
      await localStorage.removeItem('fillory_ui_buffer_branch_task_list')
    }

    if(!this.workflow_name && localStorage.getItem('fillory_ui_buffer_branch_workflow_name'))
    { 
      this.workflow_name = localStorage.getItem('fillory_ui_buffer_branch_workflow_name')
      await localStorage.removeItem('fillory_ui_buffer_branch_workflow_name')
    }

    if(!this.workflow_version && localStorage.getItem('fillory_ui_buffer_branch_workflow_version'))
    { 
      this.workflow_version = JSON.parse(localStorage.getItem('fillory_ui_buffer_branch_workflow_version'))
      await localStorage.removeItem('fillory_ui_buffer_branch_workflow_version')
    }

    if(!this.parent_task_ref_name && localStorage.getItem('fillory_ui_buffer_parent_task_ref_name'))
    { 
      this.parent_task_ref_name = localStorage.getItem('fillory_ui_buffer_parent_task_ref_name')
      await localStorage.removeItem('fillory_ui_buffer_parent_task_ref_name')
    }

    if(!this.branch_task_list || !this.workflow_name || !this.workflow_version || !this.parent_task_ref_name)
    {
      console.log(''+ !this.branch_task_list + !this.workflow_name + !this.workflow_version + !this.parent_task_ref_name)
      await this.route_to_home()
    }
  }

  async route_to_home(){
    await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
