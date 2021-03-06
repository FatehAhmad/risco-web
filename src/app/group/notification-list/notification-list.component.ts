import { Component, OnInit } from "@angular/core";
import { Helper } from "../../shared/helpers/utilities";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";
import { ActivityLogModel } from "../../shared/models/activity-logs";
import { ActivityLogsService } from "../../shared/services/activity-log.service";
import { UserService } from "../../shared/services/user.service";
import { UserModel } from "../../shared/models/userModel";
import { Router } from "../../../../node_modules/@angular/router";
import { CommentPostModel } from "../../shared/models/comment-post";
import { PostService } from "../../shared/services/post.service";
import { GetPostModel } from "../../shared/models/get-post";
import { PostModel } from "../../shared/models/post";
import { AppComponent } from "../../app.component";
import { ActivityEntityTypeEnum } from "../../shared/enum/activity-Entity-Type-enum";
import { MediaTypeEnum } from "../../shared/enum/media-type-enum";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji";
import { NotificationsModel } from "src/app/shared/models/notification";
import { LoggedInUser } from "../../shared/classes/loggedInUser";


declare var $;
declare var google: any;
@Component({
  selector: "app-notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.css"],
  providers: [Title],
})
export class NotificationListComponent implements OnInit {
  imagePath: any;
  public ActivityEntityTypeEnum = ActivityEntityTypeEnum;
  objActivities: ActivityLogModel[] = [];
  objNotificationsModel: NotificationsModel = new NotificationsModel();
  objUserSettings: UserModel = new UserModel();
  objGetPostSettingsById: CommentPostModel = new CommentPostModel();
  objGetPostSettings: GetPostModel = new GetPostModel();
  objPostSettings: PostModel = new PostModel();
  CommentsPicture: string;
  openPopupComment: Function;
  openPopupChildComment: Function;
  objChildCommentText: string = "";
  objCommentText: string = "";
  PageSize: number;
  pageNo: number;
  scrollLoader: boolean;
  scope: string = "";
  internalPostId: number;
  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public commentReplyImageUrls = [];
  public commentReplyVideoUrls = [];
  public mediaTypeEnum = MediaTypeEnum;
  public PostService = PostService;
  hideAllPostInternalIndex: any;

  constructor(
    public postService: PostService,
    private objRouter: Router,
    private objPostService: PostService,
    private title: Title,
    private loggedInUser: LoggedInUser,
    private objUserService: UserService,
    private objActivityLogsService: ActivityLogsService,
    public appComponent: AppComponent
  ) {
    this.imagePath = environment.imagePath;
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

  initializeScripts() {
    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).addClass("act");
      $(this).find("textarea").addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
      $(".user-comment .field .sent_btn").addClass("showIcon");
    });

    $("#parent-img").click(function (e) {
      e.stopPropagation();
      $("#uploadpicCmnt").click();
      e.stopPropagation();
    });

    $("#child-img").click(function (e) {
      e.stopPropagation();
      $("#uploadpicCmntReply").click();
      e.stopPropagation();
    });

    $("#parent-vdo").click(function (e) {
      e.stopPropagation();
      $("#uploadvdoCmnt").click();
    });

    $("#child-vdo").click(function (e) {
      e.stopPropagation();
      $("#uploadvdoCmntReply").click();
      e.stopPropagation();
    });
  }

  ngOnInit() {
    this.PageSize = 26;
    this.pageNo = 0;
    this.initializeScripts();

    this.title.setTitle("Notifications | Risco");
    Helper.setBodyClass("home-page");

    this.objActivityLogsService.getActivityLogs(this.pageNo, this.PageSize).subscribe((res) => {
      this.objActivities = res.Result;

      for (var i = 0; i < this.objActivities.length; i++) {
        var newDate = new Date(this.objActivities[i].CreatedDate + "Z");
        this.objActivities[i].CreatedDate = newDate;
      }
      for (let i = 0; i < this.objActivities.length; i++) {
        if (this.objActivities[i]["EntityType"] == 30) {
          this.objActivities.splice(i, 1);
          i--;
        }
      }
    });



    if (this.objUserService && !this.objUserService.objUSerModel) {
      return false;
    }

    let user = LoggedInUser.getLoggedInUser()

      this.objUserService
        .getNotifications(user.Id, 0, this.pageNo, this.PageSize)
        .subscribe((res) => {

          if (res.StatusCode == 200) {


            this.objNotificationsModel = res.Result;
            for (var i = 0; i < this.objNotificationsModel.Notifications.length; i++) {

              var newDate = new Date(this.objNotificationsModel.Notifications[i].CreatedDate + "Z");
              this.objNotificationsModel.Notifications[i].CreatedDate = newDate;
            }
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
              this.objGetPostSettings.Posts[i].Text = this.detectLinks(
                this.objGetPostSettings.Posts[i].Text
              );
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
                  $(".fancyImage").attr("data-fancybox", "");
                },
              });
            }, 599);
          }
        }
      });

    this.objUserService.getUserData().subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objUserSettings = res.Result;
      }
    });

    var that = this;
    $(window).scroll(function () {

      if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
        that.pageNo++;

        that.scrollLoader = true;


        that.objUserService
        .getNotifications(user.Id, 0, that.pageNo, that.PageSize)
        .subscribe((res) => {

          if (res.StatusCode == 200) {


            // that.objNotificationsModel = res.Result;

              for (var i = 0; i < res.Result.Notifications.length; i++) {

              var newDate = new Date(res.Result.Notifications[i].CreatedDate + "Z");
              res.Result.Notifications[i].CreatedDate = newDate;
              that.objNotificationsModel.Notifications.push(res.Result.Notifications[i]);
            }
            that.scrollLoader = false;
          }

        });

        // that.objActivityLogsService.getActivityLogs(that.pageNo, that.PageSize).subscribe((res) => {
        //   {
        //     that.scrollLoader = false;

        //     if (res.StatusCode == 200) {
        //       // that.objActivities = that.objActivities + res.Result;

        //       // that.objActivities.concat(res.Result);

        //       for (var i = 0; i < res.Result.length; i++) {
        //         var newDate = new Date(res.Result[i].CreatedDate + "Z");
        //         res.Result[i].CreatedDate = newDate;
        //       }
        //       for (let i = 0; i < res.Result.length; i++) {
        //         if (res.Result[i]["EntityType"] == 30) {
        //           res.Result.splice(i, 1);
        //           i--;
        //         }
        //         that.objActivities.push(res.Result[i]);
        //       }
        //     }
        //   }
        // });
      }
    });
  }

  removeActivityLog(Id, index) {
    this.objActivityLogsService.removeActivityLog(Id).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objActivities = this.objActivities.filter(
          (x) => x.Id != res.Result.Id
        );
        this.objActivities.splice(index, 1);
      }
    });
  }

  removeAllActivityLog(Id) {
    this.objActivityLogsService.removeAllActivityLogs().subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objActivities = [];
      }
    });
  }

  //#region
  onSelectFile(mediaType: MediaTypeEnum, IsParentComment: number) {
    var fileList: any = (<HTMLInputElement>event.target).files;
    var files = [];
    for (let file of fileList) files.push(file);
    if (
      mediaType == MediaTypeEnum.Image &&
      files.findIndex((x) => x.type.indexOf("image") === -1) > -1
    ) {
      $.notify({ message: "Please select images only." }, { type: "danger" });
    } else if (
      mediaType == MediaTypeEnum.Video &&
      files.findIndex((x) => x.type.indexOf("video") === -1) > -1
    ) {
      $.notify({ message: "Please select video only." }, { type: "danger" });
    } else if (files.findIndex((x) => x.size > 20971520) > -1) {
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

    $("#uploadpicCmnt").val("");
    $("#uploadvdoCmnt").val("");
    $("#uploadpicCmntReply").val("");
    $("#uploadvdoCmntReply").val("");
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

  postComment(text) {
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

          this.objActivityLogsService.getActivityLogs(this.pageNo, this.PageSize).subscribe((res) => {
            this.objActivities = res.Result;

            for (var i = 0; i < this.objActivities.length; i++) {
              var newDate = new Date(this.objActivities[i].CreatedDate + "Z");
              this.objActivities[i].CreatedDate = newDate;
            }
          });
        }
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

            this.objActivityLogsService.getActivityLogs(this.pageNo, this.PageSize).subscribe((res) => {
              this.objActivities = res.Result;

              for (var i = 0; i < this.objActivities.length; i++) {
                var newDate = new Date(this.objActivities[i].CreatedDate + "Z");
                this.objActivities[i].CreatedDate = newDate;
              }
            });
          }
        });
    }
  }

  replyComment(id, text) {
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
        text = "";
        this.onRemoveFile(this.mediaTypeEnum.Image, 0);
        this.onRemoveFile(this.mediaTypeEnum.Video, 0);
        $(".sub_comment_btn").find("span").removeClass("act");
        $(".sub_comment_btn")
          .parents(".actBtns")
          .next(".sub_comment_box")
          .hide();
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
    // var that=this;
    let __this = this;
    this.objPostService.getPostsByPostId(id).subscribe((res) => {
      setTimeout(function () {
        $("#comnt").css("display", "inline-block").click();
        $(".postdetail .user-comment textarea").focus();
        $(".attach-list").hide();
      }, 200);

      if (res.Result.Text != null) {
        res.Result.Text = this.detectLinks(res.Result.Text);
      }
      this.objGetPostSettingsById = res.Result;
      this.CommentsPicture = this.objGetPostSettingsById.User.ProfilePictureUrl;
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
        }, 299);
      }

      setTimeout(() => {
        $(".comentvideoautoplaystop").trigger("pause");
      }, 1000);
    });
  }

  detectLinks(postText: string) {
    //  detect links in post
    var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/gi;

    postText = postText.replace(
      regex,
      "<a target='_blank' class='anchorClass' href='//$1'>$1</a> "
    );
    return postText
      .replace("//http://", "http://")
      .replace("//https://", "https://");
  }

  userProfileRedirect(Id) {
    if (Id == this.objUserSettings.Id) this.objRouter.navigate(["/profile"]);
    else this.objRouter.navigate(["/user-profile/" + Id]);
  }

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
      let elements = document.getElementsByClassName("child-comment-area");

      // let elements: NodeListOf<Element> = document.getElementsByClassName("child-comment-area");
      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    }
  }
  //#endregion
}
