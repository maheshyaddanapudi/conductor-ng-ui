import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import mermaid from 'mermaid';
import { MetadataManagementService, WorkflowDef } from 'src/app/Rest/Conductor';
import { WorkflowJsonMermaidConverterService } from 'src/app/Services/Converters/workflow-json-mermaid-converter.service';

@Component({
  selector: 'app-view-mermaid-workflow-diagram',
  templateUrl: './view-mermaid-workflow-diagram.component.html',
  styleUrls: []
})
export class ViewMermaidWorkflowDiagramComponent implements AfterContentInit {

  @ViewChild("mermaid")
  public mermaidDiv;

  @Input()
  graph_def_array?: string[]

  public workflow_name: string
  public workflow_version: number

  public error_message: string

  constructor(private route: ActivatedRoute, private router: Router, private workflowJsonMermaidConverterService: WorkflowJsonMermaidConverterService, private metadataManagementService: MetadataManagementService) { }

  async ngOnInit() {
    
  }

  public async ngAfterContentInit() {

    if(!this.graph_def_array){
      await this.route.queryParams.subscribe(params => {
        console.log(params)
        this.workflow_name = params['workflow_name']; 
        this.workflow_version = Number.parseInt(params['workflow_version']); 
      });
    }

    if(!this.graph_def_array && this.workflow_name && this.workflow_version > -1){
          
      await this.metadataManagementService.get(this.workflow_name, this.workflow_version).toPromise().then(async (workflowDef: WorkflowDef) => {
        this.graph_def_array = await this.workflowJsonMermaidConverterService.convert(workflowDef)
      }).catch((err_response: HttpErrorResponse) => {
        this.error_message = err_response.message
        console.log('Response Code - ', err_response.status)
        console.log('Response Status - ', err_response.statusText)
        console.log('Response Error - ', err_response.error)
      })
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

    if(this.graph_def_array)
    {
      this.graph_def_array.forEach((a_line: string) => {
        graph_def = graph_def + a_line + '\n'
      })
    }
    
   if(graph_def)
   {
     console.log('graph_def', graph_def)
      mermaid.render("graphDiv", graph_def, (svgCode, bindFunctions) => {
        element.innerHTML = svgCode;
    });
   }
   else
   {
     this.route_to_home()
   }
  }

  async route_to_home(){
    await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
      console.log('Routed')
      });
  }
}
