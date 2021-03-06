import { animate } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Gift } from '../models/gift';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import 'rxjs/Rx'



@Injectable()
export class ContactService {

  constructor(private objHttp:Http, private objRouter:Router) { }
  
  checkContactAuth(Description:string ){
    let Body = {description: Description};
    
    return this.objHttp.post(webService("/User/ContactUs"),Body)
    .map((res:Response ) => {
      PostService.decPendingRequestCount();
      return res.json()
    });
  }  
  
 
}
