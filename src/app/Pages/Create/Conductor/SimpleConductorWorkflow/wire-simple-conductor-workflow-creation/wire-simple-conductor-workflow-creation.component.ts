import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowTask } from 'src/app/Rest/Conductor';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-wire-simple-conductor-workflow-creation',
  templateUrl: './wire-simple-conductor-workflow-creation.component.html',
  styleUrls: []
})
export class WireSimpleConductorWorkflowCreationComponent implements OnInit {

  public show_loading: boolean

  public workflow_tasks: WorkflowTask[]
  public options: string[]

  public inputKeys: string[]
  public newInput: string
  public newInputValidationMessage: string

  public error_validation_report: any = []

  public task_type_selected: string

  constructor(private navigatorVarHolderService: NavigatorVarHolderService, private router: Router, private modalService: NgbModal) {
    this.inputKeys = []
    this.options = []
  }

  async ngOnInit() {

    this.show_loading = true

    this.workflow_tasks = this.navigatorVarHolderService.get_workflow_tasks()

    this.inputKeys = this.workflow_tasks[0].taskDefinition.inputKeys
    
    this.show_loading = false

  }

  openLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    });
  }

  openXLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      size: 'lg', 
      windowClass: 'myCustomModalClass'
    });
  }

  async validate_task_input_wiring(){
    await this.workflow_tasks.forEach(async (workflow_task: WorkflowTask) => {
       Object.keys(workflow_task.inputParameters)
    })
  }

  async prepare_mapping_params_options(task_index: number){
    
    if(task_index < 0){
      this.options = []
    }
    else{
      while(task_index > 0)
      {
        task_index = task_index - 1

        if(this.workflow_tasks[task_index].taskDefinition.outputKeys)
          {
            this.workflow_tasks[task_index].taskDefinition.outputKeys.forEach((an_output_key: string) =>{
              let an_option: string = '$' + this.workflow_tasks[task_index].taskReferenceName + '.output.' + an_output_key;
              this.options.push(an_option)
            })
          }
      }
    }

    if(task_index == 0)
        {
          this.inputKeys.forEach((an_input_key: string) =>{
            let an_option: string = '$workflow.input.' + an_input_key;
              this.options.push(an_option)
          })
        }

    console.log(this.options)
  }

  async proceed_to_next_stage(){

    this.navigatorVarHolderService.set_workflow_tasks(this.workflow_tasks);
    

    this.router.navigateByUrl('wire-simple-conductor-workflow-creation', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async addInput(newInput: string)
  {
    console.log('Setting newInput --> ', newInput);
    
    let regexp = new RegExp('^[a-zA-Z0-9_]*$')

    if(regexp.test(newInput))
    {
      let isDuplicate: boolean = false;
      await this.inputKeys.forEach( (anInput: any) => {
        if(anInput == newInput)
        {
          isDuplicate = true;
        }
      });

      if(!isDuplicate)
      {
        this.newInput = newInput;
        console.log('Finished Setting newInput --> ', this.newInput); 
      }
      else{
      this.newInput = "";
      this.newInputValidationMessage = "Duplicate value not allowed !!!"
      
      const inputValidationTimeout = setTimeout(()=> {
        this.newInputValidationMessage = "";
        clearTimeout(inputValidationTimeout);
      }, 5000);

      console.log('Duplicate Validation Failed. Finished Setting newInput --> ', this.newInput);
      }
    }
    else
    {
      this.newInput = "";
      this.newInputValidationMessage = "Only Alphanumeric and Underscore are allowed."
      
      const inputValidationTimeout = setTimeout(()=> {
        this.newInputValidationMessage = "";
        clearTimeout(inputValidationTimeout);
      }, 5000);

      console.log('Regex Validation Failed. Finished Setting newInput --> ', this.newInput);
    }
  }

  async manageInput(option?: string)
  {

    if(undefined==option && undefined!=this.newInput && ""!+this.newInput)
    {
      this.inputKeys.push(this.newInput);
    }
    else
    {
      let indexForRemoval: number = -1;

      let duplicateCheckCounter: number = 0;
      this.inputKeys.forEach((anInput: string) =>{
        if(anInput == option)
        {
          indexForRemoval = duplicateCheckCounter;
          }

          duplicateCheckCounter = duplicateCheckCounter + 1;
      })

      await this.inputKeys.splice(indexForRemoval, 1);

    }
  }

  select_task_type(task_type: string){
    this.task_type_selected = task_type
  }
}
