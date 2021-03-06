import { Component, OnInit, Input } from "@angular/core";
import { LoggedInUser } from "../../../app/shared/classes/loggedInUser";
import { UserService } from "../../../app/shared/services/user.service";
import { PostService } from "../../../app/shared/services/post.service";
import { TopFollowersModel } from "../../../app/shared/models/top-followers";
import { GroupService } from "../../../app/shared/services/group.service";
import { GroupDataModel } from "../../../app/shared/models/group-data";
import { Router } from "@angular/router";
import { DataService } from "../../../app/shared/services/data-service";
import { GroupsModel } from "../../../app/shared/models/groups";
import { SidebarTypeEnum } from "../../../app/shared/enum/sidebar-type";
import { environment } from '../../../environments/environment';


declare var $: any;
@Component({
  selector: "app-side-follow-group",
  templateUrl: "./side-follow-group.component.html",
  styleUrls: ["./side-follow-group.component.css"]
})
export class SideFollowGroupComponent implements OnInit {
  @Input() sideBar: SidebarTypeEnum;
  public SidebarTypeEnum = SidebarTypeEnum;
  objGetGroups: GroupDataModel = new GroupDataModel();
  PageSize: any;
  PageNo: any;
  aboutMeContent: string;
  imagePath: string;
  Group_Id: any;
  objGroupInfo: GroupsModel = new GroupsModel();
  public GroupService = GroupService;
  @Input() groupId: any;
  objTopFollowers: TopFollowersModel[] = [];
  activeTabs = {
    following: false,
    followers: false
  };
  constructor(
    private objRouter: Router,
    private objUserService: UserService,
    public objDataService: DataService,
    private objPostService: PostService,
    private objGroupService: GroupService
  ) {
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {
    if (this.objRouter.url == "/unfollow") {
      this.activeTabs.following = true;
      this.activeTabs.followers = false;
    }
    if (this.objRouter.url == "/follow") {
      this.activeTabs.following = false;
      this.activeTabs.followers = true;
    }

    var user = LoggedInUser.getLoggedInUser();
    if (user) {
      this.objPostService.getTopFollowers().subscribe(res => {
        if (res.StatusCode == 200) {
          this.objTopFollowers = res.Result;
        }
      });

      this.PageSize = 10;
      this.PageNo = 0;
      this.objGroupService
        .getGroups(this.PageSize, this.PageNo)
        .subscribe(res => {
          if (res.StatusCode == 200) {
            this.objGetGroups = res.Result;
          }
        });
      var that = this;
      $(function($) {
        $(".wid_scroll").bind("scroll", function() {
          if (
            $(this).scrollTop() + $(this).innerHeight() >=
            $(this)[0].scrollHeight
          ) {
            that.PageNo++;
            that.objGroupService
              .getGroups(that.PageSize, that.PageNo)
              .subscribe(res => {
                if (res.StatusCode == 200) {
                  res.Result.MyGroups.forEach(grp => {
                    that.objGetGroups.MyGroups.push(grp);
                  });
                }
              });
          }
        });
      });
    }
    if (this.groupId != undefined) {
      this.Group_Id = this.groupId;
      this.getGroupInfo(this.Group_Id);
    }
  }

  cancelJoinRequest(Id) {
    this.objGroupService.cancelJoinRequest(Id).subscribe(res => {
      this.objGroupInfo.Status = res.Result.Status;
    });
  }

  leftGroupByUser(Id) {
    this.objGroupService.leftGroupByUser(Id).subscribe(res => {
      this.objGroupInfo.Status = res.Result.Status;
      this.objDataService.leaveGroup({});
    });
  }

  deleteGroup(Id) {
    this.objGroupService.deleteGroup(Id).subscribe(res => {
      this.objRouter.navigate(["/index"]);
    });
  }
  getGroupInfo(Id) {
    this.objGroupService.getGroupInfo(Id).subscribe(res => {
      if (res.StatusCode == 200) {
        this.objGroupInfo = res.Result;
        this.aboutMeContent = this.objGroupInfo.Description;
      }
      if (res.StatusCode == 500) {
        this.objRouter.navigate(["/index"]);
      }
    });
  }

  joinGroup(Id) {
    this.objGroupService.joinGroup(Id).subscribe(res => {
      this.objGroupInfo.Status = res.Result.Status;
    });
  }
  groupDetailsPage(Id) {
    this.objRouter.navigate(["/group-detail/" + Id]);
  }
  userProfileRedirect(Id) {
    this.objRouter.navigate(["/user-profile/" + Id]);
  }
}
