import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import 'rxjs/Rx'
import { PostService } from './post.service';

@Injectable()
export class ActivityLogsService {

  constructor(private objHttp:Http, private objRouter:Router) { }

  getActivityLogs(PageSize: number, PageNo: number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/ActivityLog/GetActivityLogs?Page=" + PageSize + "&Items=" + PageNo),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCount();
      return res.json();
    }
  );
  }

  removeActivityLog(ActivityLog_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/ActivityLog/RemoveActivityLog?ActivityLog_Id="+ActivityLog_Id),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCount();
      return res.json();
    }
  );
  }
  removeAllActivityLogs(){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/ActivityLog/RemoveAllActivityLogs"),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCount();
      return res.json();
    }
  );
  }

}
