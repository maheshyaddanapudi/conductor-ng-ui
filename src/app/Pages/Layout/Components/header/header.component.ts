import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorVarHolderService } from 'src/app/Services/Holders/navigator-var-holder.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {

  public now: Date = new Date();
  public current_date_time_interval_holder: any

  constructor(private router: Router, private navigatorVarHolderService: NavigatorVarHolderService) { 

    this.current_date_time_interval_holder = setInterval(() => {
      this.now = new Date();
    }, 1);

  }

  async ngOnInit() {

  }

  async ngOnDestroy(){
    await clearInterval(this.current_date_time_interval_holder);
  }

  async workflow_executions_selection(workflow_status: string){
    this.navigatorVarHolderService.set_workflow_status(workflow_status)
    this.navigatorVarHolderService.set_workflow_details(undefined,undefined)
    
    await this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('view-workflow-executions', { skipLocationChange: true },).then((fulfilled: boolean) => {
        console.log('Routed')
        });
    }); 
    
    
  }

}
