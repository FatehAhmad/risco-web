import { animate } from "@angular/animations";
import { Injectable } from "@angular/core";
import { Gift } from "../models/gift";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs";
import { webService } from "../global.config";
import { LoggedInUser } from "../classes/loggedInUser";
import { Router } from "@angular/router";
import { PostService } from "./post.service";
import "rxjs/Rx";

@Injectable()
export class LanguageService {
  constructor(private objHttp: Http, private objRouter: Router) {}

  getAllLanguages() {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(webService("/Language/GetAllLanguages"), opts)
      .map((res: Response) => {
        return res.json();
      });
  }
}






























