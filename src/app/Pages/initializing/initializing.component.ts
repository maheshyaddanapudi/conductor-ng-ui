import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoAndTokenDataHolderService } from 'src/app/Services/Holders/user-info-and-token-data-holder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-initializing',
  templateUrl: './initializing.component.html',
  styleUrls: []
})
export class InitializingComponent implements OnInit {

  constructor(private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService, private router: Router) { }

  ngOnInit() {

    if(this.userInfoAndTokenDataHolderService.get_access_token() || !environment.OAUTH_ENABLED || 'Y'!=environment.OAUTH_ENABLED)
    {
      console.log('Found')
      //dashboard/workflow-dashboard
      this.router.navigateByUrl('home', { skipLocationChange: false }).then((fulfilled: boolean) => {
        console.log('Routed')
        });
    }
    else
    {
      console.log('Not Found')
      this.router.navigateByUrl('login', { skipLocationChange: false }).then((fulfilled: boolean) => {
        console.log('Routed')
        });
    }
  }

}
