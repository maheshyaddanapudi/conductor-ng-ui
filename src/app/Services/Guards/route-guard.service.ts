import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OauthApiCallerService } from '../OAuth/oauth-api-caller.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{

  constructor(private oauthApiCallerService: OauthApiCallerService, private router: Router) {

   }

   canActivate(): boolean {
    if (environment.OAUTH_ENABLED && 'Y' == environment.OAUTH_ENABLED && !this.oauthApiCallerService.isAuthenticated()) {
      this.router.navigate(['login']);
      //return false;
    }
    else{

    }
    return true;
  }
}
