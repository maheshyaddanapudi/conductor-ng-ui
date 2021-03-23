import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInfoAndTokenDataHolderService } from '../Holders/user-info-and-token-data-holder.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelperService = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class OauthApiCallerService {

  private oauth_token_url: string
  private oauth_userinfo_url: string
  private oauth_logout_url: string
  private client_id: string
  private client_secret: string
  

  constructor(public jwtHelper: JwtHelperService, private httpClient: HttpClient, private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService) { 

    this.client_id = environment.OAUTH_CLIENT_ID
    this.client_secret = environment.OAUTH_CLIENT_SECRET
    this.oauth_token_url = environment.OAUTH_TOKEN_URL
    this.oauth_userinfo_url = environment.OAUTH_USER_INFO_URL
    this.oauth_logout_url = environment.OAUTH_LOGOUT_URL
  }

   login(username: string, password: string){

    const payload = new HttpParams()
    .set('client_id', this.client_id)
    .set('client_secret', this.client_secret)
    .set('grant_type', 'password')
    .set('username', username)
    .set('password', password);
    
    return this.httpClient.post(this.oauth_token_url, payload);
  }

  logout(){
    
    const payload = new HttpParams()
    .set('client_id', this.client_id)
    .set('refresh_token', this.userInfoAndTokenDataHolderService.get_refresh_token());
    //console.log('Logging Out', this.userInfoAndTokenDataHolderService.get_refresh_token())
    return this.httpClient.post(this.oauth_logout_url, payload);
  }

  userinfo(){
    return this.httpClient.get(this.oauth_userinfo_url);
  }

  refresh_access_token(){
    const payload = new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('client_id', this.client_id)
    .set('refresh_token', this.userInfoAndTokenDataHolderService.get_refresh_token());
    console.log('Refreshing Access Token ...')
    return this.httpClient.post(this.oauth_token_url, payload);
  }

  public isAuthenticated(): boolean {
    const token = this.userInfoAndTokenDataHolderService.get_access_token();
    console.log('isAuthenticated Access Token', token)
    console.log('Refresh Token Value', this.userInfoAndTokenDataHolderService.get_refresh_token())
    if((!token || token == undefined) && jwtHelperService.isTokenExpired(token) && (!this.userInfoAndTokenDataHolderService.get_refresh_token() || this.userInfoAndTokenDataHolderService.get_refresh_token() == undefined))
    {
      return false
    }
    else
    {

      console.log('Refresh Token Value', this.userInfoAndTokenDataHolderService.get_refresh_token())
      return true
    }
  }
}
