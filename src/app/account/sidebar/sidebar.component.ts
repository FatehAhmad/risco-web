import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoggedInUser } from '../../../app/shared/classes/loggedInUser';
import { UserService } from '../../../app/shared/services/user.service';
import { UserModel } from '../../../app/shared/models/userModel';
import { TrendsModel } from '../../../app/shared/models/tends';
import { PostService } from '../../../app/shared/services/post.service';
import { TopFollowersModel } from '../../../app/shared/models/top-followers';
import { GroupService } from '../../../app/shared/services/group.service';
import { GroupDataModel } from '../../../app/shared/models/group-data';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../app/shared/services/data-service';
import { GroupsModel } from '../../../app/shared/models/groups';
import { SidebarTypeEnum } from '../../../app/shared/enum/sidebar-type';
import { environment } from '../../../environments/environment';


declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @ViewChild('inPicture') inPicture;
  @ViewChild('inPictureCover') inPictureCover;
  @Input() sideBar: SidebarTypeEnum;
  @Input() userId:any;
  @Input() groupId:any;

  fullName: string = "";
  Image: any;
  public GroupService = GroupService;
  objAccountSetting: UserModel = new UserModel();
  objUserSettings:UserModel= new UserModel();
  objGetGroups: GroupDataModel = new GroupDataModel();
  objGroupInfo:GroupsModel= new GroupsModel();
  objTrends: TrendsModel[] = [];
  objTopFollowers: TopFollowersModel[] = [];
  imagePath: string;
  PageSize: any;
  PageNo: any;
  SuggestedGroupPageSize: any;
  SuggestedGroupPageNo: any;
  InterestsCount: boolean=false;
  public SidebarTypeEnum=SidebarTypeEnum;
  Group_Id: any;
  aboutMeContent: string;

  activeTabs = {
    following: false ,
    followers : false
  }

  constructor(private objRoute:ActivatedRoute, public objDataService: DataService, private objRouter: Router, private objUserService: UserService, private objGroupService: GroupService, private objPostService: PostService) {
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {

    if(this.objRouter.url == "/unfollow"){
      this.activeTabs.following = true;
      this.activeTabs.followers = false;
    }
    if(this.objRouter.url == "/follow"){
      this.activeTabs.following = false;
      this.activeTabs.followers = true;
    }


    if(this.groupId==undefined){
      if(this.userId==undefined){

        var user = LoggedInUser.getLoggedInUser();
        if (user) {
          this.objDataService.currentMessage.subscribe(res => {
            this.objAccountSetting.FollowingCount++;
          })

          this.fullName = user.FullName;
          this.objUserService.getUserData()
        .subscribe(res => {
          if (res.StatusCode == 200) {
            this.objAccountSetting = res.Result;
            this.aboutMeContent=this.objAccountSetting.AboutMe;

            var i;
            for(i=0;i<this.objAccountSetting.BasketSettings.Interests.length;i++){
              if(this.objAccountSetting.BasketSettings.Interests[i].Checked==true){
                this.InterestsCount=true;
                break;
              }

            }
          }
        });

          this.objPostService.getTrending()
            .subscribe(res => {
              if (res.StatusCode == 200) {
                this.objTrends = res.Result.Trends;
              }
          });

          this.objPostService.getTopFollowers()
            .subscribe(res => {
              if (res.StatusCode == 200) {
                this.objTopFollowers = res.Result;
              }
          });

          this.PageSize = 10;
          this.PageNo = 0;
          this.objGroupService.getGroups(this.PageSize, this.PageNo)
            .subscribe(res => {
              if (res.StatusCode == 200) {
                this.objGetGroups = res.Result;
              }
          });

          var that = this;
          $(
            function ($) {
              $('.wid_scroll').bind('scroll', function () {
                if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                  that.PageNo++;
                  that.objGroupService.getGroups(that.PageSize, that.PageNo)
                    .subscribe(res => {
                      if (res.StatusCode == 200) {
                          res.Result.MyGroups.forEach(grp => {
                          that.objGetGroups.MyGroups.push(grp);
                        });
                      }
                    });
                }
              })
            }
          );
        }
      }

      if(this.userId!=undefined){

        this.objUserService.getUserById(this.userId)
        .subscribe(res => {
          if (res.StatusCode == 200) {
            this.objAccountSetting = res.Result;
            this.aboutMeContent=this.objAccountSetting.AboutMe;

            var i;
            for(i=0;i<this.objAccountSetting.BasketSettings.Interests.length;i++){
              if(this.objAccountSetting.BasketSettings.Interests[i].Checked==true){
                this.InterestsCount=true;
                break;
              }

            }
          }
        });

        this.objPostService.getTrending()
        .subscribe(res => {
          if (res.StatusCode == 200) {
            this.objTrends = res.Result.Trends;
          }
      });

      }
    }

    if(this.groupId!=undefined){
      this.Group_Id=this.groupId;
      this.getUserData();
      this.getGroupInfo(this.Group_Id);
    }
  }
//#region

  getUserData(){
    this.objUserService.getUserData()
    .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objUserSettings = res.Result;
        }
    });
  }

  getGroupInfo(Id){

    this.objGroupService.getGroupInfo(Id)
    .subscribe(res => {
        if (res.StatusCode == 200) {
            this.objGroupInfo=res.Result;
            this.aboutMeContent=this.objGroupInfo.Description;
        }
        if(res.StatusCode == 500){
          this.objRouter.navigate(['/index']);
      }
    });
  }

  joinGroup(Id){
    this.objGroupService.joinGroup(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
    })
  }

  cancelJoinRequest(Id){
    this.objGroupService.cancelJoinRequest(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
    })
  }

  leftGroupByUser(Id){
    this.objGroupService.leftGroupByUser(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
      this.objDataService.leaveGroup({});
    })
  }

  deleteGroup(Id){
    this.objGroupService.deleteGroup(Id)
    .subscribe(res=>{
      this.objRouter.navigate(['/index']);
    })
  }

//#endregion

  groupDetailsPage(Id) {
    this.objRouter.navigate(["/group-detail/" + Id]);
  }

  userProfileRedirect(Id) {
    this.objRouter.navigate(["/user-profile/" + Id]);
  }

  heatMapRedirect(HashTag) {
    this.objRouter.navigate(["/heat-map/" + HashTag]);
  }

  onFileChange(event) {
    let files = event.target.files;

    var ext = files[files.length - 1].name.split('.').pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {

      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        $('.profileImage').css('background-image', 'url(' + (<any>e.target).result + ')');
        $('.profileImage').attr('src', (<any>e.target).result);

        let fileBrowser = that.inPicture.nativeElement;
        let file = fileBrowser.files[0];

        that.objUserService.updateProfileImage(file)
          .subscribe(
            res => {
              if (res) {
                //         console.log()
                //  this.objRouter.navigate(["dashboard/cm/"]);

              }
            }
          );
      }
      reader.readAsDataURL(files[files.length - 1]);
    }
  }

  onFileChangeCover(event) {
    let files = event.target.files;

    var ext = files[files.length - 1].name.split('.').pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {

      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        $('.coverImage').css('background-image', 'url(' + (<any>e.target).result + ')');

        let fileBrowser = that.inPictureCover.nativeElement;
        let file = fileBrowser.files[0];

        that.objUserService.updateCoverImage(file)
          .subscribe(
            res => {
              if (res.StatusCode == 200) {

              }
            }
          );
      }
      reader.readAsDataURL(files[files.length - 1]);
    }
  }

  onFileChangee(event) {
    let files = event.target.files;

    var ext = files[files.length - 1].name.split('.').pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {

      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        $('.profileImage').css('background-image', 'url(' + (<any>e.target).result + ')');
        $('.profileImage').attr('src', (<any>e.target).result);

        let fileBrowser = that.inPicture.nativeElement;
        let file = fileBrowser.files[0];

        that.objUserService.updateProfileImage(file)
          .subscribe(
            res => {
              if (res) {
                //          console.log()
                //  this.objRouter.navigate(["dashboard/cm/"]);

              }
            }
          );
      }
      reader.readAsDataURL(files[files.length - 1]);
    }
  }

  onFileChangeCoverGroupDetail(event){
    let files = event.target.files;
    var ext = files[files.length-1].name.split('.').pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {

    var reader = new FileReader();
    var that = this;
    reader.onload = function (e) {
      $('.coverImage').css('background-image', 'url(' + (<any>e.target).result + ')');

         let fileBrowser = that.inPictureCover.nativeElement;
         let file = fileBrowser.files[0];

         that.objGroupService.updateGroupImage(file,that.Group_Id)
         .subscribe(
           res => {
             if(res.StatusCode==200){

             }
           }
         );
    }
    reader.readAsDataURL(files[files.length-1]);
  }
 }

}
