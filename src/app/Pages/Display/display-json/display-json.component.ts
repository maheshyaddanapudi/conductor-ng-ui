import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetadataResourceService, Workflow, WorkflowDef, WorkflowResourceService } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-display-json',
  templateUrl: './display-json.component.html',
  styleUrls: []
})
export class DisplayJsonComponent implements OnInit {

  @Input()
  workflow_def_json: string

  public workflow_name?: string
  public workflow_id?: string
  public workflow_version?: number
  public workflow_def?: WorkflowDef
  public workflow_execution?: Workflow

  public error_message: string

  constructor(private route: ActivatedRoute, private router: Router, private metadataManagementService: MetadataResourceService, private workflowManagementService: WorkflowResourceService) { }

  async ngOnInit() {

    if(!this.workflow_def_json)
    {
      await this.route.queryParams.subscribe(params => {
        console.log(params)
        this.workflow_name = params['workflow_name']
        this.workflow_version = Number.parseInt(params['workflow_version'])
        this.workflow_id = params['workflow_id']
      });

      if(this.workflow_name){

        await this.metadataManagementService.get(this.workflow_name, this.workflow_version).toPromise().then(async (workflowDef: WorkflowDef) => {
          this.workflow_def = workflowDef
        }).catch((err_response: HttpErrorResponse) => {
          this.error_message = err_response.message
          console.log('Response Code - ', err_response.status)
          console.log('Response Status - ', err_response.statusText)
          console.log('Response Error - ', err_response.error)
        })

        this.workflow_def_json = JSON.stringify(this.workflow_def, undefined, 4)
      }
      if(this.workflow_id){
        await this.workflowManagementService.getExecutionStatus(this.workflow_id).toPromise().then((workflow: Workflow) => {
          this.workflow_execution = workflow
        }).catch((err_response: HttpErrorResponse) => {
          this.error_message = err_response.message
          console.log('Response Code - ', err_response.status)
          console.log('Response Status - ', err_response.statusText)
          console.log('Response Error - ', err_response.error)
        })

        this.workflow_def_json = JSON.stringify(this.workflow_execution, undefined, 4)
      }
    }

    if(!this.workflow_def_json)
    {
      await this.route_to_home();
    }
  }

  async route_to_home(){
    await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

}
