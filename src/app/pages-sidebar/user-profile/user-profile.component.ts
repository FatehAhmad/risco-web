import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Helper } from "../../shared/helpers/utilities";
import { Title } from "@angular/platform-browser";
import { LoggedInUser } from "../../shared/classes/loggedInUser";
import { PostModel, PollOption } from "../../shared/models/post";
import { UserModel } from "../../shared/models/userModel";
import { GetPostModel } from "../../shared/models/get-post";
import { PostService } from "../../shared/services/post.service";
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user";
import { CommentPostModel } from "../../shared/models/comment-post";
import { TrendsModel } from "../../shared/models/tends";
import { chkModel } from "../../shared/models/chk";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { FollowService } from "../../shared/services/follow.service";
import { ReportModel } from "../../shared/models/report-model";
import { PrivacySettingsModel } from "../../shared/models/privacy-settings";
import { GroupDataModel } from "../../shared/models/group-data";
import { GroupService } from "../../shared/services/group.service";
import { GeneralSearchModel } from "../../shared/models/general-search";
import { AppComponent } from "../../app.component";
import { SidebarTypeEnum } from "src/app/shared/enum/sidebar-type";
import { MediaTypeEnum } from "../../shared/enum/media-type-enum";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji";

declare var $: any;
declare var google: any;
declare var FriendRequest: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  @ViewChild("inPicture") inPicture;
  @ViewChild("inPicturee") inPicturee;
  @ViewChild("inPictureCover") inPictureCover;

  fullName: string = "";
  objAccountSetting: UserModel = new UserModel();
  objLoggedinUser: UserModel = new UserModel();

  postLoaded:boolean;
  static city: string = "";
  imagesUrls: string = "";
  objPostSettings: PostModel = new PostModel();
  objGetPostSettings: GetPostModel = new GetPostModel();
  objGetPostSettingsById: CommentPostModel = new CommentPostModel();
  public PostService = PostService;
  objReportModel: ReportModel = new ReportModel();
  imageName = [];
  RiskLevel: string = "";
  Id: number;
  ProfilePictureUrl: string;
  urls = [];
  str: string;
  PageSize: number;
  pageNo: number;
  //   yo:string;
  textEntered: boolean = false;
  text: string = "";
  openPopup: Function;
  reportId: number;
  reportVal: any;
  blockVal: any;
  CommentsPicture: string;
  RiskLevelText: string;
  bool: boolean;
  objTest: chkModel = new chkModel();
  objTrends: TrendsModel[] = [];
  imagePath: any;
  ParamId: any;
  hideAllPostExternalIndex: any;
  MessagePrivacy: number;
  hideAllPostInternalIndex: any;
  objCommentText: string = "";
  openPopupComment: Function;
  openPopupChildComment: Function;
  objChildCommentText: string = "";
  UserIdReportUser: any;
  objPrivacySettings: PrivacySettingsModel = new PrivacySettingsModel();

  PageSizeMyGroups: number;
  PageNoMyGroups: number;
  groupId: number;
  PostId: any;
  objGetGroups: GroupDataModel = new GroupDataModel();
  objSearchModel: GeneralSearchModel = new GeneralSearchModel();
  searchTextGroup: string = "";
  public SidebarTypeEnum = SidebarTypeEnum;
  UserId: any;

  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public commentReplyImageUrls = [];
  public commentReplyVideoUrls = [];
  public mediaTypeEnum = MediaTypeEnum;
  isotopeGrid: any;
  today: Date;

  constructor(
    private postService: PostService,
    private objGroupService: GroupService,
    private objRouter: Router,
    private objFollowService: FollowService,
    private title: Title,
    private objRoute: ActivatedRoute,
    private objPostService: PostService,
    private objUserService: UserService,
    public appComponent: AppComponent
  ) {
    this.imagePath = environment.imagePath;
    this.postLoaded = false;
  }

  popuuChildComment() {
    this.openPopupChildComment(false);
  }

  setPopupActionChildComment(fn: any) {
    this.objChildCommentText = "";
    //console.log('setPopupAction');
    this.openPopupChildComment = fn;
  }

  facebookShare(id) {
    localStorage.setItem("postIdFacebook", id);
  }

  twitterShare(id) {
    localStorage.setItem("postIdTwitter", id);
  }

  googlePlusShare(id) {
    localStorage.setItem("postIdGooglePlus", id);
  }

  onShareClick() {
    for (let j = 0; j < this.imageName.length; j++) {
      this.objPostSettings.ImageUrls += this.imageName[j] + ",";
    }
    this.objPostSettings.ImageUrls = this.objPostSettings.ImageUrls.replace(
      /(^,)|(,$)/g,
      ""
    );
    this.objPostService.updateStatus(this.objPostSettings).subscribe((res) => {
      if (res.StatusCode == 200) {
        res.Result.User = this.objAccountSetting;
        if (res.Result.Text != null) {
          res.Result.Text = this.detectLinks(res.Result.Text);
        }
        this.objGetPostSettings.Posts.unshift(res.Result);
        this.objPostSettings = new PostModel();
        this.imageName = [];
        $(".custBtn").attr("disabled", true);
        this.objPostSettings.Text = "";
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
              $(".fancyImage").attr("data-fancybox", "");
            },
          });
        }, 799);
      }
    });
  }

  searchGroup() {
    if (this.searchTextGroup == "") {
      $(".autocomplete_pnl").fadeOut();
      return;
    }

    this.objGroupService
      .groupSearching(this.searchTextGroup)
      .subscribe((res) => {
        $(".group_search .autocomplete_pnl").fadeIn();
        this.objSearchModel = res.Result;
      });
  }

  popuu() {
    this.shareButtonState();
    this.openPopup(false);
  }

  setPopupAction(fn: any) {
    this.objPostSettings.Text = "";
    //  console.log('setPopupAction');
    this.openPopup = fn;
  }

  popuuComment() {
    this.openPopupComment(false);
  }

  setPopupActionComment(fn: any) {
    this.objCommentText = "";
    //console.log('setPopupAction');
    this.openPopupComment = fn;
  }

  remainingImages(id) {
    var className = ".galleryImages" + id + ":first";
    $(className).click();
  }

  //#region
  onFileSelect(mediaType: MediaTypeEnum, IsParentComment: number) {
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

  turnOfNotification(i) {
    this.objPostService
      .turnOfNotification(this.objGetPostSettings.Posts[i].Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          //    console.log("notification turned off");
        }
      });
  }

  setTrends(trends) {
    // $('#whatsNew').val($('#whatsNew').val()+trends.value);
    this.objPostSettings.Text += " " + trends.value + " ";
    this.shareButtonState();
  }
  removeImage(i) {
    this.imageName.splice(i, 1);
    this.shareButtonState();
  }
  onSelectFile(event) {
    if (event.target.files.length > 0) {
      $(".custBtn").removeAttr("disabled");
    }
    let fileBrowser = this.inPicturee.nativeElement;
    let file;

    for (let i = 0; i < fileBrowser.files.length; i++) {
      file = fileBrowser.files[i];
      //  console.log(this.imageName.length);
      this.objPostService.uploadPostMedia(file).subscribe((res) => {
        if (res.StatusCode == 200) {
          var encodedImage = escape(res.Result);
          encodedImage += "?v=" + new Date().getTime();
          this.imageName.push(encodedImage);
          $("#uploadpic").val("");
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
              $(".fancyImage").attr("data-fancybox", "");
            },
          });
        }
      });
    }
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

              //   console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
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

  showPosition(position) {}

  //   onFileChangee(event) {
  //       let files = event.target.files;

  //       var ext = files[files.length-1].name.split('.').pop();
  //       if (ext == "jpg" || ext == "png" || ext == "jpeg") {

  //       var reader = new FileReader();
  //       var that = this;
  //       reader.onload = function (e) {
  //            $('.postImage').attr('src', (<any>e.target).result);

  //            let fileBrowser = that.inPic.nativeElement;
  //            let file = fileBrowser.files[0];

  //      }
  //       reader.readAsDataURL(files[files.length-1]);
  //   }
  // }

  initializeScripts() {
    $('[data-toggle="tooltip"]').tooltip();

    $(".profilePage .post-panel").on("click", function (e) {
      $(this).find(".update_status").fadeIn();
      $(".overlay-bg").addClass("show");
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: 300,
        },
        500
      );
    });

    $(".sub_report").on("click", function () {
      setTimeout(function () {
        $.fancybox.destroy();
        $.fancybox.destroy();
      }, 3200);
    });

    $(".post-panel").on("click", function (e) {
      $(this).find(".update_status").fadeIn();
      $(".overlay-bg").addClass("show");
      // $('body').css("position","fixed");
      // $('body').css("width","100%");
    });

    /* Post Detail Comment */
    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
      $(".user-comment .field .sent_btn").addClass("showIcon");
    });
    $("body").delegate(".shareBtn", "click", function () {
      $(".update_status").fadeOut();
      $("body").css("position", "static");
      $(".overlay-bg").removeClass("show");
    });

    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).find("textarea").addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
    });

    /* Add Fav Post */
    $(".cart-footer span.icon-thumbs-o-up").on("click", function () {
      $(this).toggleClass("icon-thumbs-o-up icon-thumbs-up2");
    });

    /* About Readmore */
    $(".about-wid a").on("click", function () {
      $(this).toggleClass("show");
      $(".about-wid p").toggleClass("show");

      if ($(this).hasClass("show")) {
        $(this).text("Show less");
      } else {
        $(this).text("Show more");
      }
    });

    $(".followBtn").on("click", function () {
      $(this).toggleClass("following");
      if ($(this).hasClass("following")) {
        $(this).text("Following");
      } else {
        $(this).html('<span class="icon-user-plus"></span> Follow');
      }
    });

    $("body")
      .delegate(".following", "mouseenter", function () {
        $(this).text("Unfollow");
      })
      .delegate(".following", "mouseleave", function () {
        $(this).text("Following");
      });

    $(".profile_more").click(function (e) {
      e.stopPropagation();
      $(".profile_more_dropdown").stop(0, 0).slideToggle("fast");
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

    setTimeout(() => {
      $("[data-fancybox]").fancybox({
        arrows: true,
        keyboard: true,
        infobar: true,
        loop: false,
        touch: false,
        afterShow: function (instance, current) {
          this.content.find("video").trigger("stop");
        },
        buttons: [
          // 'slideShow',
          // 'fullScreen',
          // 'thumbs',
          "share",
          "download",
          // 'zoom',
          "close",
        ],
      });
    }, 700);
  }

  follow(id) {
    var userId = id;
    this.objFollowService.follow(userId).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objAccountSetting.IsFollowing = true;
      }
    });
  }
  unFollow(id) {
    this.objFollowService.unFollow(id).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objAccountSetting.IsFollowing = false;
      }
    });
  }

  starClicked(i) {
    $("#likeExternal").addClass("noEvents");
    $("#unlikeExternal").addClass("noEvents");
    $(event.target).toggleClass("icon-thumbs-up icon-thumbs-up2");

    if (this.objGetPostSettings.Posts[i].IsLiked == true) {
      this.objPostService
        .unlikePost(this.objGetPostSettings.Posts[i].Id)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            $("#unlikeExternal").removeClass("noEvents");
            this.objGetPostSettings.Posts[i].IsLiked = false;
            this.objGetPostSettings.Posts[i].LikesCount =
              this.objGetPostSettings.Posts[i].LikesCount - 1;
          }
        });
    } else {
      this.objPostService
        .likePost(this.objGetPostSettings.Posts[i].Id)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            $("#likeExternal").removeClass("noEvents");
            this.objGetPostSettings.Posts[i].IsLiked = true;
            this.objGetPostSettings.Posts[i].LikesCount =
              this.objGetPostSettings.Posts[i].LikesCount + 1;
          }
        });
    }
  }

  internalStarClicked() {
    $("#likeInternal").addClass("noEvents");
    $("#unlikeInternal").addClass("noEvents");
    $(event.target).toggleClass("icon-thumbs-up icon-thumbs-up2");
    if (this.objGetPostSettingsById.IsLiked == true) {
      this.objPostService
        .unlikePost(this.objGetPostSettingsById.Id)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            $("#unlikeInternal").removeClass("noEvents");
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
            $("#likeInternal").removeClass("noEvents");
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

  redirectToPostDetail(postId) {

    this.objRouter.navigate(["/post-detail/" + postId]);
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

  setRiskLevel(riskLevel) {
    if (riskLevel == 1) this.RiskLevelText = "High";
    else if (riskLevel == 2) this.RiskLevelText = "Medium";
    else if (riskLevel == 3) this.RiskLevelText = "Low";
  }

  setId(i) {
    this.reportId = this.objGetPostSettings.Posts[i].Id;
    $("#on1").click();
  }
  setIdInternalReportUser(id) {
    $("#on11").click();
    this.UserIdReportUser = id;
  }

  onFileChange(event) {
    let files = event.target.files;

    var ext = files[files.length - 1].name.split(".").pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {
      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        $(".profileImage").css(
          "background-image",
          "url(" + (<any>e.target).result + ")"
        );
        $(".profileImage").attr("src", (<any>e.target).result);

        let fileBrowser = that.inPicture.nativeElement;
        let file = fileBrowser.files[0];

        that.objUserService.updateProfileImage(file).subscribe((res) => {
          if (res) {
            //    console.log()
            //  this.objRouter.navigate(["dashboard/cm/"]);
          }
        });
      };
      reader.readAsDataURL(files[files.length - 1]);
    }
  }

  commentClicked(k, e) {
    let __this = this;
    this.objPostService
      .getPostsByPostId(this.objGetPostSettings.Posts[k].Id)
      .subscribe((res) => {
        //$(".postdetail .user-comment textarea").click();
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
        }
      });
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

    setTimeout(() => {
      $(".comentvideoautoplaystop").trigger("pause");
    }, 1000);
  }

  onkeyUp($event, text) {
    if ($event.key == "Enter") {
      this.postComment(text.value);
    }
  }
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
          res.Result.User = this.objLoggedinUser;
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
      });
  }

  getMyGroups(i) {
    this.PostId = this.objGetPostSettings.Posts[i].Id;
    this.PageSizeMyGroups = 10;
    this.PageNoMyGroups = 0;
    this.objGroupService
      .getGroups(this.PageSizeMyGroups, this.PageNoMyGroups)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objGetGroups = res.Result;
        }
      });
  }

  getMyGroupsInternal(id) {
    this.PostId = id;
    this.PageSizeMyGroups = 10;
    this.PageNoMyGroups = 0;
    this.objGroupService
      .getGroups(this.PageSizeMyGroups, this.PageNoMyGroups)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objGetGroups = res.Result;
        }
      });
  }

  selectedGroup(id) {
    this.groupId = id;
    $(".groupPopup ul li").on("click", function () {
      $(this).addClass("selected");
      $(this).siblings().removeClass("selected");
    });
  }

  groupShare() {
    this.objPostService
      .rePostGroup(this.PostId, this.objPostSettings.Location, 1, this.groupId)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          window.location.reload();
        }
      });
  }

  setIndex(i) {
    this.hideAllPostExternalIndex = i;
    this.reportId = this.objGetPostSettings.Posts[i].Id;
    $("#on1").click();
  }

  setIndexInternal(id) {
    this.hideAllPostInternalIndex = id;
  }

  refresh() {
    window.location.reload();
  }

  hideAllPosts(i) {
    this.objPostService
      .hideAllPosts(this.objGetPostSettings.Posts[i].User.Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
        }
      });
  }

  hideAllPostsInternal(userId) {
    this.objPostService.hideAllPosts(userId).subscribe((res) => {
      if (res.StatusCode == 200) {
        window.location.reload();
      }
    });
  }

  hidePostById(i) {
    this.objPostService
      .hidePostById(this.objGetPostSettings.Posts[i].Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          // window.location.reload()
        }
      });
  }

  hidePostByIdInternal(id) {
    this.objPostService.hidePostById(id).subscribe((res) => {
      if (res.StatusCode == 200) {
        //  window.location.reload()
      }
    });
  }

  setIdInternal(id) {
    this.reportId = id;
    $("#on1").click();
  }
  getValueReporting(val) {
    this.reportVal = val;
  }
  getValueBlocking(val) {
    this.blockVal = val;
  }

  reportPost() {
    this.objPostService
      .reportPost(this.reportId, this.reportVal, this.objReportModel.Text)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          $("#reportText").val("");
          this.objReportModel.Text = "";
        }
      });
  }

  reportUser() {
    this.objUserService
      .reportUser(this.UserIdReportUser, this.reportVal)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          $("#reportText").val("");
        }
      });
  }

  blockUser(userID) {
    this.objUserService.blockUser(userID).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objAccountSetting.IsBlocked = true;
      }
    });
  }

  unBlockUser(userID) {
    this.objUserService.unBlockUser(userID).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objAccountSetting.IsBlocked = false;
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
          this.objGetPostSettingsById.Comments[i].IsLiked = true;
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
          res.Result.User = this.objLoggedinUser;
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
      });
  }

  userProfileRedirect(Id) {
    $("#postdetail").attr("data-fancybox-close", "");
    $("#postdetail").click();

    if (Id == this.objLoggedinUser.Id) this.objRouter.navigate(["/profile"]);
    else this.objRouter.navigate(["/user-profile/" + Id]);
  }

  onFileChangeCover(event) {
    let files = event.target.files;

    var ext = files[files.length - 1].name.split(".").pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {
      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        $(".coverImage").css(
          "background-image",
          "url(" + (<any>e.target).result + ")"
        );

        let fileBrowser = that.inPictureCover.nativeElement;
        let file = fileBrowser.files[0];

        that.objUserService.updateCoverImage(file).subscribe((res) => {
          if (res) {
          }
        });
      };
      reader.readAsDataURL(files[files.length - 1]);
    }
  }

  shareButtonState() {
    if (this.imageName.length < 1) {
      if (
        this.objPostSettings.Text != undefined &&
        this.objPostSettings.Text.trim() == ""
      ) {
        $(".custBtn").attr("disabled", true);
      } else $(".custBtn").removeAttr("disabled");
    } else $(".custBtn").removeAttr("disabled");
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

  messageFriendBtnClick() {
    var userId = this.objAccountSetting.Id;
    var username = this.objAccountSetting.FullName;
    FriendRequest.SendRequest(userId, username);
    this.objRouter.navigate(["messages", userId, username]);
  }

  //#region ----DISPLAY POLL----
  votePollOptionClick(pollOption: PollOption) {
    let _checkVoted: boolean = false;
    var obj = {
      Post_Id: pollOption.Post_Id,
      PollOption_Id: pollOption.Id,
      User_Id: LoggedInUser.getLoggedInUser().Id,
    };

    var _obj = this.objGetPostSettings.Posts.find((x) => x.Id == obj.Post_Id);

    _obj.PollOptions.forEach(function (val) {
      if (val.IsVoted) {
        _checkVoted = true;
      }
    });

    if (_checkVoted) {
      $(".alert-danger").remove();
      $.notify({ message: "You can vote only once." }, { type: "danger" });
    } else {
      this.objPostService.voteOnPollOption(obj).subscribe((response) => {
        let post: PostModel = response.Result;
        var postIndex = this.objGetPostSettings.Posts.findIndex(
          (x) => x.Id == post.Id
        );
        this.objGetPostSettings.Posts[postIndex].PollOptions = post.PollOptions;
        this.isotopeGrid.isotope("reloadItems").isotope();
      });

      $(".prog_parent").show();
    }
  }
  //#endregion

  ngOnInit() {
    debugger;

    this.today = new Date();
    this.initializeScripts();
    this.objUserService.getUserData().subscribe((res) => {
      this.objLoggedinUser = res.Result;
    });

    this.objRoute.params.subscribe((paramsId) => {
      this.ParamId = paramsId["Id"];
      this.UserId = this.ParamId;

      this.objUserService.getUserById(this.ParamId).subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objAccountSetting = res.Result;
          this.fullName = this.objAccountSetting.FullName;
          this.Id = this.objAccountSetting.Id;
          this.ProfilePictureUrl = this.objAccountSetting.ProfilePictureUrl;
        }
      });

      this.PageSize = 10;
      this.pageNo = 0;
      //custom title
      this.title.setTitle("Profile | Risco");
      Helper.setBodyClass("profilePage userProfile");

      this.getLocation();

      this.objPostService
        .getPostsByUserId(this.ParamId, this.PageSize, this.pageNo)
        .subscribe((res) => {
          this.postLoaded=true;
          this.objGetPostSettings = res.Result;
          for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
            var newDate = new Date(
              this.objGetPostSettings.Posts[i].CreatedDate + "Z"
            );
            this.objGetPostSettings.Posts[i].CreatedDate = newDate;
            if (this.objGetPostSettings.Posts[i].Text != null) {
              this.objGetPostSettings.Posts[i].Text = this.detectLinks(
                this.objGetPostSettings.Posts[i].Text
              );
            }
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
                $(".fancyImage").attr("data-fancybox", "");
              },
            });
            that.isotopeGrid = $(".grid").isotope({
              layoutMode: "packery",
              itemSelector: ".grid-item",
              packery: {
                gutter: 0,
              },
            });

            setInterval(() => {
              that.isotopeGrid.isotope("reloadItems").isotope();
            }, 100);
          }, 299);

        });

      this.objPostService.getTrending().subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objTrends = res.Result.Trends;
        }
      });
      var that = this;

      $(window).scroll(function () {
        if (
          $(window).scrollTop() >=
          $(document).height() - $(window).height()
        ) {
          that.pageNo++;
          that.objPostService
            .getPostsByUserIdV1(that.ParamId, that.PageSize, that.pageNo)
            .subscribe((res) => {
              {
                res.Result.Posts.forEach((post) => {
                  var newDate = new Date(post.CreatedDate + "Z");
                  post.CreatedDate = newDate;
                  console.log(that.objGetPostSettings.Posts);
                  that.objGetPostSettings.Posts.push(post);

                  if (post.Text != null) {
                    post.Text = that.detectLinks(post.Text);
                  }
                });
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
                      $(".fancyImage").attr("data-fancybox", "");
                    },
                  });
                }, 799);
              }
            }, this);
        }
      });
    });
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
      // let elements: NodeListOf<Element> = document.getElementsByClassName("child-comment-area");
      let elements = document.getElementsByClassName("child-comment-area");

      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    }
  }
  //#endregion
}
