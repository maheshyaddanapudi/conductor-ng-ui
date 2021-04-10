import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import mermaid from 'mermaid';
import { MetadataManagementService, Workflow, WorkflowDef, WorkflowManagementService } from 'src/app/Rest/Conductor';
import { WorkflowExecutionJsonMermaidConverterService } from 'src/app/Services/Converters/workflow-execution-json-mermaid-converter.service';

@Component({
  selector: 'app-view-mermaid-workflow-execution-diagram',
  templateUrl: './view-mermaid-workflow-execution-diagram.component.html',
  styleUrls: []
})
export class ViewMermaidWorkflowExecutionDiagramComponent implements AfterContentInit {

  @ViewChild("mermaid", { static: true })
  public mermaidDiv;

  @Input()
  graph_def_array: string[]

  public workflow_name: string
  public workflow_version: number
  public workflow_id: string
  public workflow_def: WorkflowDef
  public workflow_execution: Workflow

  public error_message: string

  constructor(private router: Router, private route: ActivatedRoute, private workflowExecutionJsonMermaidConverterService: WorkflowExecutionJsonMermaidConverterService, private metadataManagementService: MetadataManagementService, private workflowManagementService: WorkflowManagementService) { }

  async ngOnInit() {
    console.log('Initialized Workflow Execution Diagram')

    
  }

  public async ngAfterContentInit() {

    if(!this.graph_def_array){
      await this.route.queryParams.subscribe(params => {
        console.log(params)
        this.workflow_name = params['workflow_name']
        this.workflow_version = Number.parseInt(params['workflow_version'])
        this.workflow_id = params['workflow_id']
      });

      await this.metadataManagementService.get(this.workflow_name, this.workflow_version).toPromise().then(async (workflowDef: WorkflowDef) => {
        this.workflow_def = workflowDef
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      })
  
      await this.workflowManagementService.getExecutionStatus(this.workflow_id).toPromise().then((workflow: Workflow) => {
        this.workflow_execution = workflow
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      })

      console.log('Workflow Def Obtained', JSON.stringify(this.workflow_def))
      console.log('Workflow Exe Obtained', JSON.stringify(this.workflow_execution))

      this.graph_def_array = this.workflowExecutionJsonMermaidConverterService.convert(this.workflow_def, this.workflow_execution)
    }

    mermaid.initialize({
        theme: "default"
    });

    const element: any = this.mermaidDiv.nativeElement;
    
    let graph_def = '';
    
    if(!this.graph_def_array && localStorage.getItem('fillory-ui-buffer_graph_def_array'))
    {
      this.graph_def_array = JSON.parse(localStorage.getItem('fillory-ui-buffer_graph_def_array'));
      localStorage.removeItem('fillory-ui-buffer_graph_def_array');
    }

    this.graph_def_array.forEach((a_line: string) => {
      graph_def = graph_def + a_line + '\n'
    })
    
   if(graph_def)
   {
     console.log('graph_def', graph_def)
      mermaid.render("graphDiv", graph_def, (svgCode, bindFunctions) => {
        element.innerHTML = svgCode;
    });
   }
   else
   {
     console.log(this.graph_def_array)
     this.route_to_home()
   }
}

async route_to_home(){
  await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
    console.log('Routed')
    });
}
}
