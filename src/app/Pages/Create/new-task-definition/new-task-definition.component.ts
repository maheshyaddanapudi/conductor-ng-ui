import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { MetadataManagementService, TaskDef } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-new-task-definition',
  templateUrl: './new-task-definition.component.html',
  styleUrls: []
})
export class NewTaskDefinitionComponent implements OnInit {

  inputKeys: string[];
  outputKeys: string[];
  newInput: string = "";
  newInputValidationMessage: string = "";
  newOutput: string = "";
  newOutputValidationMessage: string = "";

  ownerApp: string;
  ownerEmail: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  description: string;
  timeoutSeconds: number;
  responseTimeoutSeconds: number;
  concurrentExecLimit: number;
  retryCount: number;
  createTime?: number;
  updateTime?: number;
  timeoutPolicy?: string;
  retryLogic?: string;
  retryDelaySeconds?: number;
  inputTemplate?: any;
  rateLimitPerFrequency?: number;
  rateLimitFrequencyInSeconds?: number;
  isolationGroupId?: string;
  executionNameSpace?: string;

  public result: string;
  public error_message: string;

  constructor(private modalService: NgbModal, private metadataManagementService: MetadataManagementService) { 
    this.inputKeys = [];
    this.outputKeys = [];

  }

  async ngOnInit() {

    this.reset_all_inputs_to_defaults()

  }

  async setName(name:string){
    this.name = name;
  }

  openLarge(content) {
    this.modalService.open(content, {
      size: 'lg'
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

  async addOutput(newOutput: string)
{
  console.log('Setting newOutput --> ', newOutput);
  
  let regexp = new RegExp('^[a-zA-Z0-9_]*$')

  if(regexp.test(newOutput))
  {
    let isDuplicate: boolean = false;
    await this.outputKeys.forEach( (anOutput: any) => {
      if(anOutput == newOutput)
      {
        isDuplicate = true;
      }
    });

    if(!isDuplicate)
    {
      this.newOutput = newOutput;
      console.log('Finished Setting newOutput --> ', this.newOutput); 
    }
    else{
    this.newOutput = "";
    this.newOutputValidationMessage = "Duplicate value not allowed !!!"
    
    const outputValidationTimeout = setTimeout(()=> {
      this.newOutputValidationMessage = "";
      clearTimeout(outputValidationTimeout);
    }, 5000);

    console.log('Duplicate Validation Failed. Finished Setting newOutput --> ', this.newOutput);
    }
  }
  else
  {
    this.newOutput = "";
    this.newOutputValidationMessage = "Only Alphanumeric and Underscore are allowed."
    
    const outputValidationTimeout = setTimeout(()=> {
      this.newOutputValidationMessage = "";
      clearTimeout(outputValidationTimeout);
    }, 5000);

    console.log('Regex Validation Failed. Finished Setting newOutput --> ', this.newOutput);
  }
}

async manageOutput(option?: string)
{

  if(undefined==option && undefined!=this.newOutput && ""!+this.newOutput)
  {
    this.outputKeys.push(this.newOutput);
  }
  else
  {
    let indexForRemoval: number = -1;

    let duplicateCheckCounter: number = 0;
    this.outputKeys.forEach((anOutput: string) =>{
      if(anOutput == option)
      {
        indexForRemoval = duplicateCheckCounter;
        }

        duplicateCheckCounter = duplicateCheckCounter + 1;
    })

    await this.outputKeys.splice(indexForRemoval, 1);

  }
}

async createTaskDefn()
{

  if(!this.error_message)
  {
    let aTaskDef: TaskDef = {
      ownerApp: this.ownerApp,
      ownerEmail: this.ownerEmail,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      name: this.name,
      description: this.description,
      timeoutSeconds: this.timeoutSeconds,
      responseTimeoutSeconds: this.responseTimeoutSeconds,
      concurrentExecLimit: this.concurrentExecLimit,
      retryCount: this.retryCount,
      createTime: this.createTime,
      updateTime: this.updateTime,
      timeoutPolicy: 'RETRY',
      retryLogic: 'FIXED',
      retryDelaySeconds: this.retryDelaySeconds,
      rateLimitPerFrequency: this.rateLimitPerFrequency,
      inputKeys: this.inputKeys,
      outputKeys: this.outputKeys
    }

    let timeout_policy_choices: string[] = Object.values(TaskDef.TimeoutPolicyEnum)
    let timeout_policy_keys: string[] = Object.keys(TaskDef.TimeoutPolicyEnum)

    let timeout_policy_choice_index = 0

    timeout_policy_choices.forEach((a_policy: string) => {

      if(a_policy == this.timeoutPolicy)
      {
        aTaskDef.timeoutPolicy = TaskDef.TimeoutPolicyEnum[timeout_policy_keys[timeout_policy_choice_index]]
      }

      timeout_policy_choice_index = timeout_policy_choice_index + 1    
    })

    let retry_logic_choices: string[] = Object.values(TaskDef.RetryLogicEnum)
    let retry_logic_keys: string[] = Object.keys(TaskDef.RetryLogicEnum)

    let retry_logic_choice_index = 0

    retry_logic_choices.forEach((a_logic: string) => {

      if(a_logic == this.retryLogic)
      {
        aTaskDef.retryLogic = TaskDef.RetryLogicEnum[retry_logic_keys[retry_logic_choice_index]]
      }

      retry_logic_choice_index = retry_logic_choice_index + 1    
    })
  
    console.log('Creating Task Definition', JSON.stringify(aTaskDef))
  
    let tasks_list: TaskDef[] = []
  
    tasks_list.push(aTaskDef)
  
    await this.metadataManagementService.registerTaskDef_1(tasks_list).toPromise().then((response: any) => {
      
      if(response)
      {
        this.result = JSON.stringify(response)
      }  
      else
      {
        this.result = 'Task Definition creation successful !'
      }
  
    }).catch((error: any) => {
      console.log(error.message || error);
  
      this.error_message = error.message || error;
    })
  }
}

async task_name_validity_check(){
  await this.metadataManagementService.getTaskDef(this.name.trim()).toPromise().then((a_task_def: TaskDef) => {
    if(undefined != a_task_def && undefined!=a_task_def.name)
    {
      this.error_message = 'Duplicate Task Definition Found. Consider Updating the Task by navigating through View --> Conductor Taskdefs --> Details --> Update.'
    }
  }).catch((err_response: HttpErrorResponse) => {

      if(err_response.status != 404)
      {
        this.error_message = 'Unable to perform Pre-Validation'+err_response.message
      }
      else{
        this.error_message = undefined
      }
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
  })
}

async reset_all_inputs_to_defaults(){

  this.ownerApp = undefined
  this.ownerEmail = undefined
  this.createdBy = "Fillory UI"
  this.updatedBy = undefined
  this.name = undefined
  this.description = undefined
  this.timeoutSeconds = 900
  this.responseTimeoutSeconds = 750
  this.concurrentExecLimit = 10
  this.retryCount = 3
  this.createTime = undefined
  this.updateTime = undefined
  this.timeoutPolicy = 'RETRY'
  this.retryLogic = 'FIXED'
  this.retryDelaySeconds = 5
  this.rateLimitPerFrequency = undefined
  this.rateLimitFrequencyInSeconds = undefined
  this.isolationGroupId = undefined
  this.executionNameSpace = undefined
  this.inputKeys = []
  this.outputKeys = []
  
  this.result = undefined
  this.error_message = undefined

}

set_timeout_policy(policy: string){
  this.timeoutPolicy = policy
}

set_retry_logic(logic: string){
  this.retryLogic = logic
}

}
