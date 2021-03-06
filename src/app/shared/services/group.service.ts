import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';
import { PostModel } from '../models/post';
import { PostService } from './post.service';
import { CreateGroupModel } from '../models/create-group';

@Injectable()
export class GroupService {

  static pendingRequestCountGroups=0;
  static showGroupLoader:boolean;

  constructor(private objHttp:Http, private objRouter:Router,private http:Http) { }

  getGroups(MyGroupPageSize:number, MyGroupPageNo:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    GroupService.incPendingGroupRequestCount();


    return this.objHttp.get(webService("/Group/GetGroups?MyGroupPageSize="+MyGroupPageSize+"&MyGroupPageNo="+MyGroupPageNo),opts)
    .map((res:Response) =>{
      GroupService.decPendingGroupRequestCount();
      return res.json();
    });
  }

  getGroupInfo(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/GetGroupById?Group_Id="+Group_Id),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCount();
      return res.json();
    }
   ).catch(error => {
     return Observable.throw(this.objRouter.navigate(['/index']),error.json());
   });
  }

  getGroupMembersByGroupId(Group_Id:number,PageSize:number, PageNo:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/GetMembersByGroupId?Group_Id="+Group_Id+"&PageSize="+PageSize+"&PageNo="+PageNo),opts)
    .map((res:Response) =>
    {
      // PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

 uploadGroupImage(Picture){
  let formData:FormData = new FormData();
  let headers = new Headers();
  headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
  let opts = new RequestOptions();
  opts.headers = headers;

  if(Picture) formData.append('profile_picture', Picture);

  return this.objHttp.post(webService("/Group/ImageUpload"),formData,opts)
  .map((res:Response) => res.json());

 }

  updateGroupImage(Picture, Group_Id:number){
    let formData:FormData = new FormData();
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    if(Picture) formData.append('CoverPictureUrl', Picture);
    formData.append("Group_Id",Group_Id+"")

    return this.objHttp.post(webService("/Group/UpdateGroupImage"),formData,opts)
    .map((res:Response) => res.json());

  }

  getGroupPosts(Group_Id:number,PageSize:number, PageNo:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/GetPostsByGroupId?Group_Id="+Group_Id+"&PageSize="+PageSize+"&PageNo="+PageNo),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

  getGroupPostsV1(Group_Id:number,PageSize:number, PageNo:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCountV1();

    return this.objHttp.get(webService("/Group/GetPostsByGroupId?Group_Id="+Group_Id+"&PageSize="+PageSize+"&PageNo="+PageNo),opts)
    .map((res:Response) =>
    {
      PostService.decPendingRequestCountV1();
      return res.json();
    }
   );
  }

  searchGroup(SearchText:string){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/SearchGroups?SearchText="+SearchText),opts)
    .map((res:Response) => res.json());

  }

  getAllJoinRequests(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/GetAllJoinRequests?Group_Id="+Group_Id),opts)
    .map((res:Response) =>
    {
      // PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }
  // GET /api/Group/GetFollowersToAdd

  getFollowersToAdd(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/GetFollowersToAdd?Group_Id="+Group_Id),opts)
    .map((res:Response) =>
    {
      // PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

  joinGroup(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/JoinRequest?Group_Id="+Group_Id),opts)
    .map((res:Response) => res.json());
  }

  acceptJoinRequest(User_Id:number,Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
  //  PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/AcceptJoinRequestByAdmin?Group_Id="+Group_Id+"&User_Id="+User_Id),opts)
    .map((res:Response) =>
    {
  //  PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

  rejectJoinRequest(User_Id:number,Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/RejectJoinRequestByAdmin?Group_Id="+Group_Id+"&User_Id="+User_Id),opts)
    .map((res:Response) =>
    {
    // PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

  cancelJoinRequest(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/CancelJoinRequest?Group_Id="+Group_Id),opts)
    .map((res:Response) => res.json());
  }

  acceptJoinRequestByUser(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp.get(webService("/Group/AcceptJoinRequestByUser?Group_Id="+Group_Id),opts)
    .map((res:Response) =>
    {
      return res.json();
    }
   );
  }

  rejectJoinRequestByUser(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp.get(webService("/Group/RejectJoinRequestByUser?Group_Id="+Group_Id),opts)
    .map((res:Response) =>
    {
      return res.json();
    }
   );
  }




  groupSearching(SearchText:string){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/SearchGroups?SearchText="+SearchText),opts)
    .map((res:Response) => res.json());

  }

  addGroupMembersByAdmin(Group_Id:number,GroupMembersIds:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/AddGroupMembersByAdmin?Group_Id="+Group_Id+"&GroupMembersIds="+GroupMembersIds),opts)
    .map((res:Response) => res.json());
  }

  searchFollowersToAdd(Group_Id:number,SearchText:string){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/SearchGetFollowersToAdd?Group_Id="+Group_Id+"&SearchText="+SearchText),opts)
    .map((res:Response) => res.json());
  }

  searchFollowersCreeateGroup(SearchText:string){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/SearchGetFollowersToAdd?&SearchText="+SearchText),opts)
    .map((res:Response) => res.json());
  }

  removeUserByAdmin(User_Id:number,Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Group/RemoveUserByAdmin?Group_Id="+Group_Id+"&User_Id="+User_Id),opts)
    .map((res:Response) =>
    {
    // PostService.decPendingRequestCount();
      return res.json();
    }
   );
  }

  leftGroupByUser(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/LeftGroupByUser?Group_Id="+Group_Id),opts)
    .map((res:Response) => res.json());
  }

  deleteGroup(Group_Id:number){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp.get(webService("/Group/DeleteGroup?Group_Id="+Group_Id),opts)
    .map((res:Response) => res.json());
  }

  createGroup(objGroupModel:CreateGroupModel){
    let headers = new Headers();
    headers.append("Authorization","bearer " +LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp.post(webService("/Group/CreateGroup"),objGroupModel,opts)
    .map((res:Response ) => res.json());
  }

  public static incPendingGroupRequestCount() {
    GroupService.pendingRequestCountGroups++;
    GroupService.showGroupLoader = GroupService.pendingRequestCountGroups > 0;
  }

  public static decPendingGroupRequestCount(toZero = false) {

    if (GroupService.pendingRequestCountGroups > 0) GroupService.pendingRequestCountGroups--;
    GroupService.showGroupLoader = GroupService.pendingRequestCountGroups > 0;

    if (toZero && GroupService.pendingRequestCountGroups > 0) {
    GroupService.decPendingGroupRequestCount(toZero);
  }

  }

}
