import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private options = { toastTimeout: 10000, showCloseButton: true, dismiss: 'auto', maxShown: 3}

  constructor(private toastManager: ToastrManager) {

   }

   success(message: string, title: string)
   {
    this.toastManager.successToastr(message, title, this.options);
   }

   error(message: string, title: string)
   {
    this.toastManager.errorToastr(message, title, this.options);
   }

   warning(message: string, title: string)
   {
    this.toastManager.warningToastr(message, title, this.options);
   }

   info(message: string, title: string)
   {
    this.toastManager.infoToastr(message, title, this.options);
   }
}
