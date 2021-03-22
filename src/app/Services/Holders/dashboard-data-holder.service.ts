import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataHolderService {

  private total: number
  private running: number
  private paused: number
  private completed: number
  private failed: number
  private terminated: number
  private timedout: number

  constructor() {
    this.total = 0
    this.running = 0
    this.paused = 0
    this.completed = 0
    this.failed = 0
    this.terminated = 0
    this.timedout = 0
   }

   set_total(count: number){
     this.total = count
   }

   set_running(count: number){
    this.running = count
  }

  set_paused(count: number){
    this.paused = count
  }

  set_completed(count: number){
    this.completed = count
  }

  set_failed(count: number){
    this.failed = count
  }

  set_terminated(count: number){
    this.terminated = count
  }

  set_timedout(count: number){
    this.timedout = count
  }

  get_total(): number{
    return this.total
  }

  get_running(): number{
    return this.running
  }

  get_paused(): number{
    return this.paused
  }

  get_completed(): number{
    return this.completed
  }

  get_failed(): number{
    return this.failed
  }

  get_terminated(): number{
    return this.terminated
  }

  get_timedout(): number{
    return this.timedout
  }
}
