import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { ConstantsService } from './constants.service';
import { UserService } from './user.service';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { HttpErrorResponse } from '@angular/common/http'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { LoggedInUser } from '../classes/loggedInUser';
import { PostService } from './post.service';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/do';

@Injectable()
export class HttpService {

  getOptionsMultipart() {
    return {
      headers: new HttpHeaders(
        {
          //'Content-Type': 'application/json',
          'Authorization': 'bearer ' + LoggedInUser.getLoggedInUser().Token.access_token,
          'enctype': 'multipart/form-data'
        }
      )
    }
  };
  getOptions() {
    return {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + LoggedInUser.getLoggedInUser().Token.access_token,
        }
      )
    }
  };

  constructor(private http: HttpClient, public router: Router){
    // public toastr: ToastsManager) {
  }

  public get(url) {
    return this.http.get(environment.rootPath + url, this.getOptions())
      .map((res: any) => {
        PostService.decPendingRequestCount();
        if (res.StatusCode == 403 || res.StatusCpde == 401) {
          this.router.navigate(['/login']);
        }
        else if (res.StatusCode != 200) {
        //   this.toastr.error(res.Result.ErrorMessage, 'Error!');
        }
        return res.Result;
      }).pipe(
        catchError(this.handleError)
      )
  }

  public postMutipart(url, data) {
    let fd: FormData = new FormData();
    for (var key in data) {
      fd.append(key, data[key]);
    }

    return this.http.post(environment.rootPath + url, fd, this.getOptionsMultipart())
      .map((res: any) => {
        PostService.decPendingRequestCount();
        if (res.StatusCode == 403 || res.StatusCpde == 401) {
          this.router.navigate(['/login']);
        }
        else if (res.StatusCode != 200) {
        //   this.toastr.error(res.Result.ErrorMessage, 'Error!');
        }
        return res.Result;
      }).pipe(
        catchError(this.handleError)
      )
  }

  public post(url, data) {
    return this.http.post(environment.rootPath + url, data, this.getOptions())
      .map((res: any) => {
        PostService.decPendingRequestCount();
        if (res.StatusCode == 403 || res.StatusCpde == 401) {
          this.router.navigate(['/login']);
        }
        else if (res.StatusCode != 200) {
        //   this.toastr.error(res.Result.ErrorMessage, 'Error!');
        }
        return res.Result;
      }).pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status == 401) {
      ;
      console.log("Here");
      // this._userService.user = null;
      // window.location.href = "http://localhost:4200";
    }

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable((error)=>{error.error('Something bad happened; please try again later.')});
  };
}