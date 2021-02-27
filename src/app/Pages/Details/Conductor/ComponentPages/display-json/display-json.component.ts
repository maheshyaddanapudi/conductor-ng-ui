import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-json',
  templateUrl: './display-json.component.html',
  styleUrls: []
})
export class DisplayJsonComponent implements OnInit {

  @Input()
  workflow_def_json: string

  constructor(private router: Router) { }

  async ngOnInit() {

    if(!this.workflow_def_json && localStorage.getItem('fillory_ui_buffer_branch_workflow_def_json'))
    { 
      this.workflow_def_json = localStorage.getItem('fillory_ui_buffer_branch_workflow_def_json')
      await localStorage.removeItem('fillory_ui_buffer_branch_workflow_def_json')
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
