import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Rest/Conductor';

@Component({
  selector: 'app-runtime-configuration',
  templateUrl: './runtime-configuration.component.html',
  styleUrls: []
})
export class RuntimeConfigurationComponent implements OnInit {

  public configuration_details: any 
  public configuration_details_length: number
  public error_message: string

  constructor(private adminService: AdminService) { 
    
  }

  async ngOnInit() {
    await this.adminService.getAllConfig().toPromise().then((config_details: any) => {
      this.configuration_details = config_details
      this.configuration_details_length = Object.keys(this.configuration_details).length
    }).catch((err_response: HttpErrorResponse) => {
      this.error_message = err_response.message
      console.log('Response Code - ', err_response.status)
      console.log('Response Status - ', err_response.statusText)
      console.log('Response Error - ', err_response.error)
    })
  }

}
