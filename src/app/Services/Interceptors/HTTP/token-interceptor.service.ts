import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { UserInfoAndTokenDataHolderService } from '../../Holders/user-info-and-token-data-holder.service';
import { environment } from 'src/environments/environment';
import { OauthApiCallerService } from '../../OAuth/oauth-api-caller.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public userInfoAndTokenDataHolderService: UserInfoAndTokenDataHolderService, public oauthApiCallerService: OauthApiCallerService){

  }

  private _refreshSubject: Subject<any> = new Subject<any>();

  private _ifTokenExpired() {
    console.log('Refreshing Access Token is expired')
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      // Hit refresh-token API passing the refresh token stored into the request
      // to get new access token and refresh token pair
      this.oauthApiCallerService.refresh_access_token().subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  private _checkTokenExpiryErr(error: HttpErrorResponse): boolean {
    return (
      error.status &&
      error.status === 401 &&
      error.error &&
      error.error.message === "TokenExpired"
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req.url.endsWith("/logout") || req.url.endsWith("/token") || !environment.OAUTH_ENABLED || 'Y'!=environment.OAUTH_ENABLED) {
      console.log('Request forwarded to API')
      return next.handle(req);
    } else {
      return next.handle(this.updateHeader(req)).pipe(catchError((error, caught) => {
          if (error instanceof HttpErrorResponse) {
            if (this._checkTokenExpiryErr(error)) {
              return this._ifTokenExpired().pipe(
                switchMap(() => {
                  return next.handle(this.updateHeader(req));
                })
              );
            } else {
              return throwError(error);
            }
          }
          return caught;
        })
      );
    }
  }

  updateHeader(req) {
    const authToken = this.userInfoAndTokenDataHolderService.get_access_token();
    req = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`)
    });
    return req;
  }
}