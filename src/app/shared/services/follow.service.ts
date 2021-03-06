import { animate } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import 'rxjs/Rx'
import { PostModel } from '../models/post';



@Injectable()
export class FollowService {

  constructor(private objHttp:Http, private objRouter:Router,private http:Http) { }


  follow(FollowUser_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/FollowFollower/Follow?FollowUser_Id="+FollowUser_Id),opts)
    .map((res:Response) => {
      PostService.decPendingRequestCount();
      return  res.json()
    });  
  }

  unFollow(UnFollowUser_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/FollowFollower/UnFollow?UnFollowUser_Id="+UnFollowUser_Id),opts)
    .map((res:Response) =>{
      PostService.decPendingRequestCount();
      return res.json()
    });  
  }

  getFollowings(SearchString:string, Page:number, Items:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/FollowFollower/GetFollowings?SearchString="+SearchString + "&Page=" + Page + "&Items=" + Items),opts)
    .map((res:Response) => {
      PostService.decPendingRequestCount();
      return res.json()
    }); 
  }

  getFollowers(SearchString:string, Page:number, Items:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/FollowFollower/GetFollowers?SearchString="+SearchString + "&Page=" + Page + "&Items=" + Items),opts)
    .map((res:Response) => {
      PostService.decPendingRequestCount();
      return res.json()
    }); 
  }

}