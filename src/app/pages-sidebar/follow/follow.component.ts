import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { FollowService } from '../../shared/services/follow.service';
import { FollowingModel } from '../../shared/models/followings';
import { UserService } from '../../shared/services/user.service';
import { UserModel } from '../../shared/models/userModel';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoggedInUser } from 'src/app/shared/classes/loggedInUser';
declare var $;
@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css'],
  providers: [Title]
})
export class FollowComponent implements OnInit {
  objFollowers: FollowingModel[] = []
  objUserSettings: UserModel = new UserModel();
  imagePath: any;
  followingIndex: any;
  followingId: any;
  objAccountSetting:UserModel=new UserModel();
  pageSize:number;
  pageNumber:number;
  searchTextFollowings: string = "";
  constructor(private objRouter:Router,private title: Title, private objFollowService:FollowService, private objUserService:UserService ){
    this.imagePath= environment.imagePath;
   }

  unFollow(i) {
    this.objFollowService.unFollow(this.objFollowers[i].FirstUser.Id)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          ;
          this.objFollowers[i].IsFollowing = false;
        }
      });
  }

  setIndex(index) {
    this.followingIndex = index;
    this.followingId = this.objFollowers[index].FirstUser.Id;

    this.objUserService.getUserById(this.followingId)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objAccountSetting = res.Result;
        }
      });

  }

  follow(i) {
    var userId = this.objFollowers[i].FirstUser.Id;
    this.objFollowService.follow(userId)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objFollowers[i].IsFollowing = true;
        }
      });
  }

  userProfileRedirect(Id) {
    this.objRouter.navigate(["/user-profile/" + Id]);
  }
  initializeScripts() {
    $('.followBtn').on('click', function () {
      $(this).toggleClass('following');
      if ($(this).hasClass('following')) {
        $(this).text('Following');
      } else {
        $(this).html('<span class="icon-user-plus"></span> Follow');
      }
    });

    $('body').delegate('.following', 'mouseenter', function () {
      $(this).text('Unfollow');
    }).delegate('.following', 'mouseleave', function () {

      $(this).text('Following');
    });
  }
  followingsSearch() {
 this.objFollowService.getFollowers(this.searchTextFollowings, 0, 1000)
      .subscribe(res => {
        this.objFollowers = res.Result;
      })
  }

  ngOnInit() {
    this.initializeScripts()
    this.objUserService.getUserData()
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objUserSettings = res.Result;
        }
      });

    this.title.setTitle('Follow | Risco');
    Helper.setBodyClass("home-page");
    var user = LoggedInUser.getLoggedInUser();
    this.objFollowService.getFollowers("", this.pageNumber, user['FollowersCount'])
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objFollowers = res.Result;
        }
      });
  }

}
