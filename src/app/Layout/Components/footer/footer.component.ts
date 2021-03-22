import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HealthCheckService, HealthCheckStatus } from 'src/app/Rest/Conductor';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  

  private time_interval: number

  public server_url: string;
  public server_swagger_url: string;

  public health_check_started: boolean

  public hc_status: HealthCheckStatus;

  private server_health_check_interval: any
  private recheck_time_keeper: any
  public recheck_timer_message: string

  public hc_paused: boolean = false

  constructor(private health_check_service: HealthCheckService) { 
   
    this.time_interval = 5000

  }

  async ngOnInit() {

    if(undefined != environment.WF_SERVER)
    {
      this.server_url = environment.WF_SERVER;
    }

    this.server_swagger_url = this.server_url.slice(0, this.server_url.length - 4)

    if(undefined != environment.WF_SERVER_HC_TIME_INTERVAL_MS)
    {
      this.time_interval = environment.WF_SERVER_HC_TIME_INTERVAL_MS;
    }

    this.pause_health_check()
  }

  async get_conductor_hc(){
    
    this.health_check_service.doCheck().toPromise().then((hc_status: HealthCheckStatus) => {
      this.health_check_started = true
      this.hc_status = hc_status;
    }).catch((error: HttpErrorResponse) => {
      console.log(error.message)
      console.log(error.statusText)
      this.health_check_started = true
      this.hc_status = undefined
    })

    this.server_health_check_interval = setInterval(() => {
      this.health_check_started = false
      this.retry_health_check()
    }, this.time_interval)

    let recheck_time_keeper: number = 1

    this.recheck_time_keeper = setInterval(()=>{
      this.recheck_timer_message = 'Next health check refresh in '+ (this.time_interval/1000 - recheck_time_keeper) + ' Sec(s)'
      recheck_time_keeper = recheck_time_keeper + 1
    }, 1000)

  }

  async retry_health_check(){
    this.recheck_timer_message = 'Retrying health check ...'
    await clearInterval(this.server_health_check_interval)
    await clearInterval(this.recheck_time_keeper)
    this.get_conductor_hc()
    this.hc_paused = false
  }

  async pause_health_check(){
    this.recheck_timer_message = 'Health Check paused ...'
    await clearInterval(this.server_health_check_interval)
    await clearInterval(this.recheck_time_keeper)
    this.health_check_started = true
    this.hc_paused = true
    this.hc_status = { healthy: false }
  }

}
