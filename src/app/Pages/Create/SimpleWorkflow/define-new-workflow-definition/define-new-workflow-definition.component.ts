import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { WorkflowTask } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-define-new-workflow-definition',
  templateUrl: './define-new-workflow-definition.component.html',
  styleUrls: []
})
export class DefineNewWorkflowDefinitionComponent implements OnInit {

  public show_loading: boolean

  public workflow_tasks: WorkflowTask[]

  constructor(private navigatorVarHolderService: NavigatorVarHolderService, private router: Router, private modalService: NgbModal) {}

  async ngOnInit() {

    this.show_loading = true

    this.workflow_tasks = this.navigatorVarHolderService.get_workflow_tasks()

    this.show_loading = false

  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.workflow_tasks, event.previousIndex, event.currentIndex);
  }

  openLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    });
  }

  async proceed_to_next_stage(){

    this.navigatorVarHolderService.set_workflow_tasks(this.workflow_tasks);
    

    this.router.navigateByUrl('wire-simple-conductor-workflow-creation', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }
}
