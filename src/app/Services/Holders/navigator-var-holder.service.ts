import { Injectable } from '@angular/core';
import { WorkflowTask } from 'src/app/Rest/Conductor';

@Injectable({
  providedIn: 'root'
})
export class NavigatorVarHolderService {

  private workflow_name: string
  private workflow_version: number
  private workflow_id: string
  private task_name: string
  private workflow_status: string
  private graph_def_array: string[]
  private workflow_tasks: WorkflowTask[]
  private workflow_input_params: string[]

  constructor() { 

  }

  set_workflow_input_params(inputKeys: string[]){
    this.workflow_input_params = inputKeys
  }

  get_workflow_input_params()
  {
    return this.workflow_input_params
  }

  unset_workflow_input_params(){
    this.workflow_input_params = []
  }

  set_workflow_tasks(workflow_tasks: WorkflowTask[])
  {
    this.workflow_tasks = workflow_tasks
  }

  get_workflow_tasks(): WorkflowTask[]{
    return this.workflow_tasks
  }

  unset_workflow_tasks(){
    this.workflow_tasks = []
  }

  set_workflow_status(workflow_status: string){
    this.workflow_status = workflow_status
  }

  get_workflow_status():string {
    return this.workflow_status
  }

  set_graph_def_array(graph_def_array: string[]){
    this.graph_def_array = graph_def_array
  }

  get_graph_def_array(): string[]{
    return this.graph_def_array
  }

  set_task_name(task_name: string){
    this.task_name = task_name
  }

  get_task_name(): string{
    return this.task_name 
  }

  set_workflow_id(workflow_id: string){
    this.workflow_id = workflow_id
  }

  get_workflow_id(): string{
    return this.workflow_id
  }

  set_workflow_details(workflow_name: string, workflow_version: number){
    this.workflow_name = workflow_name
    this.workflow_version = workflow_version
  }

  get_workflow_name(): string{
    return this.workflow_name
  }

  get_workflow_version(): number{
    return this.workflow_version
  }
}
