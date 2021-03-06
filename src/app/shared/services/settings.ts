
import { Injectable, Input } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import { PostService } from './post.service'

@Injectable()
export class SettingsService{

    constructor(private objHttp: Http, private objRouter: Router, private http: Http) { }

    getSettings(){
        let headers = new Headers();
        headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
        let opts = new RequestOptions();
        opts.headers = headers;

        return this.objHttp.get(webService("/Settings/GetSettings"), opts)
          .map((res: Response) => {
            PostService.decPendingRequestCount();
            return res.json();
        });
    }

    getFAQs(){
      let headers = new Headers();
      headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
      let opts = new RequestOptions();
      opts.headers = headers;

      return this.objHttp.get(webService("/Settings/GetFAQs"), opts)
        .map((res: Response) => {
          PostService.decPendingRequestCount();
          return res.json();
      });
  }

}
