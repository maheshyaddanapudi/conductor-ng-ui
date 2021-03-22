import {Component, HostListener, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../theme-options';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  public LOG_AGGREGATOR_ANALYTICS_IFRAME_URL: string


  constructor(public globals: ThemeOptions, private activatedRoute: ActivatedRoute, private router: Router, private navigatorVarHolderService: NavigatorVarHolderService) {
    if(environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL && environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL != 'undefined')
    {
      this.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL = environment.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL
    }
  }

  @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      this.globals.toggleSidebar = true;
    });

    this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }

  async workflow_executions_selection(workflow_status: string){
    this.navigatorVarHolderService.set_workflow_status(workflow_status)
    this.navigatorVarHolderService.set_workflow_details(undefined,undefined)
    
    await this.router.navigateByUrl('buffer', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('reports/workflow-executions', { skipLocationChange: false },).then((fulfilled: boolean) => {
        console.log('Routed')
        });
    }); 
    
    
  }
}
