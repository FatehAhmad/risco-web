import { animate } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { webService } from '../global.config';
import { LoggedInUser } from '../classes/loggedInUser';
import { Router } from '@angular/router';
import 'rxjs/Rx'
import { PostModel } from '../models/post';
import { MediaTypeEnum } from '../enum/media-type-enum';



@Injectable()
export class PostService {

  constructor(private objHttp: Http, private objRouter: Router, private http: Http) { }

  static pendingRequestCount = 0;
  static showLoader: boolean;

  //Static variables for loader inside update status div
  static pendingRequestCountImages = 0;
  static showLoaderImages: boolean;


  uploadPostMedia(file, mediaTypeEnum: MediaTypeEnum = MediaTypeEnum.Image) {
    let formData: FormData = new FormData();
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    var url = "";
    if (file && mediaTypeEnum == MediaTypeEnum.Image) {
      url = webService("/Post/ImageUpload");
      formData.append('profile_picture', file);
    }
    if (file && mediaTypeEnum == MediaTypeEnum.Video) {
      url = webService("/Post/VideoUpload");
      formData.append('profile_video', file);
    }

    PostService.incPendingRequestCountmages()
    return this.objHttp.post(url, formData, opts).map((res: Response) => {
      PostService.decPendingRequestCountImages();
      return res.json();
    });
  }


  getCurrentIpLocation(): Observable<any> {

    return this.objHttp.get('http://ipinfo.io')

      .map(response => response.json())

      .catch(error => {
        //  console.log(error);
        return Observable.throw(error.json());
      });
  }

  createPost(postList) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;


    return this.objHttp.post(webService("/Post/CreatePost"), postList, opts)
        .map((res: Response) => {

            return res.json();
          }
        );
  }

  updateStatus(objPostSetting: PostModel) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;


    return this.objHttp.post(webService("/Post/CreatePost"), objPostSetting, opts)
      .map((res: Response) => {

        return res.json();
      }
      );
  }

  postComment(Text: string, Post_Id: number, ParentComment_Id: number, ImageUrls: string = '', VideoUrls: string = '') {
    let Body = { Text: Text, Post_Id: Post_Id, ParentComment_Id: ParentComment_Id, ImageUrls: ImageUrls, VideoUrls: VideoUrls };
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    PostService.incPendingRequestCount();
    return this.objHttp.post(webService("/Post/Comment"), Body, opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  commentReply(Text: string, Post_Id: number, ParentComment_Id: number, ImageUrls: string = '', VideoUrls: string = '') {
    let Body = { Text: Text, Post_Id: Post_Id, ParentComment_Id: ParentComment_Id, ImageUrls: ImageUrls, VideoUrls: VideoUrls };
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    PostService.incPendingRequestCount();
    return this.objHttp.post(webService("/Post/CommentReply"), Body, opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  deletePost(Post_Id: number) {
    let Body = { Post_Id: Post_Id };
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp.post(webService("/Post/DeletePost?Post_Id=" + Post_Id), Body, opts)
      .map((res: Response) => {
        return res.json();
      }
      );
  }


  getLocationsForHeatMap(HashTag: string) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    HashTag = encodeURIComponent(HashTag);
    return this.objHttp.get(webService("/Post/GetLocationsForHeatMapV2?HashTag=" + HashTag), opts)
      .map((res: Response) => {
        return res.json();
      }
      );
  }

  getPosts(PageSize: number, PageNo: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/GetPosts?PageSize=" + PageSize + "&PageNo=" + PageNo), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );

  }

  getPostsV1(PageSize: number, PageNo: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCountV1();

    return this.objHttp.get(webService("/Post/GetPosts?PageSize=" + PageSize + "&PageNo=" + PageNo), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );

  }

  getTrending() {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/GetTrends"), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  searchTrends(postType: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/SearchTrends?postType=" + postType), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  getTopFollowers() {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/FollowFollower/GetTopFollowers"), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }



  getPostsByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetPostsByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }

  getPostsByUserIdV1(id: number, PageSize: number, PageNo: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCountV1();
    return this.objHttp.get(webService("/Post/GetPostsByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCountV1();
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  getPostsDetailByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetPostsDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }

  getPostsDetailByUserIdV1(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetPostsDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }

  getIncidentsDetailByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetIncidentsDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }

  getMediasPostDetailByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetMediasPostDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }

  getLikesPostDetailByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetLikesPostDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }


  getRepliesPostDetailByUserId(id: number, PageSize: number, PageNo: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    // PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/GetRepliesPostDetailByUserId?User_Id=" + id + "&PageNo=" + PageNo + "&PageSize=" + PageSize), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        PostService.decPendingRequestCountV1();
        return res.json();
      }
      );
  }



  getPostsByPostId(id: number) {

    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/GetPostByPostId?Post_Id=" + id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  likePost(Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    //PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/LikePost?Post_Id=" + Post_Id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  unlikePost(Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    //PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/UnLikePost?Post_Id=" + Post_Id), opts)
      .map((res: Response) => {

        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  likeComment(Comment_Id: number, Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    PostService.incPendingRequestCount();
    return this.objHttp.get(webService("/Post/LikeComment?Comment_Id=" + Comment_Id + "&Post_Id=" + Post_Id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  unLikeComment(Comment_Id: number, Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;


    return this.objHttp.get(webService("/Post/UnLikeComment?Comment_Id=" + Comment_Id + "&Post_Id=" + Post_Id), opts)
      .map((res: Response) => {

        return res.json();
      }
      );
  }

  rePost(postObj: PostModel) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.post(webService("/Post/Repost"), postObj, opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }).catch((err, caught) => {
        PostService.decPendingRequestCount();
        return new Observable();
      });
  }

  voteOnPollOption(pollObj: any) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.post(webService("/Post/VoteOnPollOption"), pollObj, opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }).catch((err, caught) => {
        PostService.decPendingRequestCount();
        return new Observable();
      });
  }

  rePostGroup(Post_Id: number, Location: string, Visibility: number, Group_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/Repost?Post_Id=" + Post_Id + "&Location=" + Location + "&Visibility=" + Visibility + "&Group_Id=" + Group_Id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  reportPost(Post_Id: number, ReportType: number, Text: string) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;


    return this.objHttp.get(webService("/Post/ReportPost?Post_Id=" + Post_Id + "&ReportType=" + ReportType + "&Text=" + Text), opts)
      .map((res: Response) => {

        return res.json();

      }
      );
  }


  hideAllPosts(HideAllPostsUser_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/HideAllPost?HideAllPostsUser_Id=" + HideAllPostsUser_Id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  hidePostById(Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();

    return this.objHttp.get(webService("/Post/HidePost?Post_Id=" + Post_Id), opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      }
      );
  }

  turnOfNotification(Post_Id: number) {
    let headers = new Headers();
    headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;


    return this.objHttp.get(webService("/Post/TurnOffNotifications?Post_Id=" + Post_Id), opts)
      .map((res: Response) => {

        return res.json();
      }
      );
  }



  getInterests() {
    return this.objHttp.get(webService("/Settings/GetAllInterests"))
      .map((res: Response) => {
        return res.json();
      });
  }

  public static incPendingRequestCount() {
    PostService.pendingRequestCount++;

    PostService.showLoader = PostService.pendingRequestCount > 0;
  }

  public static decPendingRequestCount(toZero = false) {

    if (PostService.pendingRequestCount > 0) PostService.pendingRequestCount--;
    PostService.showLoader = PostService.pendingRequestCount > 0;

    if (toZero && PostService.pendingRequestCount > 0) {
      PostService.decPendingRequestCount(toZero);
    }

  }

  public static incPendingRequestCountV1() {
    PostService.pendingRequestCount++;
  }

  public static decPendingRequestCountV1(toZero = false) {
    if (PostService.pendingRequestCount > 0) PostService.pendingRequestCount--;
    if (toZero && PostService.pendingRequestCount > 0) {
      PostService.decPendingRequestCount(toZero);
    }
  }

  public static incPendingRequestCountmages() {

    PostService.pendingRequestCountImages++;
    PostService.showLoaderImages = PostService.pendingRequestCountImages > 0;
  }

  public static decPendingRequestCountImages(toZero = false) {


    if (PostService.pendingRequestCountImages > 0) PostService.pendingRequestCountImages--;
    PostService.showLoaderImages = PostService.pendingRequestCountImages > 0;

    if (toZero && PostService.pendingRequestCountImages > 0) {
      PostService.decPendingRequestCountImages(toZero);
    }

  }



}
