import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment'

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public server_swagger_url: string;

    ngOnInit(): void {

      console.log('Server Swagger Configuration JSON', environment.WF_SERVER+'/swagger.json')

      this.server_swagger_url = environment.WF_SERVER.slice(0, environment.WF_SERVER.length - 4)
      
      const ui = SwaggerUIBundle(
        {
            dom_id: '#swagger-ui',
            deepLinking: false,
            docExpansion: 'none',
            displayRequestDuration: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset,
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "BaseLayout", 
            supportedSubmitMethods: [],
            url: environment.WF_SERVER+'/api-docs',
      });
      
    }

    constructor(private modalService: NgbModal) {}

    openXLarge(content) {
      this.modalService.open(content, {
        modalDialogClass: 'modal-x-large',
        size: 'xl'
      });
    }
  }
