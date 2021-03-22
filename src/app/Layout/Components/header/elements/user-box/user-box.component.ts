import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoAndTokenDataHolderService } from 'src/app/Services/Holders/user-info-and-token-data-holder.service';
import { OauthApiCallerService } from 'src/app/Services/OAuth/oauth-api-caller.service';
import {ThemeOptions} from '../../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  constructor(public globals: ThemeOptions, private router: Router, private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService, private oauthApiCallerService: OauthApiCallerService) {
  }

  ngOnInit() {
  }

  logout(){
    this.oauthApiCallerService.logout().toPromise().then((response)=>{
      this.userInfoAndTokenDataHolderService.unset_all();
      this.router.navigateByUrl('login', { skipLocationChange: false }).then((fulfilled: boolean) => {
        console.log('Routed')
        }).catch((err_response: HttpErrorResponse) => {
          console.log('Response Meassage - ', err_response.message)
          console.log('Response Code - ', err_response.status)
          console.log('Response Status - ', err_response.statusText)
          console.log('Response Error - ', err_response.error)
        })
    })
  }

}
