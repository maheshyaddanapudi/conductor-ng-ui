import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserInfoAndTokenDataHolderService } from 'src/app/Services/Holders/user-info-and-token-data-holder.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: []
})
export class UserInfoComponent implements OnInit {

  public user_info_json: string


  public name: string
  public first_name: string
  public last_name: string
  public roles: any[]
  public email: string

  public error_message: string

  constructor(private userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService) { 
    this.roles = []
  }

  ngOnInit() {
    this.name = this.userInfoAndTokenDataHolderService.get_name()
    this.first_name = this.userInfoAndTokenDataHolderService.get_first_name()
    this.last_name = this.userInfoAndTokenDataHolderService.get_last_name()
    this.email = this.userInfoAndTokenDataHolderService.get_email()
    this.roles = this.userInfoAndTokenDataHolderService.get_roles()
  }

}
