import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowTask } from 'src/app/Rest/Conductor';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-wire-new-workflow-definition',
  templateUrl: './wire-new-workflow-definition.component.html',
  styleUrls: []
})
export class WireNewWorkflowDefinitionComponent implements OnInit {

  public show_loading: boolean

  public workflow_tasks: WorkflowTask[]

  public output_options_buffer: Map<number, string[]>  = new Map();

  public inputKeys: string[] = []

  public newInput: string
  public newInputValidationMessage: string

  constructor(private navigatorVarHolderService: NavigatorVarHolderService, private router: Router, private modalService: NgbModal) {}

  async ngOnInit() {

    this.show_loading = true

    this.workflow_tasks = this.navigatorVarHolderService.get_workflow_tasks()
    this.determine_initial_input_keys()

    this.show_loading = false

  }

  determine_initial_input_keys(){
    this.inputKeys = Object.keys(this.workflow_tasks[0].inputParameters)
  }

  openLarge(content) {
    this.modalService.open(content, {
      backdrop : 'static',
      keyboard : false,
      modalDialogClass: 'modal-x-large',
      size: 'xl'
    });
  }

  async proceed_to_next_stage(){

    this.navigatorVarHolderService.set_workflow_tasks(this.workflow_tasks);
    this.navigatorVarHolderService.set_workflow_input_params(this.inputKeys);
    
    this.router.navigateByUrl('create/confirm-new-workflow', { skipLocationChange: true },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }

  async delete_task_from_selection(index:number){
    await this.workflow_tasks.splice(index, 1);
  }

  get_input_mapping_options_available(task_index: number, param_name?: string): string[]{

    if(param_name && param_name == 'version' && this.workflow_tasks[task_index].type && this.workflow_tasks[task_index].type == 'SUB_WORKFLOW')
    {
      let options:string[] = []
      if(this.inputKeys && this.inputKeys.length > 0){
        this.inputKeys.forEach((option: string)=>{
          options.push('${workflow.input.'+option+'}')
        })
      }
      return options
    }
    else if(param_name && param_name == 'terminationStatus' && this.workflow_tasks[task_index].type && this.workflow_tasks[task_index].type == 'TERMINATE')
    {
      let options: string[] = ["COMPLETED", "FAILED"]
      return options
    }
    else if(param_name && param_name == 'asyncComplete' && this.workflow_tasks[task_index].type && this.workflow_tasks[task_index].type == 'KAFKA_PUBLISH')
    {
      let options:string[] = ["true", "false"]
      if(this.inputKeys && this.inputKeys.length > 0){
        this.inputKeys.forEach((option: string)=>{
          options.push('${workflow.input.'+option+'}')
        })
      }
      return options
    }
    else{
      if(this.output_options_buffer && this.output_options_buffer.size > 0 && this.output_options_buffer.get(task_index))
      {
        return this.output_options_buffer.get(task_index)
      }
      else{
        let options:string[] = []
      if(this.inputKeys && this.inputKeys.length > 0){
        this.inputKeys.forEach((option: string)=>{
          options.push('${workflow.input.'+option+'}')
        })
      }

      if(task_index > 0)
      {
        let task_counter = task_index - 1

        while(task_counter > 0)
        {
          if(this.workflow_tasks[task_counter].taskDefinition && this.workflow_tasks[task_counter].taskDefinition.outputKeys && this.workflow_tasks[task_counter].taskDefinition.outputKeys.length > 0)
          {
            this.workflow_tasks[task_counter].taskDefinition.outputKeys.forEach((option: string)=>{
              options.push('${'+this.workflow_tasks[task_counter].taskReferenceName+'.output.'+option+'}')
            })
          }

          task_counter = task_counter - 1;
        }
      }

      this.output_options_buffer.set(task_index, options)
      return options;
      }
    }

    
  }

  map_input(task_index:number, input_key: string, input_value: string){
    this.workflow_tasks[task_index].inputParameters[input_key] = input_value
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
}
