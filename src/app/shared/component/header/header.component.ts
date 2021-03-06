import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LoggedInUser } from "../../classes/loggedInUser";
import { UserService } from "../../services/user.service";
import { UserModel } from "../../models/userModel";
import { environment } from "../../../../environments/environment";
import { GroupService } from "../../services/group.service";
import { GroupsModel } from "../../models/groups";
import { GroupsModelGeneral } from "../../models/groups-model";
import { GeneralSearchModel } from "../../models/general-search";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { NotificationsModel } from "../../models/notification";
import { CommentPostModel } from "../../models/comment-post";
import { GetPostModel } from "../../models/get-post";
import { PostModel } from "../../models/post";
import { PostService } from "../../services/post.service";
import { AppComponent } from "../../../app.component";
import { chatMessageRequestModel } from "../../models/chat-message-request";
import { MessagingService } from "../../../shared/services/push-notifications";
import { Helper } from "../../helpers/utilities";
import { MediaTypeEnum } from "../../enum/media-type-enum";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji";
import { GroupDetailComponent } from "../../../../app/group/group-detail/group-detail.component";
import { DataService } from "../../services/data-service";

declare var $: any;
declare var google: any;
declare var FriendRequest: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  MessagingService = MessagingService;
  fullName: string = "";
  btnloader: boolean;
  btnloader1: boolean;
  public HeaderComponent = HeaderComponent;
  static objAccountSetting: UserModel = new UserModel();
  objNotificationsModel: NotificationsModel = new NotificationsModel();
  objSearchModel: GeneralSearchModel = new GeneralSearchModel();
  public UserService = UserService;
  imagePath: any;
  searchText: string = "";
  objUserSettings: UserModel = new UserModel();
  objGetPostSettingsById: CommentPostModel = new CommentPostModel();
  objGetPostSettings: GetPostModel = new GetPostModel();
  objPostSettings: PostModel = new PostModel();
  CommentsPicture: string;
  openPopupComment: Function;
  openPopupChildComment: Function;
  objChildCommentText: string = "";
  objCommentText: string = "";
  PageSize: number = 10;
  pageNo: number = 0;
  scope: string = "";
  hasNoti: boolean;
  internalPostId: number;
  hideAllPostInternalIndex: any;
  notificationsLength: number;
  static checkLogin: boolean;
  chatList: chatMessageRequestModel[] = [];

  GroupId: number = 0;

  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public commentReplyImageUrls = [];
  public commentReplyVideoUrls = [];
  public mediaTypeEnum = MediaTypeEnum;
  public PostService = PostService;

  constructor(
    public postService: PostService,
    private groupDetailComponent: GroupDetailComponent,
    private objLoggedInUser: LoggedInUser,
    private objPostService: PostService,
    private objRouter: Router,
    public objUserService: UserService,
    private groupService: GroupService,
    public appComponent: AppComponent,
    public objDataService: DataService
  ) {
    this.imagePath = environment.imagePath;
    setInterval(() => {
      this.getNotifications();
      this.MessagingService.notificationUnread = false;
    }, 5000);
    this.btnloader = false;
    this.btnloader1 = false;
  }


  hideMsgBar() {
    $(".msgbar-dropdown").css("display", "none");
    $(".overlay-bg").removeClass("show");
    $("body").css("position", "static");
  }

  ngOnInit() {
    this.objDataService.notifyObservable$.subscribe((data) => {
      if (data != undefined) {
        console.log("hello");
        this.commentClicked(data, undefined);
      }
    });

    let __this = this;
    this.objUserService.objUSerModel = LoggedInUser.getLoggedInUser();
    const notifyVar = JSON.parse(localStorage.getItem("notify"));
    if (notifyVar != null && notifyVar != undefined) {
      if (notifyVar == true) {
        this.objUserService.hasNotifications = true;
      } else {
        this.objUserService.hasNotifications = false;
      }
    } else {
      this.objUserService.hasNotifications = false;
    }

    this.loadChatMessages();
    var user = LoggedInUser.getLoggedInUser();
    if (location.hash != "#/signin" && user) {
      HeaderComponent.checkLogin = true;
      if (user) {
        this.fullName = user.FullName;
      }
    }
    this.initializeScripts();

    if (location.hash != "/signin" && user) {
      this.objUserService.getUserData().subscribe((res) => {
        if (res.StatusCode == 200) {
          HeaderComponent.objAccountSetting = res.Result;
          this.getNotifications();
        }
      });

      this.objPostService
        .getPosts(this.PageSize, this.pageNo)
        .subscribe((res) => {
          {
            if (res.StatusCode == 200) {
              this.objGetPostSettings = res.Result;

              for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
                var newDate = new Date(
                  this.objGetPostSettings.Posts[i].CreatedDate + "Z"
                );

                this.objGetPostSettings.Posts[i].CreatedDate = newDate;
                if (this.objGetPostSettings.Posts[i].Text != null) {
                  this.objGetPostSettings.Posts[
                    i
                  ].Text = Helper.detectAndCreateLinks(
                    this.objGetPostSettings.Posts[i].Text
                  );
                }
                this.objGetPostSettings.Posts[i].IsToggled = false;
              }

              setTimeout(() => {
                $(".fancyImage").click(function () {
                  $(this)
                    .parent()
                    .children("a.fancyImage")
                    .each(function () {
                      $(this).attr("data-fancybox", "image");
                    });
                });

                $("[data-fancybox]").fancybox({
                  touch: false,
                  afterClose: function () {
                    $.fancybox.destroy();
                    //$(".fancyImage").attr("data-fancybox", "");
                    $(".postdetail .field").removeClass("act");
                    __this.onRemoveFile(__this.mediaTypeEnum.Image, 0);
                    __this.onRemoveFile(__this.mediaTypeEnum.Video, 0);
                    __this.objCommentText = "";
                    __this.objChildCommentText = "";
                    $(".emoji-mart").fadeOut("200");
                    $(".parent-comment-area").removeClass("act");
                    $(".child-comment-area").removeClass("act");
                  },
                });
              }, 599);
            }
          }
        });
    }

    this.objRouter.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (LoggedInUser.getLoggedInUser()) {
          this.getNotifications();
        }
      }
    });

    // var that = this;
    // $(window).scroll(function () {

    //   debugger

    //   if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
    //     that.pageNo++;

    //     // that.scrollLoader = true;
    //     // that.scrollLoader = false;

    //     that.getNotifications();
    //   }
    // });



          // var that = this;
          // $(function ($) {

          //     debugger

          //     $('.notiScrol').bind('scroll', function () {
          //       if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
          //         that.pageNo++;

          //         // that.scrollLoader = true;
          //         // that.scrollLoader = false;

          //       //  that.getNotifications();


          //       if (that.objUserService && !that.objUserService.objUSerModel) {
          //         return false;
          //       }
          //       if (HeaderComponent && HeaderComponent.objAccountSetting && HeaderComponent.objAccountSetting.Id) {
          //         that.objUserService
          //           .getNotifications(HeaderComponent.objAccountSetting.Id, 0, that.pageNo, that.PageSize)
          //           .subscribe((res) => {
          //             if (res.StatusCode == 200) {

          //               // that.objNotificationsModel = res.Result;

          //               for (var i = 0; i < res.Result.Notifications.length; i++) {

          //                 var newDate = new Date(res.Result.Notifications[i].CreatedDate + "Z");
          //                 res.Result.Notifications[i].CreatedDate = newDate;
          //                 that.objNotificationsModel.Notifications.push(res.Result.Notifications[i]);
          //               }
          //             }
          //           });
          //       }




          //       }
          //     })


          //     $(".notiScrol" ).scroll(function() {

          //       console.log('scroll');

          //     });
          //   }
          // );

          // $(".notiScrol" ).scroll(function() {

          //   console.log('scroll');

          // });


  }

  setPopupActionComment(fn: any) {
    this.objCommentText = "";
    this.openPopupComment = fn;
  }
  popuuComment() {
    this.openPopupComment(false);
  }

  popuuChildComment() {
    this.openPopupChildComment(false);
  }

  setPopupActionChildComment(fn: any) {
    this.objChildCommentText = "";
    this.openPopupChildComment = fn;
  }

  postComment(text) {
    this.btnloader = true;
    this.objPostService
      .postComment(
        text,
        this.objGetPostSettingsById.Id,
        0,
        this.uploadedImageUrls[0],
        this.uploadedVideoUrls[0]
      )
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          res.Result.User = this.objUserSettings;
          this.objGetPostSettingsById.Comments.push(res.Result);
          this.objGetPostSettingsById.CommentsCount =
            this.objGetPostSettingsById.CommentsCount + 1;

          var obj = this.objGetPostSettings.Posts.find(
            (x) => x.Id == this.objGetPostSettingsById.Id
          );
          if (obj) {
            obj.CommentsCount = obj.CommentsCount + 1;
          }
          this.objCommentText = "";
          $("#comnt").val("");
          text = "";

          this.onRemoveFile(this.mediaTypeEnum.Image, 0);
          this.onRemoveFile(this.mediaTypeEnum.Video, 0);
          $(".user-comment .field").removeClass("act");
        }
        this.btnloader = false;
      });
  }

  commentStarClicked(i) {
    $(event.target).toggleClass("icon-thumbs-up icon-thumbs-up2");
    if (this.objGetPostSettingsById.Comments[i].IsLiked == true) {
      this.objPostService
        .unLikeComment(
          this.objGetPostSettingsById.Comments[i].Id,
          this.objGetPostSettingsById.Id
        )
        .subscribe((res) => {
          this.objGetPostSettingsById.Comments[i].IsLiked = false;
        });
    } else {
      this.objPostService
        .likeComment(
          this.objGetPostSettingsById.Comments[i].Id,
          this.objGetPostSettingsById.Id
        )
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objGetPostSettingsById.Comments[i].IsLiked = true;
          }
        });
    }
  }

  replyComment(id, text) {
    this.btnloader1 = true;
    this.objPostService
      .commentReply(
        text,
        this.objGetPostSettingsById.Id,
        id,
        this.commentReplyImageUrls[0],
        this.commentReplyVideoUrls[0]
      )
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          res.Result.User = this.objUserSettings;
          this.objGetPostSettingsById.Comments.find(
            (x) => x.Id == res.Result.ParentComment_Id
          ).ChildComments.push(res.Result);
          this.objGetPostSettingsById.CommentsCount =
            this.objGetPostSettingsById.CommentsCount + 1;
        }
        var obj = this.objGetPostSettings.Posts.find(
          (x) => x.Id == this.objGetPostSettingsById.Id
        );
        if (obj) {
          obj.CommentsCount = obj.CommentsCount + 1;
        }
        this.objChildCommentText = "";
        $("#replyText").val("");
        //text.reset();
        text = "";
        this.onRemoveFile(this.mediaTypeEnum.Image, 0);
        this.onRemoveFile(this.mediaTypeEnum.Video, 0);
        $(".sub_comment_btn").find("span").removeClass("act");
        $(".sub_comment_btn")
          .parents(".actBtns")
          .next(".sub_comment_box")
          .hide();
        this.btnloader1 = false;
      });
  }

  internalStarClicked() {
    $(event.target).toggleClass("icon-thumbs-up icon-thumbs-up2");
    if (this.objGetPostSettingsById.IsLiked == true) {
      this.objPostService
        .unlikePost(this.objGetPostSettingsById.Id)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objGetPostSettingsById.IsLiked = false;
            this.objGetPostSettingsById.LikesCount =
              this.objGetPostSettingsById.LikesCount - 1;
            var obj = this.objGetPostSettings.Posts.find(
              (x) => x.Id == this.objGetPostSettingsById.Id
            );
            if (obj) {
              obj.IsLiked = false;
              obj.LikesCount = obj.LikesCount - 1;
            }
          }
        });
    } else {
      this.objPostService
        .likePost(this.objGetPostSettingsById.Id)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objGetPostSettingsById.IsLiked = true;
            this.objGetPostSettingsById.LikesCount =
              this.objGetPostSettingsById.LikesCount + 1;

            var obj = this.objGetPostSettings.Posts.find(
              (x) => x.Id == this.objGetPostSettingsById.Id
            );
            if (obj) {
              obj.IsLiked = true;
              obj.LikesCount = obj.LikesCount + 1;
            }
          }
        });
    }
  }

  moreClick(obj) {
    if (!obj.IsToggled) {
      $("body").delegate(".cart-footer .more", "click", function (e) {
        e.stopPropagation();
        $(this).find(".more-dropdown").show();
        $(this).siblings().find(".more-dropdown").hide();
      });

      obj.IsToggled = true;
    } else {
      $(this).find(".more-dropdown").show();
      $(this).find(".more-dropdown").show();

      obj.IsToggled = false;
    }
  }

  setIndexInternal(id, internalPostId) {
    this.scope = "internal";
    this.hideAllPostInternalIndex = id;
    this.internalPostId = internalPostId;
  }

  getLocation() {
    var that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var latlng;

        latlng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        new google.maps.Geocoder().geocode({ latLng: latlng }, function (
          results,
          status
        ) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              var country = null,
                countryCode = null,
                city = null,
                cityAlt = null;
              var c, lc, component;
              for (var r = 0, rl = results.length; r < rl; r += 1) {
                var result = results[r];

                if (!city && result.types[0] === "locality") {
                  for (
                    c = 0, lc = result.address_components.length;
                    c < lc;
                    c += 1
                  ) {
                    component = result.address_components[c];

                    if (component.types[0] === "locality") {
                      city = component.long_name;
                      break;
                    }
                  }
                } else if (
                  !city &&
                  !cityAlt &&
                  result.types[0] === "administrative_area_level_1"
                ) {
                  for (
                    c = 0, lc = result.address_components.length;
                    c < lc;
                    c += 1
                  ) {
                    component = result.address_components[c];

                    if (component.types[0] === "administrative_area_level_1") {
                      cityAlt = component.long_name;
                      break;
                    }
                  }
                } else if (!country && result.types[0] === "country") {
                  country = result.address_components[0].long_name;
                  countryCode = result.address_components[0].short_name;
                }

                if (city && country) {
                  break;
                }
              }

              //console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
              that.objPostSettings.Location = city;
              // IndexComponent.city = city;
              //  document.getElementById('cityAlt').innerHTML = cityAlt;
              //  document.getElementById('country').innerHTML = country;
              //  document.getElementById('countryCode').innerHTML = countryCode;
            }
          }
        });
      });
    }
  }

  commentClicked(id, e) {
    let __this = this;
    this.objPostService.getPostsByPostId(id).subscribe((res) => {
      if (res.StatusCode == 500) {
        $(".overlay-bg.show").css("visibility", "hidden");
        $.notify({ message: res.Result }, { type: "danger" });

        $.fancybox.close();
        setTimeout(() => {
          $(".alert-danger").remove();
        }, 1000);
        return false;
      } else {
        if (res.Result.Text != null) {
          res.Result.Text = Helper.detectAndCreateLinks(res.Result.Text);
        }

        $(".alert-danger").remove();
        $(".nofication_msgs").css("display", "none");
        $(".overlay-bg").removeClass("show");
        $("body").css("position", "static");

        $.fancybox.open({
          src: "#postdetail-header",
          modal: true,
        });

        this.objGetPostSettingsById = res.Result;
        this.CommentsPicture =
          this.objGetPostSettingsById && this.objGetPostSettingsById.User
            ? this.objGetPostSettingsById.User.ProfilePictureUrl
            : "";
        var newDate = new Date(this.objGetPostSettingsById.CreatedDate + "Z");
        this.objGetPostSettingsById.CreatedDate = newDate;

        for (var i = 0; i < this.objGetPostSettingsById.Comments.length; i++) {
          var newDateComments = new Date(
            this.objGetPostSettingsById.Comments[i].CreatedDate + "Z"
          );
          this.objGetPostSettingsById.Comments[i].CreatedDate = newDateComments;
        }

        for (var i = 0; i < this.objGetPostSettingsById.Comments.length; i++) {
          for (
            var k = 0;
            k < this.objGetPostSettingsById.Comments[i].ChildComments.length;
            k++
          ) {
            var newDateCommentsChild = new Date(
              this.objGetPostSettingsById.Comments[i].ChildComments[k]
                .CreatedDate + "Z"
            );
            this.objGetPostSettingsById.Comments[i].ChildComments[
              k
            ].CreatedDate = newDateCommentsChild;
          }
          setTimeout(() => {
            $(".fancyImage").click(function () {
              $(this)
                .parent()
                .children("a.fancyImage")
                .each(function () {
                  $(this).attr("data-fancybox", "image");
                });
            });

            $("[data-fancybox]").fancybox({
              touch: false,
              afterClose: function () {
                $.fancybox.destroy();
                $(".postdetail .field").removeClass("act");
                __this.onRemoveFile(__this.mediaTypeEnum.Image, 0);
                __this.onRemoveFile(__this.mediaTypeEnum.Video, 0);
                __this.objCommentText = "";
                __this.objChildCommentText = "";
                $(".emoji-mart").fadeOut("200");
                $(".parent-comment-area").removeClass("act");
                $(".child-comment-area").removeClass("act");
              },
            });
          }, 300);
        }
        this.objGetPostSettingsById.Comments = this.objGetPostSettingsById
          .Comments.length
          ? this.objGetPostSettingsById.Comments.reverse()
          : this.objGetPostSettingsById.Comments;
      }
    });
  }

  closeFancy() {
    $.fancybox.close();
    $.fancybox.close();
  }

  // detectLinks(postText: string) {
  //     //  detect links in post
  //     var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/ig

  //     postText = postText.replace(regex, "<a target='_blank' class='anchorClass' href='//$1'>$1</a> ");
  //     return postText.replace("//http://", "http://").replace("//https://", "https://");
  // }

  logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("notify");
    this.objUserService.objUSerModel = null;
    this.objRouter.navigate(["/signin"]);

    // AppComponent.destroyChat();
  }

  getNotifications() {

    if (this.objUserService && !this.objUserService.objUSerModel) {
      return false;
    }

    if (HeaderComponent && HeaderComponent.objAccountSetting && HeaderComponent.objAccountSetting.Id) {

      this.objUserService
        .getNotifications(HeaderComponent.objAccountSetting.Id, 0, this.pageNo, this.PageSize)
        .subscribe((res) => {

          if (res.StatusCode == 200) {
            this.objNotificationsModel = res.Result;
            for (var i = 0; i < this.objNotificationsModel.Notifications.length; i++) {

              var newDate = new Date(this.objNotificationsModel.Notifications[i].CreatedDate + "Z");
              this.objNotificationsModel.Notifications[i].CreatedDate = newDate;
            }
          }

        });
    }

  }

  markAsRead(notificationId, i, entityId, _e) {
    this.objUserService.markAsRead(notificationId).subscribe((res) => {

      if (res.StatusCode == 200) {
        this.objNotificationsModel.Notifications[i].Status = 1;
        $(".nofication_msgs").css("display", "none");

        //if noti is group join request then dont call the below method
        if (this.objNotificationsModel.Notifications[i].EntityType != 12) {

          this.commentClicked(entityId, _e);
        }
        //if noti is group join request then remove the background overlay
        if (this.objNotificationsModel.Notifications[i].EntityType == 12) {

          this.GroupId = this.objNotificationsModel.Notifications[i].EntityId;

          $(".overlay-bg").removeClass("show");
        }

      }
    });
  }



  acceptJoinRequestByUser() {


    if (this.GroupId != 0) {

      this.groupService.acceptJoinRequestByUser(this.GroupId).subscribe((res) => {

        this.objRouter.navigate(["/group-detail/" + this.GroupId]);
        this.groupDetailComponent.initializeData(this.GroupId);
        $(".autocomplete_pnl").fadeOut();
      });
    }
  }


  rejectJoinRequestByUser() {

    if (this.GroupId != 0) {

      this.groupService.rejectJoinRequestByUser(this.GroupId).subscribe((res) => {

      });
    }
  }





  search() {
    if (this.searchText == "") {
      $(".autocomplete_pnl").fadeOut();
      return;
    }
    this.objUserService.searchGroup(this.searchText).subscribe((res) => {
      $(".searchField .autocomplete_pnl").fadeIn();
      this.objSearchModel = res.Result;
    });
  }

  userProfileRedirect(userId) {
    $(".nofication_msgs").css("display", "none");
    $(".overlay-bg").removeClass("show");

    if (userId == HeaderComponent.objAccountSetting.Id)
      this.objRouter.navigate(["/profile"]);
    else this.objRouter.navigate(["/user-profile/" + userId]);
    $(".autocomplete_pnl").fadeOut();
  }

  groupRedirect(Id) {
    $(".nofication_msgs").css("display", "none");
    $(".overlay-bg").removeClass("show");
    this.objRouter.navigate(["/group-detail/" + Id]);
    this.groupDetailComponent.initializeData(Id);
    $(".autocomplete_pnl").fadeOut();
  }


  seeAllNotificationsRedirect() {

    $(".nofication_msgs").css("display", "none");
    $(".overlay-bg").removeClass("show");

    this.objRouter.navigate(["/notfications"]);
    $(".autocomplete_pnl").fadeOut();
  }


  initializeScripts() {
    $('[data-toggle="tooltip"]').tooltip();
    /* Main Menu */
    // $('.icon-menu').click(function () {
    //     $(this).next('.header-dropdown').slideDown();
    //     $('.overlay-bg').addClass('show');
    //     $('body').css("position", "fixed");
    //     $('body').css("width", "100%");
    // });

    $(".dropdown-link > span").click(function () {
      $(this).next(".header-dropdown").slideDown();
      $(".overlay-bg").addClass("show");
      // $('body').css("position", "fixed");
      $("body").css("width", "100%");
    });

    // $('.menu li a').on('click', function () {
    //     $('.header-dropdown').slideUp();
    //     $('.overlay-bg').removeClass('show');
    //     $('body').css("position", "static");
    // });

    $(".noti-msg-row").on("click", function () {
      $(".header-dropdown").slideUp();
      $(".overlay-bg").removeClass("show");
      $("body").css("position", "static");
    });

    // /* Status Update */
    // $('.post-panel').on('click', function () {
    //     $(this).find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     $('body').css("position", "fixed");
    //     $('body').css("width", "100%");
    // });

    // /* Black overlay Click */
    // $('.overlay-bg').click(function () {
    //     $(this).removeClass('show');
    //     $('.header-dropdown').slideUp();
    //     $('body').css("position", "static");
    //     $('.update_status').fadeOut();
    // });

    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).addClass("act");
      $(this).find("textarea").addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
      $(".user-comment .field .sent_btn").addClass("showIcon");
    });

    $("#parent-img-header").click(function (e) {
      e.stopPropagation();
      $("#uploadpicCmnt-header").click();
      e.stopPropagation();
    });

    $("#child-img-header").click(function (e) {
      e.stopPropagation();
      $("#uploadpicCmntReply-header").click();
      e.stopPropagation();
    });

    $("#parent-vdo-header").click(function (e) {
      e.stopPropagation();
      $("#uploadvdoCmnt-header").click();
    });

    $("#child-vdo-header").click(function (e) {
      e.stopPropagation();
      $("#uploadvdoCmntReply-header").click();
      e.stopPropagation();
    });
  }

  loadChatMessages() {
    this.chatList = [];
    if (AppComponent.isChatInitialized && FriendRequest) {
      FriendRequest.LoadExistingAcceptedRequests((messageAndRequestList) => {
        if (messageAndRequestList && messageAndRequestList.length > 0) {
          messageAndRequestList.forEach((item) => {
            if (item.message) {
              var message = JSON.parse(item.message);
              var request = JSON.parse(item.request);
              var chatMessageRequestMode = new chatMessageRequestModel(
                message,
                request
              );

              this.chatList.push(chatMessageRequestMode);
            }
          });
        }

        this.chatList = this.chatList.sort(
          (a: any, b: any) =>
            new Date(b.message.date).getTime() -
            new Date(a.message.date).getTime()
        );
      });
    }
  }

  //#region ----MenuBar----
  public isMenuDisplayed = false;

  openMenu() {
    this.isMenuDisplayed = true;
    // $('body').css("position", "fixed");
    $("body").css("width", "100%");
  }
  closeMenu() {
    this.isMenuDisplayed = false;
    $("body").css("position", "static");
  }
  //#endregion

  onOverlayClick() {
    if (this.isMenuDisplayed) this.closeMenu();
    $(".overlay-bg").removeClass("show");
    $(".nofication_msgs").slideUp();
    $(".msgbar-dropdown").slideUp();
  }

  //#region
  OnFileSelectionMedia(mediaType: MediaTypeEnum, IsParentComment: number) {
    var fileList: any = (<HTMLInputElement>event.target).files;
    var files = [];
    for (let file of fileList) files.push(file);
    if (
      mediaType == MediaTypeEnum.Image &&
      files.findIndex((x) => x.type.indexOf("image") === -1) > -1
    ) {
      $(".alert-danger").remove();
      $.notify({ message: "Please select images only." }, { type: "danger" });
    } else if (
      mediaType == MediaTypeEnum.Video &&
      files.findIndex((x) => x.type.indexOf("video") === -1) > -1
    ) {
      $(".alert-danger").remove();
      $.notify({ message: "Please select video only." }, { type: "danger" });
    } else if (files.findIndex((x) => x.size > 20971520) > -1) {
      $(".alert-danger").remove();
      $.notify({ message: "No file can exceed 20MB." }, { type: "danger" });
    } else {
      for (let file of files) {
        this.postService.uploadPostMedia(file, mediaType).subscribe((res) => {
          if (res.StatusCode == 200) {
            if (mediaType == MediaTypeEnum.Image) {
              if (IsParentComment == 1) {
                this.onRemoveFile(this.mediaTypeEnum.Image, 0);
                this.uploadedImageUrls.push(res.Result);
              } else {
                this.onRemoveFile(this.mediaTypeEnum.Video, 0);
                this.commentReplyImageUrls.push(res.Result);
              }
            } else {
              if (IsParentComment == 1) this.uploadedVideoUrls.push(res.Result);
              else this.commentReplyVideoUrls.push(res.Result);
            }
            if (IsParentComment) {
              $("#comnt").css("display", "inline-block").click();
              $(".user-comment .field").click();
              $(".postdetail .user-comment textarea").focus();
            }
            // $(".fancyImage").click(function () {
            //     $(this).parent().children("a.fancyImage").each(function () {
            //         $(this).attr("data-fancybox", "image");
            //     });
            // });

            // $('[data-fancybox]').fancybox({
            //     touch: false,
            //     "afterClose": function () {
            //         $(".fancyImage").attr("data-fancybox", "");
            //     }
            // });
          }
        });
      }
    }

    $("#uploadpicCmnt-header").val("");
    $("#uploadvdoCmnt-header").val("");
    $("#uploadpicCmntReply-header").val("");
    $("#uploadvdoCmntReply-header").val("");
  }

  onRemoveFile(mediaType: MediaTypeEnum, index: number) {
    if (mediaType == MediaTypeEnum.Image) {
      this.uploadedImageUrls.splice(index, 1);
      this.commentReplyImageUrls.splice(index, 1);
    } else {
      this.uploadedVideoUrls.splice(index, 1);
      this.commentReplyVideoUrls.splice(index, 1);
    }
  }

  triggerClick(elemId) {
    $("#" + elemId).click();
  }
  //#endregion

  //#region EmojiArea
  addEmoji($event: EmojiEvent, isParent: number) {
    if (isParent == 1) this.objCommentText += $event.emoji["native"];
    else this.objChildCommentText += $event.emoji["native"];
  }
  showEmojee(isParent: number) {
    if (isParent == 1) {
      // let elements: NodeListOf<Element> = document.getElementsByClassName("parent-comment-area");

      let elements = document.getElementsByClassName("parent-comment-area");
      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    } else {
      // let elements: NodeListOf<Element> = document.getElementsByClassName("child-comment-area");
      let elements = document.getElementsByClassName("child-comment-area");
      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    }
  }
  //#endregion
}
