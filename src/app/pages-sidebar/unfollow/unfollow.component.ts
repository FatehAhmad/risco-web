import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FollowService } from '../../shared/services/follow.service';
import { FollowingModel } from '../../shared/models/followings';
import { UserService } from '../../shared/services/user.service';
import { UserModel } from '../../shared/models/userModel';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoggedInUser } from '../../../app/shared/classes/loggedInUser';
declare var $;
@Component({
  selector: 'app-unfollow',
  templateUrl: './unfollow.component.html',
  styleUrls: ['./unfollow.component.css']
})
export class UnFollowComponent implements OnInit {

  objFollowings: FollowingModel[] = [];
  IsUserFollow: boolean = true;
  objUserSettings: UserModel = new UserModel();
  imagePath: any;
  followingIndex: any;
  follwingPicture: any;
  followingId: number;
  objAccountSetting: UserModel = new UserModel();
  searchTextFollowings: string = "";
  pageSize: number;
  pageNo: number;
  objSearchModel: any;
  constructor(private objRouter: Router,
     private title: Title,
      private objFollowService: FollowService, private objUserService: UserService) {
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {
    this.pageSize = 10;
    this.pageNo = 0;

    this.title.setTitle('UnFollow | Risco');
    this.initializeScripts();
    debugger
    this.objUserService.getUserData()
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objUserSettings = res.Result;
          this.getFollowingList('', this.pageNo, (this.objUserSettings['FollowingCount']) ? this.objUserSettings['FollowingCount'] : 0)
        }
      });

    


    var that = this;
    // $(function ($) {
    //   $('.following_scroll').bind('scroll', function () {
    //     if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
    //       that.pageNo++;
    //       that.objFollowService.getFollowings("", this.pageNo, this.pageSize)
    //         .subscribe(res => {
    //           {
    //             if (res.StatusCode == 200) {
    //               res.Result.forEach(followings => {
    //                 that.objFollowings.push(followings);
    //                 followings.IsUserFollow = true;
    //               });
    //             }
    //           }
    //         });
    //     }
    //   })
    // });
  }

  getFollowingList(text , page , _count) {
    this.objFollowService.getFollowings(text, page , _count )
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objFollowings = res.Result;
          for (let obj of this.objFollowings) {
            obj.IsUserFollow = true;
          }
        }
      });
  }

  followingsSearch() {
    this.objFollowService.getFollowings(this.searchTextFollowings, 0, 1000)
      .subscribe(res => {
        this.objFollowings = res.Result;
      })
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

  setIndex(index) {
    this.followingIndex = index;
    this.followingId = this.objFollowings[index].SecondUser.Id;

    this.objUserService.getUserById(this.followingId)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objAccountSetting = res.Result;
        }
      });

  }

  userProfileRedirect(Id) {
    this.objRouter.navigate(["/user-profile/" + Id]);
  }

  unFollow(i) {
    this.objFollowService.unFollow(this.objFollowings[i].SecondUser.Id)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objFollowings[i].IsUserFollow = false;
        }
      });
  }

  follow(i) {
    var userId = this.objFollowings[i].SecondUser.Id;
    this.objFollowService.follow(userId)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objFollowings[i].IsUserFollow = true;
        }
      });
  }

  search() {

  }

}
