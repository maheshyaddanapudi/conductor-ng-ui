import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataResourceService, TaskDef } from 'src/app/Rest/Conductor';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service'; 

@Component({
  selector: 'app-update-task-definition',
  templateUrl: './update-task-definition.component.html',
  styleUrls: []
})
export class UpdateTaskDefinitionComponent implements OnInit {

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

  private task_def: TaskDef

  public result: string;
  public error_message: string;

  constructor(private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private metadataManagementService: MetadataResourceService, private navigatorVarHolderService: NavigatorVarHolderService) { 
    this.inputKeys = [];
    this.outputKeys = [];
  }

  async ngOnInit() {

    let task_name = undefined

    await this.route.queryParams.subscribe(params => {
      console.log(params)
      task_name = params['task_name'];   
    });

    if(task_name)
    {
      await this.metadataManagementService.getTaskDef(task_name).toPromise().then((task_def: TaskDef)=>{
        this.task_def = task_def
      })
    }

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

async updateTaskDefn()
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

  await this.metadataManagementService.registerTaskDef1(aTaskDef).toPromise().then((response: any) => {
    
    if(response)
    {
      this.result = JSON.stringify(response)
    }  
    else
    {
      this.result = 'Task Definition successfully updated !'
    }

    this.task_def = aTaskDef

  }).catch((error: any) => {
    console.log(error.message || error);

    this.error_message = error.message || error;
  })


}

async reset_all_inputs_to_defaults(){

  this.ownerApp = this.task_def.ownerApp
  this.ownerEmail = this.task_def.ownerEmail
  this.createdBy = this.task_def.createdBy
  this.updatedBy = this.task_def.updatedBy
  this.name = this.task_def.name
  this.description = this.task_def.description
  this.timeoutSeconds = this.task_def.timeoutSeconds
  this.responseTimeoutSeconds = this.task_def.responseTimeoutSeconds
  this.concurrentExecLimit = this.task_def.concurrentExecLimit
  this.retryCount = this.task_def.retryCount
  this.createTime = this.task_def.createTime
  this.updateTime = this.task_def.updateTime
  this.timeoutPolicy = this.task_def.timeoutPolicy
  this.retryLogic = this.task_def.retryLogic
  this.retryDelaySeconds = this.task_def.retryDelaySeconds
  this.rateLimitPerFrequency = this.task_def.rateLimitPerFrequency
  this.rateLimitFrequencyInSeconds = this.task_def.rateLimitFrequencyInSeconds
  this.isolationGroupId = this.task_def.isolationGroupId
  this.executionNameSpace = this.task_def.executionNameSpace
  this.inputKeys = this.task_def.inputKeys
  this,this.outputKeys = this.task_def.outputKeys
  
  this.result = undefined
  this.error_message = undefined

}

set_timeout_policy(policy: string){
  this.timeoutPolicy = policy
}

set_retry_logic(logic: string){
  this.retryLogic = logic
}

async back_to_task_detail(){
  await this.router.navigateByUrl('view/task-definition-detail?task_name='+this.task_def.name, { skipLocationChange: false },).then((fulfilled: boolean) => {
    console.log('Routed')
    });
}

}
