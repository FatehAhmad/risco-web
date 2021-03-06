import { Component, OnInit } from "@angular/core";
import { Helper } from "../../shared/helpers/utilities";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";
import { ActivityLogModel } from "../../shared/models/activity-logs";
import { ActivityLogsService } from "../../shared/services/activity-log.service";
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { DataService } from '../../shared/services/data-service';
import { PagesSidebarComponent } from '../pages-sidebar.component';
import { FollowService } from '../../shared/services/follow.service';
import { PollOption } from '../../shared/models/post';
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
import { ActivatedRoute } from '@angular/router';

declare var $;
declare var google: any;
@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
  providers: [Title],
})
export class PostDetailComponent implements OnInit {
  imagePath: any;
  public ActivityEntityTypeEnum = ActivityEntityTypeEnum;
  objActivities: ActivityLogModel[] = [];
  objUserSettings: UserModel = new UserModel();
  objGetPostSettingsById: CommentPostModel = new CommentPostModel();
  objGetPostSettings: GetPostModel = new GetPostModel();
  objPostSettings: PostModel = new PostModel();
  CommentsPicture: string;
  openPopupComment: Function;
  hideAllPostExternalIndex: any;
  openPopupChildComment: Function;
  objChildCommentText: string = "";
  objCommentText: string = "";
  PageSize: number;
  reportId: any;
  pageNo: number;
  isotopeGrid;
  scrollLoader: boolean;
  scope: string = "";
  internalPostId: number;
  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public commentReplyImageUrls = [];
  public commentReplyVideoUrls = [];
  public mediaTypeEnum = MediaTypeEnum;
  public commentTextCheck : boolean = false;
  public PostService = PostService;
  hideAllPostInternalIndex: any;

  constructor(
    public postService: PostService,
    private objRouter: Router,
    private objPostService: PostService,
    private title: Title,
    public pagesSidebarComponent: PagesSidebarComponent,
    private objFollowService: FollowService,
    private objUserService: UserService,
    public objDataService: DataService,
    private objActivityLogsService: ActivityLogsService,
    private route: ActivatedRoute,
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

    $('[data-toggle="tooltip"]').tooltip();

    $('.add_people_pnl .head').on('click', function (e) {
        e.stopPropagation();
        $('.add_people_pnl').show();
    });

    $('#delete_post_internal .custBtn').on('click', function () {
        $.fancybox.destroy();
        this.onRemoveFile(this.mediaTypeEnum.Image, 0);
        this.onRemoveFile(this.mediaTypeEnum.Video, 0);
    });

    $('.sub_report').on('click', function () {
        setTimeout(function () {
            $.fancybox.destroy();
        }, 2500)
    });


    $(".add_people_pnl .head a").click(function (event) {
        event.preventDefault();
        $(this).addClass("current");
        $(this).siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab").not(tab).css("display", "none");
        $(tab).stop(0, 0).fadeIn();
    });

    $('.people_search span').on('click', function (e) {
        e.stopPropagation();
        $(this).parent().find('.input').addClass('show');
    });

    $('.createGroup .icon-group').on('click', function (e) {
        e.stopPropagation();
        $(this).next('.add_people_pnl').stop(0, 0).fadeToggle();
    });

    $('body').delegate('.add_people_pnl .list li', 'click', function (e) {
        e.stopPropagation();
        $('.add_people_pnl').fadeIn();
    });


    $('.user-comment .field').on('click', function (e) {
        e.stopPropagation();
        $(this).addClass('act');
        $(this).find('textarea').addClass('act');
        $('.user-comment small').show();
        $('.attach-list').show();
        $('.user-comment .field span').addClass('showIcon');
        $('.user-comment .field .sent_btn').addClass('showIcon');
    });

    /* Add Fav Post */
    $('.cart-footer span.icon-thumbs-o-up').on('click', function () {
        $(this).toggleClass('icon-thumbs-o-up icon-thumbs-up2');
    });

    /* About Readmore */
    $('.about-wid a').on('click', function () {
        $(this).toggleClass('show');
        $('.about-wid p').toggleClass('show');

        if ($(this).hasClass('show')) {
            $(this).text('Show less');
        } else {
            $(this).text('Show more');
        }

    });

    $('#parent-img').click(function (e) {
        e.stopPropagation();
        $('#uploadpicCmnt').click();
        e.stopPropagation();
    });

    $('#child-img').click(function (e) {
        e.stopPropagation();
        $('#uploadpicCmntReply').click();
        e.stopPropagation();
    });

    $('#parent-vdo').click(function (e) {
        e.stopPropagation();
        $('#uploadvdoCmnt').click();
    });

    $('#child-vdo').click(function (e) {
        e.stopPropagation();
        $('#uploadvdoCmntReply').click();
        e.stopPropagation();
    });

    setTimeout(() => {

        $('[data-fancybox]').fancybox({
            arrows: true,
            keyboard: true,
            infobar: true,
            loop: false,
            touch: false,
            afterShow: function (instance, current) {

                this.content.find('video').trigger('stop');
            },
            buttons: [
                // 'slideShow',
                // 'fullScreen',
                // 'thumbs',
                'share',
                'download',
                // 'zoom',
                'close'
            ]
        });
        this.isotopeGrid = $('.grid').isotope({
            layoutMode: 'packery',
            itemSelector: '.grid-item',
            packery: {
                gutter: 0
            }
        });

        setInterval(() => {
            this.isotopeGrid.isotope('reloadItems').isotope();
        }, 100);
    }, 700);

}

  ngOnInit() {
    this.PageSize = 26;
    this.pageNo = 0;
    this.initializeScripts();

    this.title.setTitle("Activity Log | Risco");
    Helper.setBodyClass("home-page");

    this.getPostByPostId();

    // this.objActivityLogsService.getActivityLogs(this.pageNo, this.PageSize).subscribe((res) => {
    //   this.objActivities = res.Result;

    //   for (var i = 0; i < this.objActivities.length; i++) {
    //     var newDate = new Date(this.objActivities[i].CreatedDate + "Z");
    //     this.objActivities[i].CreatedDate = newDate;
    //   }
    //   for (let i = 0; i < this.objActivities.length; i++) {
    //     if (this.objActivities[i]["EntityType"] == 30) {
    //       this.objActivities.splice(i, 1);
    //       i--;
    //     }
    //   }
    // });

    // this.objPostService
    //   .getPosts(this.PageSize, this.pageNo)
    //   .subscribe((res) => {
    //     {
    //       if (res.StatusCode == 200) {
    //         this.objGetPostSettings = res.Result;

    //         for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
    //           var newDate = new Date(
    //             this.objGetPostSettings.Posts[i].CreatedDate + "Z"
    //           );

    //           this.objGetPostSettings.Posts[i].CreatedDate = newDate;
    //           this.objGetPostSettings.Posts[i].Text = this.detectLinks(
    //             this.objGetPostSettings.Posts[i].Text
    //           );
    //           this.objGetPostSettings.Posts[i].IsToggled = false;
    //         }

    //         setTimeout(() => {
    //           $(".fancyImage").click(function () {
    //             $(this)
    //               .parent()
    //               .children("a.fancyImage")
    //               .each(function () {
    //                 $(this).attr("data-fancybox", "image");
    //               });
    //           });

    //           $("[data-fancybox]").fancybox({
    //             touch: false,
    //             afterClose: function () {
    //               $(".fancyImage").attr("data-fancybox", "");
    //             },
    //           });
    //         }, 599);
    //       }
    //     }
    //   });

    // this.objUserService.getUserData().subscribe((res) => {
    //   if (res.StatusCode == 200) {
    //     this.objUserSettings = res.Result;
    //   }
    // });

    // var that = this;
    // $(window).scroll(function () {

    //   if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
    //     that.pageNo++;

    //     that.scrollLoader = true;

    //     that.objActivityLogsService.getActivityLogs(that.pageNo, that.PageSize).subscribe((res) => {
    //       {
    //         that.scrollLoader = false;

    //         if (res.StatusCode == 200) {
    //           // that.objActivities = that.objActivities + res.Result;

    //           // that.objActivities.concat(res.Result);

    //           for (var i = 0; i < res.Result.length; i++) {
    //             var newDate = new Date(res.Result[i].CreatedDate + "Z");
    //             res.Result[i].CreatedDate = newDate;
    //           }
    //           for (let i = 0; i < res.Result.length; i++) {
    //             if (res.Result[i]["EntityType"] == 30) {
    //               res.Result.splice(i, 1);
    //               i--;
    //             }
    //             that.objActivities.push(res.Result[i]);
    //           }
    //         }
    //       }
    //     });
    //   }
    // });
  }


  remainingImages(id) {
    var className = ".galleryImages" + id + ":first";
    $(className).click();
  }


  detailPostFollow(id) {
    var userId = id;
    this.objFollowService.follow(userId)
        .subscribe(res => {
            if (res.StatusCode == 200) {
                var userSpecificList = this.objGetPostSettings.Posts.filter(x => x.User.Id == userId);
                for (let obj of userSpecificList) {
                    obj.IsUserFollow = true;
                }

                $(".detailFollowIcon").hide();
            }
        });
  }

  follow() {
    var userId = this.objPostSettings.User.Id;
    this.objFollowService.follow(userId)
        .subscribe(res => {
            if (res.StatusCode == 200) {

                this.objDataService.changeMessage({});

                var userSpecificList = this.objGetPostSettings.Posts.filter(x => x.User.Id == userId);
                for (let obj of userSpecificList) {
                    obj.IsUserFollow = true;
                }
                this.objUserSettings.FollowingCount = this.objUserSettings.FollowingCount + 1;
            }
        });
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

  starClicked(parentPostIndex, extendedPostIndex, isExtended) {
    $("#likeExternal").addClass("noEvents");
    $("#unlikeExternal").addClass("noEvents");
    $(event.target).toggleClass('icon-thumbs-up icon-thumbs-up2');

    //if post is an extended post
    if (isExtended) {

        if (this.objPostSettings.ExtendedPostList[extendedPostIndex].IsLiked == true) {
            this.objPostService.unlikePost(this.objPostSettings.ExtendedPostList[extendedPostIndex].Id)
                .subscribe(res => {
                    if(res.StatusCode==200){
                        $("#unlikeExternal").removeClass("noEvents");
                        this.objPostSettings.ExtendedPostList[extendedPostIndex].IsLiked = false;
                        this.objPostSettings.ExtendedPostList[extendedPostIndex].LikesCount = this.objPostSettings.ExtendedPostList[extendedPostIndex].LikesCount - 1;
                    }
                })
        }
        else {
            this.objPostService.likePost(this.objPostSettings.ExtendedPostList[extendedPostIndex].Id)
                .subscribe(res => {
                    if(res.StatusCode==200){
                        $("#likeExternal").removeClass("noEvents");
                        this.objPostSettings.ExtendedPostList[extendedPostIndex].IsLiked = true;
                        this.objPostSettings.ExtendedPostList[extendedPostIndex].LikesCount = this.objPostSettings.ExtendedPostList[extendedPostIndex].LikesCount + 1;
                    }

                })
        }
    }
    //if post is not extended / threaded / children
    else {
        if (this.objPostSettings.IsLiked == true) {
            this.objPostService.unlikePost(this.objPostSettings.Id)
                .subscribe(res => {
                    if(res.StatusCode==200){
                        $("#unlikeExternal").removeClass("noEvents");
                        this.objPostSettings.IsLiked = false;
                        this.objPostSettings.LikesCount = this.objPostSettings.LikesCount - 1;
                    }
                })
        }
        else {
            this.objPostService.likePost(this.objPostSettings.Id)
                .subscribe(res => {
                    if(res.StatusCode==200){
                        $("#likeExternal").removeClass("noEvents");
                        this.objPostSettings.IsLiked = true;
                        this.objPostSettings.LikesCount = this.objPostSettings.LikesCount + 1;
                    }

                })
        }
    }
  }

  hidePostById() {
    this.objPostService.hidePostById(this.objPostSettings.Id)
        .subscribe(res => {
            if (res.StatusCode == 200) {
                // $("#hide_single_post").css("display", "block");

                // window.location.reload()
            }
        });
  }


  //#region ----DISPLAY POLL----
  votePollOptionClick(pollOption: PollOption , data) {

    let _checkVoted : boolean = false;
    var obj = {
        Post_Id: pollOption.Post_Id,
        PollOption_Id: pollOption.Id,
        User_Id: LoggedInUser.getLoggedInUser().Id
    };

    var  _obj = this.objGetPostSettings.Posts.find(x => x.Id == obj.Post_Id);

    _obj.PollOptions.forEach( function(val){
        if(val.IsVoted){
            _checkVoted = true;
        }
    })

    if(data && data.IsExpired){
        $('.alert-danger').remove();
        $.notify(
            { message: 'This Poll has been ended.' },
            { type: 'danger' },
            { timeout: 100}
        );
        setTimeout(()=>{$('.alert-danger').remove();},1000)
        return false;
    }

    if(_checkVoted){
        $('.alert-danger').remove();
        $.notify(
            { message: 'You can vote only once.' },
            { type: 'danger' }
        );
        setTimeout(()=>{$('.alert-danger').remove();},1000)

    } else {

        this.objPostService.voteOnPollOption(obj).subscribe((response) => {
            let post: PostModel = response.Result;
            var postIndex = this.objGetPostSettings.Posts.findIndex(x => x.Id == post.Id);
            this.objGetPostSettings.Posts[postIndex].PollOptions = post.PollOptions;
            this.isotopeGrid.isotope('reloadItems').isotope();
        });

        $('.prog_parent').show();
    }

  }
  //#endregion



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

  setIdInternal(id) {

    this.reportId = id;
    $("#on1").click();
  }

  hidePostByIdInternal(id) {
    this.objPostService.hidePostById(id)
        .subscribe(res => {
            if (res.StatusCode == 200) {
                // window.location.reload()
            }
        });
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

  setIndex() {
    this.scope = "external";
    this.hideAllPostExternalIndex = this.objPostSettings.Id;
    this.reportId = this.objPostSettings.Id;
    $("#on1").click();
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

  commentClicked(index, e) {

    debugger

    this.commentTextCheck = false;
    var post = this.objPostSettings;
    if (!post.IsPoll)
        this.getPostById(post.Id);
  }


  getPostById(postId: number, callback = null) {
    let __this = this;
    this.objPostService.getPostsByPostId(postId)
        .subscribe(res => {


            //$(".postdetail .user-comment textarea").click();
            setTimeout(function () {
                 $('#comnt').css('display', 'inline-block').click();
                 $(".postdetail .user-comment textarea").focus();
                 $(".attach-list").hide();
            }, 300);

            if (res.Result.Text != null) {
                res.Result.Text = Helper.detectAndCreateLinks(res.Result.Text);
            }

            this.objGetPostSettingsById = res.Result;
            this.objGetPostSettingsById['Comments'] = (this.objGetPostSettingsById['Comments'] && this.objGetPostSettingsById['Comments'].length)?this.objGetPostSettingsById['Comments'].reverse():[];
            this.CommentsPicture = this.objGetPostSettingsById.User.ProfilePictureUrl;
            var newDate = new Date(this.objGetPostSettingsById.CreatedDate + 'Z');
            this.objGetPostSettingsById.CreatedDate = newDate;
           //this.objGetPostSettingsById.User = new UserModel();

            for (var i = 0; i < this.objGetPostSettingsById.Comments.length; i++) {
                var newDateComments = new Date(this.objGetPostSettingsById.Comments[i].CreatedDate + 'Z');
                this.objGetPostSettingsById.Comments[i].CreatedDate = newDateComments;
            }

            for (var i = 0; i < this.objGetPostSettingsById.Comments.length; i++) {
                for (var k = 0; k < this.objGetPostSettingsById.Comments[i].ChildComments.length; k++) {
                    var newDateCommentsChild = new Date(this.objGetPostSettingsById.Comments[i].ChildComments[k].CreatedDate + 'Z');
                    this.objGetPostSettingsById.Comments[i].ChildComments[k].CreatedDate = newDateCommentsChild;
                }

            }

            if(this.objGetPostSettingsById.Comments && this.objGetPostSettingsById.Comments.length){
                for(let i = 0 ; i < this.objGetPostSettingsById.Comments.length ; i++){
                    if(this.objGetPostSettingsById.Comments[i]['ChildComments'] && this.objGetPostSettingsById.Comments[i]['ChildComments'].length){
                        this.objGetPostSettingsById.Comments[i]['ChildComments'] = this.objGetPostSettingsById.Comments[i]['ChildComments'].reverse();
                    }
                }
            }

            setTimeout(() => {

                $(".fancyImage").click(function () {
                    $(this).parent().children("a.fancyImage").each(function () {

                        $(this).attr("data-fancybox", "image");
                    });
                });

                $('[data-fancybox]').fancybox({
                    touch: false,
                    "afterClose": function () {
                        $.fancybox.destroy();
                        $('.postdetail .field').removeClass('act');
                        __this.onRemoveFile(__this.mediaTypeEnum.Image, 0);
                        __this.onRemoveFile(__this.mediaTypeEnum.Video, 0);
                        __this.objCommentText = "";
                        __this.objChildCommentText = "";
                        $(".emoji-mart").fadeOut("200");
                        $(".parent-comment-area").removeClass('act')
                        $(".child-comment-area").removeClass('act')
                    }
                });

            }, 300)

            if (callback) {
                callback();
            }

            setTimeout(() => {
                $('.comentvideoautoplaystop').trigger('pause');
            }, 500);

        });
  }




  getPostByPostId () {

    let postid: number = +this.route.snapshot.paramMap.get('Id');

    this.objPostService.getPostsByPostId(postid).subscribe((res) => {

      debugger

      if (res.StatusCode == 200) {

        this.objPostSettings = res.Result;

        // for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
            var newDate = new Date(this.objPostSettings.CreatedDate + 'Z');
            if(this.objPostSettings['PollExpiryTime']){
                this.objPostSettings['PollExpiryTime'] = new Date(this.objPostSettings['PollExpiryTime']+'Z');
            }
            this.objPostSettings.CreatedDate = newDate;
            this.objPostSettings.Text = Helper.detectAndCreateLinks(this.objPostSettings.Text);
            this.objPostSettings.IsToggled = false;
        // }

        setTimeout(() => {

            $(".fancyImage").click(function () {
                $(this).parent().children("a.fancyImage").each(function () {

                    $(this).attr("data-fancybox", "image");
                });
            });

            $('[data-fancybox]').fancybox({
                touch: false,
                "afterClose": function () {
                    $(".fancyImage").attr("data-fancybox", "");
                }
            });
            this.isotopeGrid.isotope('reloadItems').isotope();
        }, 100)
    }

    });

  }

  userProfileRedirect(Id) {
    $("#postdetail").attr("data-fancybox-close", "");
    $("#postdetail").click();

    if (Id == this.objUserSettings.Id)
        this.objRouter.navigate(["/profile"]);
    else
        this.objRouter.navigate(["/user-profile/" + Id]);
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
