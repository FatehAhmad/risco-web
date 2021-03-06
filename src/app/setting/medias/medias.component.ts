import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { MediaModel } from '../../shared/models/media';
import { UserModel } from '../../shared/models/userModel';
import { environment } from '../../../environments/environment';
import { FollowService } from '../../shared/services/follow.service';
import { ReportModel } from 'src/app/shared/models/report-model';
import { PostService } from 'src/app/shared/services/post.service';

declare var $: any;
declare var FriendRequest: any;

@Component({
  selector: 'app-medias',
  templateUrl: './medias.component.html',
  styleUrls: ['./medias.component.css']
})
export class MediasComponent implements OnInit {
  ParamId: any;
  objMediaModel:MediaModel=new MediaModel();
  objAccountSetting:UserModel= new UserModel();
  objReportModel: ReportModel = new ReportModel();
  imagePath: string;
  UserIdReportUser: any;
  reportId: number;
  reportVal: any;
  blockVal: any;
  constructor(private objRouter: Router,private title: Title,private objRoute:ActivatedRoute, 
    private objUserService:UserService, private objFollowService: FollowService, private objPostService: PostService) { 
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {
    this.title.setTitle('Risco');
    Helper.setBodyClass("mediaPage");

    this.objRoute.params.subscribe(paramsId => {
      this.ParamId=paramsId["Id"];
      
      this.objUserService.getUserById(paramsId["Id"])
      .subscribe(res=>{
        if(res.StatusCode==200){
          this.objAccountSetting = res.Result;
        }
      });

      this.objUserService.getMediaUserById(paramsId["Id"])
      .subscribe(res=>{
        if(res.StatusCode==200){      
            this.objMediaModel=res.Result;          
        }
      });
    });

    this.InitializeScripts();
  }

  userProfileRedirect(Id){  

    if(Id==this.objAccountSetting.Id)
    this.objRouter.navigate(["/user-profile/"+Id]);   
    else
    this.objRouter.navigate(['/profile']);;
  }

  follow(id) {
    ;
    var userId = id;
    this.objFollowService.follow(userId)
        .subscribe(res => {
            if (res.StatusCode == 200) {
                this.objAccountSetting.IsFollowing = true;
            }
        });
  }
  unFollow(id) {
      this.objFollowService.unFollow(id)
          .subscribe(res => {
              if (res.StatusCode == 200) {
                  this.objAccountSetting.IsFollowing = false;
              }
          });
  }
  setIdInternalReportUser(id){
    $("#on11").click();
    this.UserIdReportUser=id;
  }

  messageFriendBtnClick() {
    var userId = this.objAccountSetting.Id;
    var username = this.objAccountSetting.FullName;
    FriendRequest.SendRequest(userId, username);
    this.objRouter.navigate(["messages", userId, username]);
  }

  reportUser() {
    this.objUserService.reportUser(this.UserIdReportUser, this.reportVal)
        .subscribe(res => {
            if (res.StatusCode == 200) {
                $("#reportText").val("");
            }
        })
  }

  getValueReporting(val) {
    this.reportVal = val;
    }
    getValueBlocking(val) {
        this.blockVal = val;
    }

    reportPost() {
        this.objPostService.reportPost(this.reportId, this.reportVal, this.objReportModel.Text)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    $("#reportText").val("");
                    this.objReportModel.Text = "";
                }
            })

    }

    blockUser(userID) {
      this.objUserService.blockUser(userID)
          .subscribe(res => {
              if (res.StatusCode == 200) {
                  this.objAccountSetting.IsBlocked = true;
              }
          })
  }

  unBlockUser(userID) {
      this.objUserService.unBlockUser(userID)
          .subscribe(res => {
              if (res.StatusCode == 200) {
                  this.objAccountSetting.IsBlocked = false;
              }
          })
  }

  InitializeScripts(){
    $('.profile_more').click(function (e) {
      e.stopPropagation();
      $('.profile_more_dropdown').stop(0, 0).slideToggle('fast');
   });
  }
}
