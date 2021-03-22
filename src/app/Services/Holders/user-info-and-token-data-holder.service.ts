import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoAndTokenDataHolderService {

  private username: string
  private name: string
  private first_name: string
  private last_name: string
  private email: string
  private roles: any[]

  private access_token: string
  private expires_in: number
  private refresh_token: string
  private refresh_expires_in: number

  constructor() { }

  unset_all(){
    localStorage.removeItem('conductor_ng_ui-oauth-username')
    localStorage.removeItem('conductor_ng_ui-oauth-name')
    localStorage.removeItem('conductor_ng_ui-oauth-email')
    localStorage.removeItem('conductor_ng_ui-oauth-roles')
    this.username = undefined
    this.name = undefined
    this.first_name = undefined
    this.last_name = undefined
    this.email = undefined
    this.roles = undefined

    localStorage.removeItem('conductor_ng_ui-oauth-access_token')
    localStorage.removeItem('conductor_ng_ui-oauth-expires_in')
    localStorage.removeItem('conductor_ng_ui-oauth-refresh_expires_in')
    localStorage.removeItem('conductor_ng_ui-oauth-refresh_token')
    this.access_token = undefined
    this.expires_in = 0
    this.refresh_token = undefined
    this.refresh_expires_in = 0
  }

  get_username(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-username'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-username')
    }
    else{
      return this.username
    }
  }

  get_name(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-name'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-name')
    }
    else{
      return this.name
    }
  }

  get_first_name(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-first_name'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-first_name')
    }
    else{
      return this.first_name
    }
  }

  get_last_name(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-last_name'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-last_name')
    }
    else{
      return this.last_name
    }
  }

  get_email(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-email'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-email')
    }
    else{
      return this.email
    }
  }

  get_roles(): string[]{
    if(localStorage.getItem('conductor_ng_ui-oauth-roles'))
    {
      return JSON.parse(localStorage.getItem('conductor_ng_ui-oauth-roles'))
    }
    else{
      return this.roles
    }
  }

  get_access_token(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-access_token'))
    {
      return localStorage.getItem('conductor_ng_ui-oauth-access_token')
    }
    else{
      return this.access_token
    }
  }

  get_expires_in(): number{
    if(localStorage.getItem('conductor_ng_ui-oauth-expires_in'))
    {
      return Number.parseInt(localStorage.getItem('conductor_ng_ui-oauth-expires_in'))
    }
    else{
      return this.expires_in
    }
  }

  get_refresh_expires_in(): number{
    if(localStorage.getItem('conductor_ng_ui-oauth-refresh_expires_in'))
    {
      return Number.parseInt(localStorage.getItem('conductor_ng_ui-oauth-refresh_expires_in'))
    }
    else{
      return this.refresh_expires_in
    }
  }

  get_refresh_token(): string{
    if(localStorage.getItem('conductor_ng_ui-oauth-refresh_token'))
    {
      //console.log('Returning Refresh Token', localStorage.getItem('conductor_ng_ui-oauth-refresh_token'))
      return localStorage.getItem('conductor_ng_ui-oauth-refresh_token')
    }
    else{
      return this.refresh_token
    }
  }

  set_username(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-username', value);
    this.username = value
  }

  set_name(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-name', value);
    this.name = value
  }

  set_first_name(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-first_name', value);
    this.first_name = value
  }

  set_last_name(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-last_name', value);
    this.last_name = value
  }

  set_email(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-email', value);
    this.email = value
  }

  set_roles(value: any[]){
    localStorage.setItem('conductor_ng_ui-oauth-roles', JSON.stringify(value));
    this.roles = value
  }

  set_access_token(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-access_token', value);
    this.access_token = value
  }

  set_expires_in(value: number){
    localStorage.setItem('conductor_ng_ui-oauth-expires_in', JSON.stringify(value));
    this.expires_in = value
  }

  set_refresh_token(value: string){
    localStorage.setItem('conductor_ng_ui-oauth-refresh_token', value);
    this.refresh_token = value
  }

  set_refresh_expires_in(value: number){
    localStorage.setItem('conductor_ng_ui-oauth-refresh_expires_in', JSON.stringify(value));
    this.refresh_expires_in = value
  }
}
