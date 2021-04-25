import { Injectable } from '@angular/core';
import { WorkflowDef, WorkflowTask } from 'src/app/Rest/Conductor';


@Injectable({
  providedIn: 'root'
})
export class WorkflowJsonMermaidConverterService {

  private LABEL: string = ">REPLACE_THIS_PLACEHOLDER]"
  private CIRCLE: string = "((REPLACE_THIS_PLACEHOLDER))"
  private OVAL: string = "([REPLACE_THIS_PLACEHOLDER])"
  private RECTANGLE: string = "[REPLACE_THIS_PLACEHOLDER]"
  private RECTANGLE_ROUNDED: string = "(REPLACE_THIS_PLACEHOLDER)"
  private RHOMBUS: string = "{REPLACE_THIS_PLACEHOLDER}"
  private HEXAGON: string = "{{REPLACE_THIS_PLACEHOLDER}}"
  private SUB_ROUTINE: string = "[[REPLACE_THIS_PLACEHOLDER]]"
  private PARALLELOGRAM: string ="[/REPLACE_THIS_PLACEHOLDER/]"
  private TRAPEZOID: string = "[/REPLACE_THIS_PLACEHOLDER\\]"
  private ARROW: string = "-->"
  private ARROW_DOTTED: string = ".->"
  private ARROW_TEXT: string = "|REPLACE_THIS_PLACEHOLDER|"

  private REPLACE_THIS_PLACEHOLDER: string = "REPLACE_THIS_PLACEHOLDER"

  private LINE_SEPERATOR: string = " \\n "

  constructor() { }

  convert(workflow_def: WorkflowDef): string[]
  {
    let graph_def_array: string[] = []

    let graph_def = "graph TD"

    // Adding label

    //graph_def = graph_def + this.LINE_SEPERATOR + 'L' + this.LABEL.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_def.name + '::' + workflow_def.version)

    // Starting Workflow

    graph_def = graph_def + this.LINE_SEPERATOR + 'A' + this.CIRCLE.replace(this.REPLACE_THIS_PLACEHOLDER, 'Start') 

    console.log('Main Graph Init',graph_def)
    
    let workflow_task_counter = 1;

    workflow_def.tasks.forEach((workflow_task: WorkflowTask) => {

      console.log(workflow_task_counter, workflow_task.type, workflow_task.taskReferenceName)

      let task_graph = this.recursive_converter(workflow_task)

      console.log('Task Graph Final',task_graph)

      if(workflow_def.tasks[workflow_task_counter-2] && ( workflow_def.tasks[workflow_task_counter-2].type == 'DECISION' || workflow_def.tasks[workflow_task_counter-2].type == 'FORK_JOIN' ) )
      {
        if(workflow_def.tasks[workflow_task_counter-2].type == 'DECISION')
        {
          graph_def = graph_def + this.LINE_SEPERATOR
        }
        if(workflow_def.tasks[workflow_task_counter-2].type == 'FORK_JOIN')
        {
          graph_def = graph_def + task_graph + this.LINE_SEPERATOR
        }
      }
      else if(workflow_task.type == 'DO_WHILE' && workflow_task_counter == 1)
      {
        graph_def = graph_def + this.ARROW_DOTTED + task_graph + this.LINE_SEPERATOR
      }
      else
      {
        graph_def = graph_def + this.ARROW + task_graph + this.LINE_SEPERATOR
      }

      console.log('Main Graph Updated 1',graph_def)

      let task_type = workflow_task.type

      if(
        task_type != 'FORK_JOIN' &&
        task_type != 'DECISION' &&
        task_type != 'FORK_JOIN_DYNAMIC' &&
        task_type != 'DO_WHILE' 
      )
      {
        graph_def = graph_def + workflow_task.taskReferenceName
      }
      else
      {
        if(task_type == 'DECISION' && workflow_task_counter < workflow_def.tasks.length)
        {
          const keys = Object.keys(workflow_task.decisionCases)

          keys.forEach((a_key: string) => {
            let branch = workflow_task.decisionCases[a_key]
            graph_def = graph_def + this.LINE_SEPERATOR + branch[branch.length-1].taskReferenceName + this.ARROW_DOTTED + workflow_def.tasks[workflow_task_counter].taskReferenceName
          })
        }
      }

      console.log('Main Graph Updated 2',graph_def)

      workflow_task_counter = workflow_task_counter + 1
    })

    if(workflow_def.tasks[workflow_def.tasks.length-1].type == 'DECISION')
    {
      const keys = Object.keys(workflow_def.tasks[workflow_def.tasks.length-1].decisionCases)

      keys.forEach((a_key: string) => {
        let branch = workflow_def.tasks[workflow_def.tasks.length-1].decisionCases[a_key]
         graph_def = graph_def + this.LINE_SEPERATOR + branch[branch.length-1].taskReferenceName + this.ARROW_DOTTED + 'Z' + this.CIRCLE.replace(this.REPLACE_THIS_PLACEHOLDER, 'Stop') 
      })
    }
    else if(workflow_def.tasks[workflow_def.tasks.length-1].type == 'DO_WHILE')
    {
      let last_task_index: number = workflow_def.tasks[workflow_def.tasks.length-1].loopOver.length - 1
      graph_def = graph_def + workflow_def.tasks[workflow_def.tasks.length-1].loopOver[last_task_index].taskReferenceName + this.ARROW_DOTTED + 'Z' + this.CIRCLE.replace(this.REPLACE_THIS_PLACEHOLDER, 'Stop')
    }
    else
    {
      graph_def = graph_def + this.ARROW + 'Z' + this.CIRCLE.replace(this.REPLACE_THIS_PLACEHOLDER, 'Stop')
    }

    console.log('Main Graph Final',graph_def)

    graph_def_array = graph_def.split(' \\n ')

    console.log(JSON.stringify(graph_def_array))
   
    return graph_def_array
  }

  recursive_converter(workflow_task: WorkflowTask): string{

    let graph_def: string = ""

    let task_type = workflow_task.type

    if(
      task_type != 'FORK_JOIN' &&
      task_type != 'DECISION' &&
      task_type != 'FORK_JOIN_DYNAMIC' &&
      task_type != 'DO_WHILE' &&
      task_type != 'JOIN' &&
      task_type != 'EXCLUSIVE_JOIN' 
    )
    {
      graph_def = this.draw_simpler_tasks_graph(workflow_task)
    }
    else if (
      task_type == 'FORK_JOIN' ||
      task_type == 'DECISION' ||
      task_type == 'FORK_JOIN_DYNAMIC' ||
      task_type == 'DO_WHILE' ||
      task_type == 'JOIN' ||
      task_type == 'EXCLUSIVE_JOIN'
    )
    {
      graph_def = this.draw_complex_tasks_graph(workflow_task)
    }
    else{

    }
    return graph_def;

  }

  draw_simpler_tasks_graph(workflow_task: WorkflowTask): string{
    let task_type = workflow_task.type
    let graph_def = ""
    switch(task_type){
      case 'SIMPLE':
        graph_def = workflow_task.taskReferenceName + this.RECTANGLE.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      case 'DYNAMIC':
        graph_def = workflow_task.taskReferenceName + this.RECTANGLE.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      case 'SUB_WORKFLOW':
        graph_def = workflow_task.taskReferenceName + this.SUB_ROUTINE.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      case 'WAIT':
        graph_def = workflow_task.taskReferenceName + this.TRAPEZOID.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) 
        break
      case 'LAMBDA':
        graph_def = workflow_task.taskReferenceName + this.PARALLELOGRAM.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      case 'KAFKA_PUBLISH':
        graph_def = workflow_task.taskReferenceName + this.PARALLELOGRAM.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      case 'TERMINATE':
        graph_def = workflow_task.taskReferenceName + this.HEXAGON.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) 
        break
      case 'SET_VARIABLE':
        graph_def = workflow_task.taskReferenceName + this.RECTANGLE_ROUNDED.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
      default:
        graph_def = workflow_task.taskReferenceName + this.RECTANGLE.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name)
        break
    }

    return graph_def
  }

  draw_complex_tasks_graph(workflow_task: WorkflowTask): string{

    let graph_def = ""

    let task_type = workflow_task.type

    switch(task_type){
      case 'DECISION':
        graph_def = this.draw_decision_task_graph(workflow_task)
        break
      case 'FORK_JOIN':
        graph_def = this.draw_fork_task_graph(workflow_task)
        break
      case 'FORK_JOIN_DYNAMIC':
        graph_def = this.draw_fork_dynamic_task_graph(workflow_task)
        break
      case 'DO_WHILE':
        graph_def = this.draw_do_while_task_graph(workflow_task)
        break
      case 'JOIN':
        graph_def = this.draw_join_task_graph(workflow_task)
        break
      case 'EXCLUSIVE_JOIN':
        graph_def = this.draw_exclusive_join_task_graph(workflow_task)
        break
      default:
        break
    }

    return graph_def
  }

  draw_decision_task_graph(workflow_task: WorkflowTask): string {

    let graph_def = ""

    let decision_graph: string = workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + "subgraph " + workflow_task.type+'_'+workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + workflow_task.taskReferenceName.replace(' ','_') + this.RHOMBUS.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR + "end"

    console.log('Decision Graph Init',decision_graph)

    let decisionCases: { [key: string]: Array<WorkflowTask>; } = workflow_task.decisionCases

    const keys: string[] = Object.keys(decisionCases)

    keys.forEach((key: string) => {

      let branch_graph: string = "subgraph " + workflow_task.taskReferenceName.replace(' ','_') + '_' + key.replace(' ','_') + ' ['+key+']' + this.LINE_SEPERATOR

      branch_graph = branch_graph + workflow_task.taskReferenceName.replace(' ','_') 

      console.log('Branch Graph Init',branch_graph)

      let sub_tasks_list: WorkflowTask[] = decisionCases[key]

      let sub_task_counter = 1 ;

        sub_tasks_list.forEach((sub_task: WorkflowTask)=> {

          let sub_task_graph = this.recursive_converter(sub_task)

          console.log('Sub Task Graph', sub_task_graph)

          if(sub_task_counter == 1)
          {
            branch_graph = branch_graph + this.ARROW_DOTTED + sub_task_graph + this.LINE_SEPERATOR
          }
          else if(sub_tasks_list[sub_task_counter-2] && ( sub_tasks_list[sub_task_counter-2].type == 'DECISION' || sub_tasks_list[sub_task_counter-2].type == 'FORK_JOIN' ) )
          {
            if(sub_tasks_list[sub_task_counter-2].type == 'DECISION')
            {
              branch_graph = branch_graph + this.LINE_SEPERATOR
            }
            if(sub_tasks_list[sub_task_counter-2].type == 'FORK_JOIN')
            {
              branch_graph = branch_graph + sub_task_graph + this.LINE_SEPERATOR
            }
          }
          else
          {
            branch_graph = branch_graph + this.ARROW + sub_task_graph + this.LINE_SEPERATOR
          }

          let task_type = workflow_task.type

          if(
            task_type != 'FORK_JOIN' &&
            task_type != 'DECISION' &&
            task_type != 'FORK_JOIN_DYNAMIC' 
            && sub_task_counter < sub_tasks_list.length
          )
          {
            branch_graph = branch_graph + workflow_task.taskReferenceName + this.ARROW
          }

          sub_task_counter = sub_task_counter + 1

          console.log('Updated Branch Graph', branch_graph)

        })

      branch_graph = branch_graph + "end"

      console.log('Final Branch Graph', branch_graph)

      decision_graph = decision_graph + this.LINE_SEPERATOR + branch_graph

      console.log('Updated Decision Graph', decision_graph)
    })

    graph_def = decision_graph;

    return graph_def
  }

  draw_fork_task_graph(workflow_task: WorkflowTask): string{

    let graph_def = ""

    let fork_graph: string = workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + "subgraph " + workflow_task.type+'_'+workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + workflow_task.taskReferenceName.replace(' ','_') + this.RHOMBUS.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR + "end"

      console.log('Fork Graph Init',fork_graph)

      let branch_counter: number = 1

      workflow_task.forkTasks.forEach((sub_tasks_list: WorkflowTask[]) => {

        let branch_graph: string = "subgraph " + workflow_task.taskReferenceName.replace(' ','_') + '_' + branch_counter + ' ['+branch_counter+']' + this.LINE_SEPERATOR

        branch_graph = branch_graph + workflow_task.taskReferenceName.replace(' ','_') 

        console.log('Branch Graph Init',branch_graph)

        let sub_task_counter = 1 ;

          sub_tasks_list.forEach((sub_task: WorkflowTask)=> {

            let sub_task_graph = this.recursive_converter(sub_task)

            console.log('Sub Task Graph', sub_task_graph)

            if(sub_task_counter == 1)
            {
              branch_graph = branch_graph + this.ARROW_DOTTED + sub_task_graph + this.LINE_SEPERATOR
            }
            else if(sub_tasks_list[sub_task_counter-2] && ( sub_tasks_list[sub_task_counter-2].type == 'DECISION' || sub_tasks_list[sub_task_counter-2].type == 'FORK_JOIN' ) )
            {
              if(sub_tasks_list[sub_task_counter-2].type == 'DECISION')
              {
                branch_graph = branch_graph + this.LINE_SEPERATOR
              }
              if(sub_tasks_list[sub_task_counter-2].type == 'FORK_JOIN')
              {
                branch_graph = branch_graph + sub_task_graph + this.LINE_SEPERATOR
              }
            }
            else
            {
              branch_graph = branch_graph + this.ARROW + sub_task_graph + this.LINE_SEPERATOR
            }

            let task_type = sub_task.type

            if(
              task_type != 'FORK_JOIN' &&
              task_type != 'DECISION' &&
              task_type != 'FORK_JOIN_DYNAMIC' 
              && sub_task_counter < sub_tasks_list.length
            )
            {
              branch_graph = branch_graph + sub_task.taskReferenceName
            }

            sub_task_counter = sub_task_counter + 1

            console.log('Updated Branch Graph', branch_graph)

          })

          branch_graph = branch_graph + "end"

          console.log('Final Branch Graph', branch_graph)

          fork_graph = fork_graph + this.LINE_SEPERATOR + branch_graph

          console.log('Updated Fork Graph', fork_graph)

          branch_counter = branch_counter +  1
      })

      graph_def = fork_graph;

      return graph_def
  }

  draw_fork_dynamic_task_graph(workflow_task: WorkflowTask): string{

    let graph_def = ""

    let fork_dynamic_graph: string = workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + "subgraph " + workflow_task.type+'_'+workflow_task.taskReferenceName.replace(' ','_') + this.LINE_SEPERATOR + workflow_task.taskReferenceName.replace(' ','_') + this.RHOMBUS.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR + "end"

      console.log('Fork Dynamic Graph Init',fork_dynamic_graph)

      graph_def = fork_dynamic_graph;

      return graph_def;
  }

  draw_do_while_task_graph(workflow_task: WorkflowTask): string{
    let graph_def = ""

    let do_while_graph: string = this.LINE_SEPERATOR + "subgraph " + workflow_task.type+'_'+workflow_task.taskReferenceName.replace(' ','_') + ' [DO WHILE]' + this.LINE_SEPERATOR

      console.log('Do While Graph Init',do_while_graph)

      let sub_task_counter = 1 ;

      workflow_task.loopOver.forEach((sub_task: WorkflowTask) => {

          let sub_task_graph = this.recursive_converter(sub_task)

          console.log('Sub Task Graph', sub_task_graph)

          if(sub_task_counter == 1)
          {
            do_while_graph = sub_task.taskReferenceName + this.LINE_SEPERATOR + do_while_graph 
          }
          else if(workflow_task.loopOver[sub_task_counter-2] && ( workflow_task.loopOver[sub_task_counter-2].type == 'DECISION' || workflow_task.loopOver[sub_task_counter-2].type == 'FORK_JOIN' ) )
          {
            if(workflow_task.loopOver[sub_task_counter-2].type == 'DECISION')
            {
              do_while_graph = do_while_graph + this.LINE_SEPERATOR
            }
            if(workflow_task.loopOver[sub_task_counter-2].type == 'FORK_JOIN')
            {
              do_while_graph = do_while_graph + sub_task_graph + this.LINE_SEPERATOR
            }
          }
          else
          {
            do_while_graph = do_while_graph + this.ARROW + sub_task_graph + this.LINE_SEPERATOR
          }

          let task_type = sub_task.type

          if(
            task_type != 'FORK_JOIN' &&
            task_type != 'DECISION' &&
            task_type != 'FORK_JOIN_DYNAMIC' 
            && sub_task_counter < workflow_task.loopOver.length
          )
          {
            do_while_graph = do_while_graph + sub_task.taskReferenceName
          }

          sub_task_counter = sub_task_counter + 1

          console.log('Updated Do While Graph', do_while_graph)
      })

      do_while_graph = do_while_graph + "end"

      console.log('Final Do While Graph', do_while_graph)

      graph_def = do_while_graph

      return graph_def;
  }

  draw_join_task_graph(workflow_task: WorkflowTask): string{
    let join_graph = ""

      console.log('Join Graph Init', join_graph)

      workflow_task.joinOn.forEach((task_ref_name: string) => {
        join_graph = join_graph + task_ref_name + this.ARROW + workflow_task.taskReferenceName + this.OVAL.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR
        console.log('Join Graph Updated', join_graph)
      })

      console.log('Join Graph Final', join_graph)

    return join_graph
  }

  draw_exclusive_join_task_graph(workflow_task: WorkflowTask): string{
    let exclusive_join_graph = ""

      console.log('Exclusive Join Graph Init', exclusive_join_graph)

      workflow_task.joinOn.forEach((task_ref_name: string) => {
        exclusive_join_graph = exclusive_join_graph + task_ref_name + this.ARROW + workflow_task.taskReferenceName + this.OVAL.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR
        console.log('Exclusive Join Graph Updated 1', exclusive_join_graph)
      })

      workflow_task.defaultExclusiveJoinTask.forEach((task_ref_name: string) => {
        exclusive_join_graph = exclusive_join_graph + task_ref_name + this.ARROW_DOTTED + workflow_task.taskReferenceName + this.OVAL.replace(this.REPLACE_THIS_PLACEHOLDER, workflow_task.name) + this.LINE_SEPERATOR
        console.log('Exclusive Join Graph Updated 2', exclusive_join_graph)
      })

      console.log('Exclusive Join Graph Final', exclusive_join_graph)

      return exclusive_join_graph
  }


}
