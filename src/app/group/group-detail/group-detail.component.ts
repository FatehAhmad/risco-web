import { Component, OnInit, ViewChild } from "@angular/core";
import { Helper } from "../../shared/helpers/utilities";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";
import { UserService } from "../../shared/services/user.service";
import { GroupService } from "../../shared/services/group.service";
import { UserModel } from "../../shared/models/userModel";
import { GroupsModel } from "../../shared/models/groups";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { GetPostModel } from "../../shared/models/get-post";
import { PostModel, PollOption } from "../../shared/models/post";
import { CommentPostModel } from "../../shared/models/comment-post";
import { chkModel } from "../../shared/models/chk";
import { TrendsModel } from "../../shared/models/tends";
import { PostService } from "../../shared/services/post.service";
import { GetGroupMembersModel } from "../../shared/services/get-group-members";
import { GroupMembersModel } from "../../shared/services/group-members";
import { FollowService } from "../../shared/services/follow.service";
import { FollowingModel } from "../../shared/models/followings";
import { ReportModel } from "../../shared/models/report-model";
import { DataService } from "../../shared/services/data-service";
import { LoggedInUser } from "../../shared/classes/loggedInUser";
import { GroupDataModel } from "../../shared/models/group-data";
import { GeneralSearchModel } from "../../shared/models/general-search";
import { AppComponent } from "../../app.component";
import { MediaTypeEnum } from "../../shared/enum/media-type-enum";
import { SidebarTypeEnum } from "../../shared/enum/sidebar-type";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji";

declare var $: any;
declare var google: any;

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.css"],
  providers: [Title],
})
export class GroupDetailComponent implements OnInit {
  @ViewChild("inPicture") inPicture;
  @ViewChild("inVideo") inVideo;
  @ViewChild("inPicturee") inPicturee;
  @ViewChild("inPictureCover") inPictureCover;

  imagePath: any;
  objUserSettings: UserModel = new UserModel();
  objGroupInfo: GroupsModel = new GroupsModel();
  objGroupRequests: GroupsModel[] = [];
  objGetPostSettings: GetPostModel = new GetPostModel();
  PageSize: number = 10;
  PageNo: number = 0;
  fullName: string = "";
  static city: string = "";
  imagesUrls: string = "";
  objPostSettings: PostModel = new PostModel();
  objGetPostSettingsById: CommentPostModel = new CommentPostModel();
  objGroupMembers: GetGroupMembersModel = new GetGroupMembersModel();
  objReportModel: ReportModel = new ReportModel();
  public PostService = PostService;
  imageName = [];
  videoName = [];
  RiskLevel: string = "";
  Id: number;
  ProfilePictureUrl: string;
  urls = [];
  str: string;
  textEntered: boolean = false;
  text: string = "";
  openPopup: Function;
  reportId: number;
  reportVal: any;
  CommentsPicture: string;
  RiskLevelText: string;
  bool: boolean;
  objTest: chkModel = new chkModel();
  objTrends: TrendsModel[] = [];
  ParamId: any;
  objFollowers: FollowingModel[] = [];
  objFollowersSearch: FollowingModel[] = [];
  objFollowings: FollowingModel[] = [];
  groupId: number;
  GroupId: number;
  searchTextGroupDetail: string = "";
  hideAllPostExternalIndex: any;
  hideAllPostInternalIndex: any;
  scope: string = "";
  internalPostId: number;
  latitude: number;
  longitude: number;
  city: string;

  objCommentText: string = "";
  openPopupComment: Function;
  openPopupChildComment: Function;
  objChildCommentText: string = "";
  pageNo: any;
  pageSizeFollowings: number;
  pageNoFollowings: number;

  groupIdShare: number;
  PageSizeMyGroups: number;
  PageNoMyGroups: number;
  PostId: any;
  objGetGroups: GroupDataModel = new GroupDataModel();
  objSearchModel: GeneralSearchModel = new GeneralSearchModel();
  searchTextGroup: string = "";
  public SidebarTypeEnum = SidebarTypeEnum;

  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public commentReplyImageUrls = [];
  public commentReplyVideoUrls = [];
  public mediaTypeEnum = MediaTypeEnum;
  isotopeGrid: any;
  today: Date;
  confirmDeleteObj = {
    objData: "",
    index: 0,
  };

  public deleteGroupPost = {
    index: 0,
    id: 0,
  };

  activeLoggedUser;

  constructor(
    public postService: PostService,
    public objDataService: DataService,
    private objRouter: Router,
    private objFollowService: FollowService,
    private title: Title,
    private objUserService: UserService,
    private objGroupService: GroupService,
    private objRoute: ActivatedRoute,
    private objPostService: PostService,
    public appComponent: AppComponent
  ) {
    this.imagePath = environment.imagePath;
  }

  popuuChildComment() {
    this.openPopupChildComment(false);
  }

  setPopupActionChildComment(fn: any) {
    this.objChildCommentText = "";
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

  ngOnInit() {
    this.today = new Date();
    this.activeLoggedUser = LoggedInUser.getLoggedInUser();
    this.initializeData();
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

  initializeData(groupId = undefined) {
    this.pageSizeFollowings = 10;
    this.pageNoFollowings = 0;
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

    this.objDataService.leaveGroupMessage.subscribe((res) => {
      this.objGroupInfo.Status = 6;
    });

    this.objUserService.getUserData().subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objUserSettings = res.Result;
      }
    });

    this.objRoute.params.subscribe((paramsId) => {
      this.ParamId = paramsId["Id"] ? paramsId["Id"] : groupId;
      this.GroupId = this.ParamId;
      if (this.ParamId) {
        this.getGroupPosts(this.ParamId);

        this.objGroupService
          .getAllJoinRequests(this.ParamId)
          .subscribe((res) => {
            this.objGroupRequests = res.Result;
          });

        this.objGroupService.getGroupInfo(this.ParamId).subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objGroupInfo = res.Result;
          }
        });
        this.getLocation();

        this.objFollowService
          .getFollowings("", this.pageNoFollowings, this.pageSizeFollowings)
          .subscribe((res) => {
            if (res.StatusCode == 200) {
              this.objFollowings = res.Result;
              for (let obj of this.objFollowings) {
                obj.IsUserFollow = true;
              }
            }
          });

        this.objGroupService
          .getFollowersToAdd(this.ParamId)
          .subscribe((res) => {
            if (res.StatusCode == 200) {
              this.objFollowers = res.Result;
            }
          });

        // var that = this;
        // $(
        //   function ($) {
        //     $('.add_people_pnl .list').bind('scroll', function () {
        //       if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        //         that.pageNoAllUsers++;
        //         that.objUserService.getAllUsers(that.PageSizeAllUsers, this.pageNoAllUsers)
        //           .subscribe(res => {
        //             if (res.StatusCode == 200) {
        //                 res.Result.forEach(flowr => {
        //                 that.objFollowers.push(flowr);
        //               });
        //             }
        //           });
        //       }
        //     })
        //   }
        // );

        this.PageSize = 14;
        this.PageNo = 0;
        this.objGroupService
          .getGroupMembersByGroupId(this.ParamId, this.PageSize, this.PageNo)
          .subscribe((res) => {
            this.objGroupMembers = res.Result;
          });

        var that = this;
        $(window).scroll(function () {
          if (
            $(window).scrollTop() >=
            $(document).height() - $(window).height()
          ) {
            that.PageNo++;
            that.objGroupService
              .getGroupPosts(that.ParamId, that.PageSize, that.PageNo)
              .subscribe((res) => {
                {
                  res.Result.Posts.forEach((post) => {
                    var newDate = new Date(post.CreatedDate + "Z");
                    post.CreatedDate = newDate;
                    that.objGetPostSettings.Posts.push(post);
                    post.Text = Helper.detectAndCreateLinks(post.Text);
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

        this.objGroupService.getGroupInfo(this.ParamId).subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objGroupInfo = res.Result;
          }
        });
        this.objPostService.getTrending().subscribe((res) => {
          if (res.StatusCode == 200) {
            this.objTrends = res.Result.Trends;
          }
        });

        this.initializeScripts();
        this.title.setTitle("Group Details | Risco");
        Helper.setBodyClass("groupsPage");
      }
    });
  }

  // onShareClick() {
  //     for (let j = 0; j < this.imageName.length; j++) {
  //         this.objPostSettings.ImageUrls += this.imageName[j] + ',';

  //     }
  //     for (let k = 0; k < this.videoName.length; k++) {
  //         this.objPostSettings.VideoUrls += this.videoName[k] + ',';
  //     }
  //     this.objPostSettings.ImageUrls = this.objPostSettings.ImageUrls.replace(/(^,)|(,$)/g, '');
  //     this.objPostSettings.VideoUrls = this.objPostSettings.VideoUrls.replace(/(^,)|(,$)/g, '');

  //     this.objPostSettings.Longitude = this.longitude;
  //     this.objPostSettings.Latitude = this.latitude;
  //     this.objPostSettings.Group_Id = this.ParamId;

  //     if (this.objPostSettings.Location == undefined || this.objPostSettings.Longitude == undefined || this.objPostSettings.Latitude == undefined) {
  //         $.notify(
  //             {
  //                 // options
  //                 message: 'You location access is currently blocked. Kindly allow your location access from site settings.'
  //             },
  //             {
  //                 // settings
  //                 type: 'danger'
  //             });
  //         return
  //     }

  //     this.objPostService.updateStatus(this.objPostSettings)
  //         .subscribe(res => {
  //             if (res.StatusCode == 200) {
  //                 res.Result.User = this.objUserSettings;
  //                 res.Result.Text = this.detectLinks(res.Result.Text);
  //                 this.objGetPostSettings.Posts.unshift(res.Result);
  //                 this.objPostSettings = new PostModel();
  //                 this.imageName = [];
  //                 this.videoName = [];
  //                 $('.custBtn').attr('disabled', true)
  //                 this.objPostSettings.Text = '';

  //                 setTimeout(() => {

  //                     $('.fancyImage').click(function () {
  //                         $(this).parent().children('a.fancyImage').each(function () {
  //                             $(this).attr('data-fancybox', 'image');
  //                         });
  //                     });

  //                     $('[data-fancybox]').fancybox({
  //                         touch: false,
  //                         'afterClose': function () {
  //                             $('.fancyImage').attr('data-fancybox', '');
  //                         }
  //                     });
  //                 }, 299)
  //             }
  //         })
  // }

  follow(i) {
    var userId = this.objGetPostSettings.Posts[i].User.Id;
    this.objFollowService.follow(userId).subscribe((res) => {
      if (res.StatusCode == 200) {
        this.objDataService.changeMessage({});

        var userSpecificList = this.objGetPostSettings.Posts.filter(
          (x) => x.User.Id == userId
        );
        for (let obj of userSpecificList) {
          obj.IsUserFollow = true;
        }
        this.objUserSettings.FollowingCount =
          this.objUserSettings.FollowingCount + 1;
      }
    });
  }

  popuuComment() {
    this.openPopupComment(false);
  }

  setPopupActionComment(fn: any) {
    this.objCommentText = "";
    this.openPopupComment = fn;
  }

  detailPostFollow(id) {
    var userId = id;
    this.objFollowService.follow(userId).subscribe((res) => {
      if (res.StatusCode == 200) {
        var userSpecificList = this.objGetPostSettings.Posts.filter(
          (x) => x.User.Id == userId
        );
        for (let obj of userSpecificList) {
          obj.IsUserFollow = true;
        }
        $(".detailFollowIcon").hide();
      }
    });
  }

  getRequests(Id) {
    this.objGroupService.getAllJoinRequests(Id).subscribe((res) => {
      this.objGroupRequests = res.Result;
    });
  }

  acceptRequest(obj, index) {
    this.groupId = this.ParamId;
    this.objGroupService
      .acceptJoinRequest(obj.User.Id, this.groupId)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objGroupRequests.splice(index, 1);
          // $('#removeLi' + obj.User.Id).remove();
          // this.objGroupRequests.length -= 1;

          // var grpMem = new GroupMembersModel();
          // grpMem.User = new UserModel();
          // grpMem.User.Id = obj.User.Id;
          // grpMem.User.FullName = obj.User.FullName;
          // grpMem.User.ProfilePictureUrl = obj.User.ProfilePictureUrl;
          // this.objGroupMembers.GroupMember.push(grpMem);

          // this.objGroupRequests.push(obj);
        }
      });
  }

  rejectRequest(userId, groupId, index) {
    this.objGroupService.rejectJoinRequest(userId, groupId).subscribe((res) => {
      if (res.StatusCode == 200) {
        // $('#removeLi' + userId).remove();
        // this.objGroupRequests.length -= 1;
        this.objGroupRequests.splice(index, 1);
      }
    });
  }

  userProfileRedirect(Id) {
    $("#postdetail").attr("data-fancybox-close", "");
    $("#postdetail").click();

    if (Id == this.objUserSettings.Id) this.objRouter.navigate(["/profile"]);
    else this.objRouter.navigate(["/user-profile/" + Id]);
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

  removeUserConfirmation(obj, i) {
    this.confirmDeleteObj.objData = obj;
    this.confirmDeleteObj.index = i;
    $("#delete-modal").modal("show");
  }

  removeUserByAdmin() {
    let obj: any;
    let i: any;
    obj = this.confirmDeleteObj.objData;
    i = this.confirmDeleteObj.index;
    this.groupId = this.ParamId;
    this.objGroupService
      .removeUserByAdmin(obj.User.Id, this.groupId)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objGroupMembers.GroupMember = this.objGroupMembers.GroupMember.filter(
            (x) => x.User.Id != obj.User.Id
          );
          //$('#removeli'+obj.User.Id).remove();
          var followingModel = new FollowingModel();
          followingModel.FirstUser = new UserModel();
          followingModel.FirstUser.Id = obj.User.Id;
          followingModel.FirstUser.FullName = obj.User.FullName;
          followingModel.FirstUser.ProfilePictureUrl =
            obj.User.ProfilePictureUrl;
          this.objFollowers.push(followingModel);
          this.objGroupMembers.GroupMemberCount -= 1;
        }
      });
  }

  addGroupMembersByAdmin(obj: FollowingModel) {
    this.groupId = this.ParamId;
    var that = this;
    this.objGroupService
      .addGroupMembersByAdmin(this.groupId, obj.FirstUser.Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          //$('.followerId'+obj.FirstUser.Id).remove();
          that.objFollowers = that.objFollowers.filter(
            (x) => x.FirstUser.Id != obj.FirstUser.Id
          );

          //To close post popup after post created successfully
          // this.closeBtn.nativeElement.click();
          // $(".alert-danger").remove();
          // $.notify(
          //   { message: "Post created successfully." },
          //   { type: "success" }
          // );
          // setTimeout(() => {
          //   $(".alert-success").remove();
          // }, 1000);

          var grpMem = new GroupMembersModel();
          grpMem.User = new UserModel();
          grpMem.User.Id = obj.FirstUser.Id;
          grpMem.User.FullName = obj.FirstUser.FullName;
          grpMem.User.ProfilePictureUrl = obj.FirstUser.ProfilePictureUrl;
          that.objGroupMembers.GroupMember.push(grpMem);
        }
      });
  }

  show1() {
    $("#tab1").show();
    $("#tab2").hide();
  }

  show2() {
    $("#tab2").show();
    $("#tab1").hide();
  }

  popuu() {
    this.shareButtonState();
    this.openPopup(false);
  }

  // timer = setTimeout(() => {
  //     $('.head a').click(function (event) {
  //         event.preventDefault();
  //         // $(this).parent().addClass('current');
  //         // $(this).parent().siblings().removeClass('current');
  //         var tab = $(this).attr('href');
  //         $('.tab').not(tab).css('display', 'none');
  //         $(tab).fadeIn();
  //     });
  // }, 500);

  setPopupAction(fn: any) {
    this.objPostSettings.Text = "";
    this.openPopup = fn;
  }

  initializeScripts() {
    // this.timer;

    $('[data-toggle="tooltip"]').tooltip();

    $("#delete_post_internal .custBtn").on("click", function () {
      $.fancybox.destroy();
    });

    // $('.profilePage .post-panel').on('click', function (e) {
    //     $(this).find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     e.preventDefault();
    //     $('html, body').animate({
    //         scrollTop: 300
    //     }, 500);
    // });

    // $('body').delegate('.status_pnl_close', 'click', function () {
    //     $('.update_status').fadeOut();
    //     $('body').css('position', 'static');
    //     $('.overlay-bg').removeClass('show');
    // })

    $(".add_member_wid .mem_head a").click(function (event) {
      event.preventDefault();
      $(this).addClass("current");
      $(this).siblings().removeClass("current");
      var tab = $(this).attr("href");
      $(".mem_tab").not(tab).css("display", "none");
      $(tab).fadeIn();
    });

    // $('.post-panel').on('click', function () {
    //     $(this).find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     $('body').css('position', 'fixed');
    //     $('body').css('width', '100%');
    // });
    // $('.post-panel h4').on('click',function(e){
    //     $(this).parent().find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     // $('body').css('position','fixed');
    //     // $('body').css('width','100%');
    // });

    // $('.cart-footer .more').on('click', function (e) {
    //     e.stopPropagation();
    //     $(this).parent().next().toggleClass('show');
    // });

    // $('.post-panel').on('click', function (e) {
    //     $(this).find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     // $('body').css('position','fixed');
    //     // $('body').css('width','100%');
    // });

    /* Post Detail Comment */
    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
      $(".user-comment .field .sent_btn").addClass("showIcon");
    });
    // $('body').delegate('.shareBtn', 'click', function () {
    //     $('.update_status').fadeOut();
    //     $('body').css('position', 'static');
    //     $('.overlay-bg').removeClass('show');
    // });
    // /* Status Update */
    // $('.post-panel').on('click',function(){
    //     $(this).find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //     $('body').css('position','fixed');
    //     $('body').css('width','100%');
    // });

    $(".user-comment .field").on("click", function (e) {
      e.stopPropagation();
      $(this).find("textarea").addClass("act");
      $(".user-comment small").show();
      $(".attach-list").show();
      $(".user-comment .field span").addClass("showIcon");
    });

    // /* Add Fav Post */
    // $('.cart-footer span.icon-star').on('click', function () {
    //     $(this).toggleClass('icon-star icon-fill-star');
    // });

    /* Add Fav Post */
    $(".cart-footer span.icon-thumbs-o-up").on("click", function () {
      $(this).toggleClass("icon-thumbs-o-up icon-thumbs-up2");
    });

    // /* Post More option */
    // $('body').delegate('.cart-footer .more', 'click', function(e){
    //     e.stopPropagation();
    //     $(this).next('.more-dropdown').toggle();
    // });

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

    // $('.icon-picture').click(function () {
    //     $('#uploadpic').click();
    // });

    // $('.icon-Forma-1').click(function () {
    //     $('#uploadvdo').click();
    // });
  }

  search() {

    if (this.searchTextGroupDetail == "") {
      $(".autocomplete_pnl").fadeOut();
      return;
    }

    this.objGroupService
      .searchFollowersToAdd(this.ParamId, this.searchTextGroupDetail)
      .subscribe((res) => {
        $(".field .autocomplete_pnl").fadeIn();
        this.objFollowersSearch = res.Result;
      });
  }

  remainingImages(id) {
    var className = ".galleryImages" + id + ":first";
    $(className).click();
  }

  turnOfNotification(i) {
    this.objPostService
      .turnOfNotification(this.objGetPostSettings.Posts[i].Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
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

  //#region
  onFileSelection(mediaType: MediaTypeEnum, IsParentComment: number) {
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
            // $('.fancyImage').click(function () {
            //     $(this).parent().children('a.fancyImage').each(function () {
            //         $(this).attr('data-fancybox', 'image');
            //     });
            // });

            // $('[data-fancybox]').fancybox({
            //     touch: false,
            //     'afterClose': function () {
            //         $('.fancyImage').attr('data-fancybox', '');
            //     }
            // });
          } else {
            $(".alert-danger").remove();
            $.notify({ message: res.Message }, { type: "danger" });
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

  onSelectFile(event) {
    if (event.target.files.length > 0) {
      $(".custBtn").removeAttr("disabled");
    }
    let fileBrowser = this.inPicturee.nativeElement;
    let file;

    for (let i = 0; i < fileBrowser.files.length; i++) {
      file = fileBrowser.files[i];

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
            touch: false,
            afterClose: function () {
              $(".fancyImage").attr("data-fancybox", "");
            },
          });
        }
      });
    }
  }

  onSelectVideo(event) {
    if (event.target.files.length > 0) {
      $(".custBtn").removeAttr("disabled");
    }
    let fileBrowser = this.inVideo.nativeElement;
    let file;

    for (let i = 0; i < fileBrowser.files.length; i++) {
      file = fileBrowser.files[i];

      console.log(this.imageName.length);
      this.objPostService
        .uploadPostMedia(file, MediaTypeEnum.Video)
        .subscribe((res) => {
          if (res.StatusCode == 200) {
            var encodedVideo = escape(res.Result);
            encodedVideo += "?v=" + new Date().getTime();
            this.videoName.push(encodedVideo);
            $("#uploadvdo").val("");
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
          }
        });
    }
  }

  getLocation() {
    var that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var latlng;
        that.latitude = position.coords.latitude;
        that.longitude = position.coords.longitude;

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
            //  this.objRouter.navigate(['dashboard/cm/']);
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
        //$('.postdetail .user-comment textarea').click();
        setTimeout(function () {
          $("#comnt").css("display", "inline-block").click();
          $(".postdetail .user-comment textarea").focus();
          $(".attach-list").hide();
        }, 200);
        res.Result.Text = Helper.detectAndCreateLinks(res.Result.Text);
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
    this.groupIdShare = id;
    $(".groupPopup ul li").on("click", function () {
      $(this).addClass("selected");
      $(this).siblings().removeClass("selected");
    });
  }

  groupShare() {
    this.objPostService
      .rePostGroup(
        this.PostId,
        this.objPostSettings.Location,
        1,
        this.groupIdShare
      )
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          window.location.reload();
        }
      });
  }

  hideAllPosts(i) {
    this.objPostService
      .hideAllPosts(this.objGetPostSettings.Posts[i].User.Id)
      .subscribe((res) => {
        if (res.StatusCode == 200) {
          window.location.reload();
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

  //   deletePost(postId){
  //     this.objPostService.deletePost(postId)
  //     .subscribe(res=>{
  //        window.location.reload();
  //     });
  // }

  refresh() {
    window.location.reload();
  }

  setIndex(i) {
    this.scope = "external";
    this.hideAllPostExternalIndex = i;
    this.reportId = this.objGetPostSettings.Posts[i].Id;
    $("#on1").click();
  }

  setIndexInternal(id, internalPostId) {
    this.scope = "internal";
    this.hideAllPostInternalIndex = id;
    this.internalPostId = internalPostId;
  }

  deletePost(index, postIndex) {
    this.deleteGroupPost["index"] = postIndex;
    this.deleteGroupPost["id"] = index;
    $.fancybox.open({
      src: "#delete_post",
      modal: true,
    });
    // if (this.scope == 'external') {

    //     var postId = this.objGetPostSettings.Posts[postIndex].Id;
    //     this.objPostService.deletePost(postId)
    //         .subscribe(res => {
    //             if (res.StatusCode == 200) {
    //                 this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Id != postId);
    //             }
    //         });
    // }
    // if (this.scope == 'internal') {

    //     this.internalPostId = index;
    //     this.objPostService.deletePost(this.internalPostId)
    //         .subscribe(res => {
    //             if (res.StatusCode == 200) {
    //                 $('#postdetail').attr('data-fancybox-close', '');
    //                 $('#postdetail').click();
    //                 $('#postdetail').attr('data-fancybox-close', '');
    //                 $('body').click();
    //                 this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Id != this.internalPostId);
    //                 ;
    //             }

    //         });
    // }
  }

  _deleteGroupPOst() {
    if (this.scope == "external") {
      var postId = this.deleteGroupPost.id;
      this.objPostService.deletePost(postId).subscribe((res) => {
        if (res.StatusCode == 200) {
          this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(
            (x) => x.Id != postId
          );
          $.fancybox.close({
            src: "#delete_post",
            type: "inline",
          });
        }
      });
    }
    if (this.scope == "internal") {
      this.internalPostId = this.deleteGroupPost.id;
      this.objPostService.deletePost(this.internalPostId).subscribe((res) => {
        if (res.StatusCode == 200) {
          $("#postdetail").attr("data-fancybox-close", "");
          $("#postdetail").click();
          $("#postdetail").attr("data-fancybox-close", "");
          $("body").click();
          this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(
            (x) => x.Id != this.internalPostId
          );
          $.fancybox.close({
            src: "#delete_post",
            type: "inline",
          });
        }
      });
    }
  }

  hidePostByIdInternal(id) {
    this.objPostService.hidePostById(id).subscribe((res) => {
      if (res.StatusCode == 200) {
        window.location.reload();
      }
    });
  }

  setId(i) {
    this.reportId = this.objGetPostSettings.Posts[i].Id;
    $("#on1").click();
  }

  setIdInternal(id) {
    this.reportId = id;
    $("#on1").click();
  }

  getValue(val) {
    this.reportVal = val;
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

  // detectLinks(postText: string) {
  //     //  detect links in post
  //     var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/ig

  //     postText = postText.replace(regex, '<a target='_blank' class='anchorClass' href='//$1'>$1</a> ');
  //     return postText.replace('//http://', 'http://').replace('//https://', 'https://');

  // }

  getGroupPosts(Id) {

    this.objGroupService.getGroupPosts(Id, this.PageSize, this.PageNo).subscribe((res) => {
        {
          this.objGetPostSettings = res.Result;
          for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
            var newDate = new Date(
              this.objGetPostSettings.Posts[i].CreatedDate + "Z"
            );
            this.objGetPostSettings.Posts[i].CreatedDate = newDate;
            this.objGetPostSettings.Posts[i].Text = Helper.detectAndCreateLinks(
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
              afterClose: function () {
                $(".fancyImage").attr("data-fancybox", "");
              },
            });
          }, 299);
        }
      });
  }

  //#region ----CREATE POST POPUP----
  onPostCreated(postObj: PostModel) {
    debugger;
    this.objGetPostSettings.Posts.unshift(postObj);
    //this.isotopeGrid.isotope('reloadItems').isotope();
  }

  onCreatePostPopupOpen() {
    $("body").css("position", "fixed");
    $("body").css("width", "100%");
  }

  onCreatePostPopupClose() {
    $("body").css("position", "static");
  }
  //#endregion

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

  //#region EmojiArea
  addEmoji($event: EmojiEvent, isParent: number) {
    if (isParent == 1) this.objCommentText += $event.emoji["native"];
    else this.objChildCommentText += $event.emoji["native"];
  }
  showEmojee(isParent: number) {
    if (isParent == 1) {
      // let elements: NodeListOf<Element> = document.getElementsByClassName('parent-comment-area');
      let elements = document.getElementsByClassName("parent-comment-area");

      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    } else {
      // let elements: NodeListOf<Element> = document.getElementsByClassName('child-comment-area');
      let elements = document.getElementsByClassName("child-comment-area");

      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    }
  }
  //#endregion
}
