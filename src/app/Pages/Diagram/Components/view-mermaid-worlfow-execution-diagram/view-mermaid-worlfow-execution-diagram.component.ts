import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import mermaid from 'mermaid';

@Component({
  selector: 'app-view-mermaid-worlfow-execution-diagram',
  templateUrl: './view-mermaid-worlfow-execution-diagram.component.html',
  styleUrls: []
})
export class ViewMermaidWorlfowExecutionDiagramComponent implements AfterContentInit {

  @ViewChild("mermaid", { static: true})
  public mermaidDiv;

  @Input()
  graph_def_array: string[]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public ngAfterContentInit(): void {
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
     this.route_to_home()
   }
}

async route_to_home(){
  await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
    console.log('Routed')
    });
}
}
