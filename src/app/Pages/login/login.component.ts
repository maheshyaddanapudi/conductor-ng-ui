import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoAndTokenDataHolderService } from 'src/app/Services/Holders/user-info-and-token-data-holder.service';
import { OauthApiCallerService } from 'src/app/Services/OAuth/oauth-api-caller.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  public username: string
  public password: string

  public validation_error: string

  public error_message: string

  public loading: boolean = false

  constructor(private router: Router, private oauthApiCallerService: OauthApiCallerService, private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService) { }

  async ngOnInit() {

    if(this.userInfoAndTokenDataHolderService.get_access_token() || !environment.OAUTH_ENABLED || 'Y'!=environment.OAUTH_ENABLED)
    {
      await this.router.navigateByUrl('', { skipLocationChange: false },).then((fulfilled: boolean) => {
        console.log('Routed')
        });
    }

  }

  

  async perform_login(){
    
    this.loading = true;

   if(this.validate_form()){
    await this.oauthApiCallerService.login(this.username, this.password).toPromise().then((response) => {
      if(response)
      {
        this.userInfoAndTokenDataHolderService.set_access_token(response['access_token'])
        this.userInfoAndTokenDataHolderService.set_expires_in(response['expires_in'])
        this.userInfoAndTokenDataHolderService.set_refresh_token(response['refresh_token'])
        this.userInfoAndTokenDataHolderService.set_refresh_expires_in(response['refresh_expires_in'])

        this.oauthApiCallerService.userinfo().toPromise().then((userinfo: any) =>{
          userinfo['userAuthentication']['details']['preferred_username']
          this.userInfoAndTokenDataHolderService.set_email(userinfo['userAuthentication']['details']['email'])
          this.userInfoAndTokenDataHolderService.set_first_name(userinfo['userAuthentication']['details']['given_name'])
          this.userInfoAndTokenDataHolderService.set_last_name(userinfo['userAuthentication']['details']['family_name'])
          this.userInfoAndTokenDataHolderService.set_name(userinfo['name'])
          this.userInfoAndTokenDataHolderService.set_roles(userinfo['authorities'])
        })

        if((this.userInfoAndTokenDataHolderService && this.userInfoAndTokenDataHolderService.get_access_token() )|| !environment.OAUTH_ENABLED || 'Y'!=environment.OAUTH_ENABLED)
        {
          
          this.router.navigateByUrl('dashboard/workflow-dashboard', { skipLocationChange: false },).then((fulfilled: boolean) => {
            console.log('Routed')
            });
        }

        else{
          this.error_message = 'Unhandled Error . Please verify with UI Admin.'
        }
      }
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.error.error_description
      console.log('Response ', JSON.stringify(err_response))
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    });
   }

    this.loading = false
  }

  validate_form(): boolean{
    if(this.username && this.password)
    {
      return true
    }
    else
    {
      if(!this.username)
      {
        this.validation_error = 'Please enter a valid Username / Email'
      }
      else if(!this.password){
        this.validation_error = 'Please enter a valid password'
      }

      let validation_error_timer = setTimeout(()=>{
        this.validation_error = undefined
        clearTimeout(validation_error_timer)
      }, 5000)

      return false
    }
  }

}
