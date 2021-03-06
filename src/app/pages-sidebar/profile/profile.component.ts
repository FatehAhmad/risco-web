import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { PostModel, PollOption } from '../../shared/models/post';
import { UserModel } from '../../shared/models/userModel';
import { GetPostModel } from '../../shared/models/get-post';
import { PostService } from '../../shared/services/post.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { CommentPostModel } from '../../shared/models/comment-post';
import { TrendsModel } from '../../shared/models/tends';
import { chkModel } from '../../shared/models/chk';
import { environment } from '../../../environments/environment';
import { CreateGroupModel } from '../../shared/models/create-group';
import { GroupService } from '../../shared/services/group.service';
import { Router } from '@angular/router';
import { FollowingModel } from '../../shared/models/followings';
import { FollowService } from '../../shared/services/follow.service';
import { GroupDataModel } from '../../shared/models/group-data';
import { GeneralSearchModel } from '../../shared/models/general-search';
import { AppComponent } from '../../app.component';
import { PagesSidebarComponent } from '../pages-sidebar.component';
import { MediaTypeEnum } from '../../shared/enum/media-type-enum';
import { SidebarTypeEnum } from 'src/app/shared/enum/sidebar-type';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji';

declare var $: any;
declare var google: any;


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [Title]
})
export class ProfileComponent implements OnInit {

    @ViewChild('inPicture') inPicture;
    @ViewChild('inVideo') inVideo;
    @ViewChild('inPicturee') inPicturee;
    @ViewChild('inPictureCover') inPictureCover;
    @ViewChild('inPictureGroup') inPictureGroup;
    @ViewChild('CreateGroupForm') CreateGroupForm;
    postLoaded:boolean;
    btnloader: boolean;
    fullName: string = "";
    objAccountSetting: UserModel = new UserModel();
    static city: string = "";
    imagesUrls: string = "";
    objPostSettings: PostModel = new PostModel();
    objGetPostSettings: GetPostModel = new GetPostModel();
    objGetPostSettingsById: CommentPostModel = new CommentPostModel();
    objCreateGroup: CreateGroupModel = new CreateGroupModel();
    objFollowings: FollowingModel[] = [];
    objFollowers: FollowingModel[] = [];
    public PostService = PostService;
    imageName = [];
    videoName = [];
    groupMembersIdsArray = [];
    groupMembersImageUrlsArray = [];
    RiskLevel: string = "";
    Id: number;
    scrollLoader: boolean;
    ProfilePictureUrl: string;
    urls = [];
    str: string;
    PageSize: number;
    pageNo: number;
    //   yo:string;
    textEntered: boolean = false;
    text: string = '';
    openPopup: Function;
    reportId: number;
    reportVal: any;
    latitude: number;
    longitude: number;
    city: string;
    loader: boolean;
    CommentsPicture: string;
    groupMemberIdsString: string;
    RiskLevelText: string;
    bool: boolean;
    objTest: chkModel = new chkModel();
    objTrends: TrendsModel[] = [];
    imagePath: any;
    isSaveButtonClick: boolean = false;
    hasValue: boolean = false;
    objCommentText: string = "";
    hideAllPostExternalIndex: any;
    hideAllPostInternalIndex: any;
    scope: string = "";
    internalPostId: number;
    btnloader1: boolean;
    btnloader2: boolean;
    openPopupComment: Function;
    openPopupChildComment: Function;
    objChildCommentText: string = "";
    pageSizeFollowings: number;
    pageNoFollowings: number;
    PageSizeFollowings: number;
    PageSizeMyGroups: number;
    PageNoMyGroups: number;
    groupId: number;
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

    isotopeGrid;
    today : Date;


    public tabsOpen : { post : boolean , media : boolean , following : boolean , followers : boolean } = {
        post :  true ,
        media : false ,
        following : false ,
        followers : false,
    }


    public profileTabs : { posts : boolean , incidents : boolean, replies : boolean, media : boolean , likes : boolean } = {
      posts :  true,
      incidents : false,
      replies : false,
      media : false,
      likes : false
    }

    // Use these properties to maintain count at profile tabs
    public profileTabsCounter : { posts : Number , incidents : Number, replies : Number, media : Number , likes : Number } = {
      posts :  0,
      incidents : 0,
      replies : 0,
      media : 0,
      likes : 0
    }


    public mediaDetail : any ;
    public followers : any = [] ;
    public unfollowers : any ;
    public pageNumber ;
    public pageSize ;
    followingIndex: any;
    followingId: any;

    constructor( public postService: PostService,
         private objRouter: Router, private objFollowService: FollowService, private objGroupService: GroupService, private title: Title,
        private objPostService: PostService,
         private objUserService: UserService, public appComponent: AppComponent, public pagesSidebarComponent: PagesSidebarComponent) {
        this.imagePath = environment.imagePath;
        this.loader = true;
        this.postLoaded = false;
        this.btnloader =  false;
        this.btnloader1 = false;
        this.btnloader2 = false;
    }
    popuuChildComment() {
        this.openPopupChildComment(false);
    }

    redirectToPostDetail(postId) {

      this.objRouter.navigate(["/post-detail/" + postId]);
    }

    setPopupActionChildComment(fn: any) {
        this.objChildCommentText = "";
        this.openPopupChildComment = fn;
    }

    searchGroup() {
        if (this.searchTextGroup == "") {
            $('.autocomplete_pnl').fadeOut();
            return;
        }

        this.objGroupService.groupSearching(this.searchTextGroup)
            .subscribe(res => {
                $('.group_search .autocomplete_pnl').fadeIn();
                this.objSearchModel = res.Result;
            })
    }

    // onShareClick() {
    //     for (let j = 0; j < this.imageName.length; j++) {
    //         this.objPostSettings.ImageUrls += this.imageName[j] + ",";
    //     }

    //     for (let k = 0; k < this.videoName.length; k++) {
    //         this.objPostSettings.VideoUrls += this.videoName[k] + ",";
    //     }

    //     this.objPostSettings.ImageUrls = this.objPostSettings.ImageUrls.replace(/(^,)|(,$)/g, "");
    //     this.objPostSettings.VideoUrls = this.objPostSettings.VideoUrls.replace(/(^,)|(,$)/g, "");

    //     this.objPostSettings.Longitude = this.longitude;
    //     this.objPostSettings.Latitude = this.latitude;


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
    //                 res.Result.User = this.objAccountSetting;
    //                 res.Result.Text = this.detectLinks(res.Result.Text);
    //                 this.objGetPostSettings.Posts.unshift(res.Result);
    //                 this.objPostSettings = new PostModel();
    //                 this.imageName = [];
    //                 this.videoName = [];

    //                 $(".custBtn").attr("disabled", true)
    //                 this.objPostSettings.Text = "";
    //                 setTimeout(() => {
    //                     $(".fancyImage").click(function () {

    //                         $(this).parent().children("a.fancyImage").each(function () {
    //                             $(this).attr("data-fancybox", "image");
    //                         });
    //                     });

    //                     $('[data-fancybox]').fancybox({
    //                         "afterClose": function () {
    //                             ;
    //                             $(".fancyImage").attr("data-fancybox", "");
    //                         }
    //                     });
    //                 }, 799)
    //             }
    //         })
    // }

    userProfileRedirect(Id) {
        $("#postdetail").attr("data-fancybox-close", "");
        $("#postdetail").click();

        if (Id == this.objAccountSetting.Id)
            this.objRouter.navigate(['/profile']);
        else
            this.objRouter.navigate(["/user-profile/" + Id]);
    }

    // popuu() {
    //     this.shareButtonState();
    //     this.openPopup(false);
    // }

    setPopupAction(fn: any) {
        this.objPostSettings.Text = "";
        this.openPopup = fn;
    }

    popuuComment() {
        this.openPopupComment(false);
    }

    setPopupActionComment(fn: any) {
        this.objCommentText = "";
        this.openPopupComment = fn;
    }

    createGroup() {
        if (!this.CreateGroupForm.valid || this.groupMembersImageUrlsArray.length == 0) {
            this.isSaveButtonClick = true;
            this.hasValue = true;
            return;
        }
        this.hasValue = false;
        this.isSaveButtonClick = false;
        this.objCreateGroup.GroupMembersIds = this.groupMemberIdsString;

        this.btnloader =  true;
        this.objGroupService.createGroup(this.objCreateGroup)
            .subscribe(res => {
                if (res.StatusCode == 200) {

                    $("#createGrp").attr("data-fancybox-close", "");
                    $("#createGrp").click();
                    this.objRouter.navigate(["/group-detail/" + res.Result.Id]);
                    this.btnloader =  false;
                }
            });
    }

    groupInterestClick() {
        $("#int1").click();
        $('.add_people_pnl .list li').on('click', function () {
            $(this).toggleClass('selected');
        });
    }

    onFileChangeGroup(event) {
        let files = event.target.files;

        var ext = files[files.length - 1].name.split('.').pop();
        if (ext == "jpg" || ext == "png" || ext == "jpeg") {

            var reader = new FileReader();
            var that = this;
            reader.onload = function (e) {
                $('.groupImage').css('background-image', 'url(' + (<any>e.target).result + ')');
                $('.groupImage').attr('src', (<any>e.target).result);

                let fileBrowser = that.inPictureGroup.nativeElement;
                let file = fileBrowser.files[0];

                that.objGroupService.uploadGroupImage(file)
                    .subscribe(
                        res => {
                            if (res) {
                                that.objCreateGroup.ImageUrl = res.Result;


                            }
                        }
                    );
            }
            reader.readAsDataURL(files[files.length - 1]);
        }
    }

    selectGroupMembers(groupMemberIds, imageUrls) {
        let isFound = false;

        this.groupMembersIdsArray.forEach(ele => {
            if (ele == groupMemberIds) {
                isFound = true;
            }
        });
        if (isFound) {
            this.groupMembersIdsArray.splice(this.groupMembersIdsArray.indexOf(groupMemberIds), 1)
            this.groupMembersImageUrlsArray.splice(this.groupMembersImageUrlsArray.indexOf(imageUrls), 1)
        }
        else {
            this.groupMembersIdsArray.push(groupMemberIds);
            this.groupMembersImageUrlsArray.push(imageUrls);

            if (this.groupMembersImageUrlsArray.length == 0) {
                this.hasValue = true;
            }
            if (this.groupMembersImageUrlsArray.length > 0) {
                this.hasValue = false;
            }
        }
        //converting above array to comma separated string
        this.groupMemberIdsString = this.groupMembersIdsArray.join();


    }

    remainingImages(id) {
        var className = ".galleryImages" + id + ":first";
        $(className).click();
    }

    //#region
    onSelectFile(mediaType: MediaTypeEnum, IsParentComment: number) {
        var fileList: any = (<HTMLInputElement>event.target).files;
        var files = [];
        for (let file of fileList)  files.push(file);
        if (mediaType == MediaTypeEnum.Image && files.findIndex(x => x.type.indexOf("image") === -1) > -1) {
            $('.alert-danger').remove();
            $.notify(
                { message: 'Please select images only.' },
                { type: 'danger' }
            );
        }
        else if (mediaType == MediaTypeEnum.Video && files.findIndex(x => x.type.indexOf("video") === -1) > -1) {
            $('.alert-danger').remove();
            $.notify(
                { message: 'Please select video only.' },
                { type: 'danger' }
            );
        }
        else if (files.findIndex(x => x.size > 20971520) > -1) {
            $('.alert-danger').remove();
            $.notify(
                { message: 'No file can exceed 20MB.' },
                { type: 'danger' }
            );
        }
        else {
            for (let file of files) {
                this.postService.uploadPostMedia(file, mediaType).subscribe(res => {

                    if (res.StatusCode == 200) {
                        if (mediaType == MediaTypeEnum.Image) {
                            if(IsParentComment == 1){
                                this.onRemoveFile(this.mediaTypeEnum.Image,0);
                                this.uploadedImageUrls.push(res.Result);
                            }
                            else{
                                this.onRemoveFile(this.mediaTypeEnum.Video,0);
                                this.commentReplyImageUrls.push(res.Result);
                            }
                        }
                        else {
                            if(IsParentComment == 1) this.uploadedVideoUrls.push(res.Result);
                            else  this.commentReplyVideoUrls.push(res.Result);
                        }
                        if(IsParentComment){
                            $('#comnt').css('display', 'inline-block').click();
                            $('.user-comment .field').click();
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

        $("#uploadpicCmnt").val('');
        $("#uploadvdoCmnt").val('');
        $("#uploadpicCmntReply").val('');
        $("#uploadvdoCmntReply").val('');
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



    //   onSelectFile(event) {
    //     if (event.target.files && event.target.files[0]) {
    //         var filesAmount = event.target.files.length;
    //         for (let i = 0; i < filesAmount; i++) {
    //                 var reader = new FileReader();

    //             reader.onload = (event) => {
    //                this.urls.push((<any>event.target).result);

    //             }

    //             reader.readAsDataURL(event.target.files[i]);
    //     }
    //   }
    //     let fileBrowser = this.inPicturee.nativeElement;
    //     let file;

    //     for (let i = 0; i < fileBrowser.files.length; i++) {
    //       file =  fileBrowser.files[i];
    //       this.objPostService.updatePostImage(file)
    //       .subscribe(
    //         res => {
    //           if(res.StatusCode==200){
    //             this.imageName.push(res.Result)
    //          }
    //         }
    //       );
    //     }



    turnOfNotification(i) {
        this.objPostService.turnOfNotification(this.objGetPostSettings.Posts[i].Id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    //     console.log("notification turned off");
                }
            });
    }

    initializeScripts() {

        $('[data-toggle="tooltip"]').tooltip();

        $('#delete_post_internal .custBtn').on('click', function () {
            $.fancybox.destroy();
        });

        $('.add_people_pnl .head').on('click', function (e) {
            e.stopPropagation();
            $('.add_people_pnl').show();
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

        //  /* Post More option */
        //  $('body').delegate('.cart-footer .more', 'click', function(e){
        //     e.stopPropagation();
        //     $(this).next('.more-dropdown').toggle();
        // });

        // $('body').delegate('.status_pnl_close', 'click', function () {
        //     $('.update_status').fadeOut();
        //     $('body').css("position", "static");
        //     $('.overlay-bg').removeClass('show');
        // })

        $('.createGroup .icon-group').on('click', function (e) {
            e.stopPropagation();
            $(this).next('.add_people_pnl').stop(0, 0).fadeToggle();
        });

        $('body').delegate('.add_people_pnl .list li', 'click', function (e) {
            e.stopPropagation();
            $('.add_people_pnl').fadeIn();
        });

        // $('.cart-footer .more').on('click', function (e) {
        //     e.stopPropagation();
        //     $(this).parent().next().toggleClass('show');
        // });

        // $('.post-panel').on('click', function (e) {
        //     $(this).find('.update_status').fadeIn();
        //     $('.overlay-bg').addClass('show');
        //     // $('body').css("position","fixed");
        //     // $('body').css("width","100%");
        // });

        /* Post Detail Comment */
        $('.user-comment .field').on('click', function (e) {
            e.stopPropagation();
            $(this).addClass('act');
            $(this).find('textarea').addClass('act');
            $('.user-comment small').show();
            $('.attach-list').show();
            $('.user-comment .field span').addClass('showIcon');
            $('.user-comment .field .sent_btn').addClass('showIcon');
        });
        // $('body').delegate('.shareBtn', 'click', function () {
        //     $('.update_status').fadeOut();
        //     $('body').css("position", "static");
        //     $('.overlay-bg').removeClass('show');
        // });
        // /* Status Update */
        // $('.post-panel').on('click',function(){
        //     $(this).find('.update_status').fadeIn();
        //     $('.overlay-bg').addClass('show');
        //     $('body').css("position","fixed");
        //     $('body').css("width","100%");
        // });

        $('.user-comment .field').on('click', function (e) {
            e.stopPropagation();
            $(this).find('textarea').addClass('act');
            $('.user-comment small').show();
            $('.attach-list').show();
            $('.user-comment .field span').addClass('showIcon');
        });

        // /* Add Fav Post */
        // $('.cart-footer span.icon-star').on('click', function () {

        //     $(this).toggleClass('icon-star icon-fill-star');
        // });

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

        /* Add Fav Post */
        $('.cart-footer span.icon-thumbs-o-up').on('click', function () {
            $(this).toggleClass('icon-thumbs-o-up icon-thumbs-up2');
        });

        // /* Post More option */
        // $('.cart-footer span.icon-more').on('click', function (e) {
        //     ;
        //     e.stopPropagation();
        //     $(this).parent().next().toggleClass('show');
        // });

        //  /* Post More option */
        //  $('body').delegate('.cart-footer .more', 'click', function(e){
        //     e.stopPropagation();
        //     $(this).next('.more-dropdown').toggle();
        // });

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
        // $('.icon-picture').click(function () {
        //     $('#uploadpic').click();

        // });

        // $('.icon-Forma-1').click(function () {
        //     $('#uploadvdo').click();

        // });

        // setTimeout(()=>{

        //     $('[data-fancybox]').fancybox({
        //         arrows : true,
        //         keyboard : true,
        //         infobar : true,
        //         loop    : false,
        //         touch : false,
        //         afterShow: function( instance, current ) {
        //             this.content.find('video').trigger('stop');
        //         },
        //         buttons : [
        //             // 'slideShow',
        //             // 'fullScreen',
        //             // 'thumbs',
        //             'share',
        //             'download',
        //             // 'zoom',
        //             'close'
        //         ]
        //       })
        // },1700);

    }

    starClicked(parentPostIndex, extendedPostIndex, isExtended) {
        $("#likeExternal").addClass("noEvents");
        $("#unlikeExternal").addClass("noEvents");
        $(event.target).toggleClass('icon-thumbs-up icon-thumbs-up2');

        //if post is an extended post
        if (isExtended) {

            if (this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].IsLiked == true) {
                this.objPostService.unlikePost(this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].Id)
                    .subscribe(res => {
                        if(res.StatusCode==200){
                            $("#unlikeExternal").removeClass("noEvents");
                            this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].IsLiked = false;
                            this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].LikesCount = this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].LikesCount - 1;
                        }
                    })
            }
            else {
                this.objPostService.likePost(this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].Id)
                    .subscribe(res => {
                        if(res.StatusCode==200){
                            $("#likeExternal").removeClass("noEvents");
                            this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].IsLiked = true;
                            this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].LikesCount = this.objGetPostSettings.Posts[parentPostIndex].ExtendedPostList[extendedPostIndex].LikesCount + 1;
                        }

                    })
            }
        }
        //if post is not extended / threaded / children
        else {
            if (this.objGetPostSettings.Posts[parentPostIndex].IsLiked == true) {
                this.objPostService.unlikePost(this.objGetPostSettings.Posts[parentPostIndex].Id)
                    .subscribe(res => {
                        if(res.StatusCode==200){
                            $("#unlikeExternal").removeClass("noEvents");
                            this.objGetPostSettings.Posts[parentPostIndex].IsLiked = false;
                            this.objGetPostSettings.Posts[parentPostIndex].LikesCount = this.objGetPostSettings.Posts[parentPostIndex].LikesCount - 1;
                        }
                    })
            }
            else {
                this.objPostService.likePost(this.objGetPostSettings.Posts[parentPostIndex].Id)
                    .subscribe(res => {
                        if(res.StatusCode==200){
                            $("#likeExternal").removeClass("noEvents");
                            this.objGetPostSettings.Posts[parentPostIndex].IsLiked = true;
                            this.objGetPostSettings.Posts[parentPostIndex].LikesCount = this.objGetPostSettings.Posts[parentPostIndex].LikesCount + 1;
                        }

                    })
            }
        }
    }





    internalStarClicked() {
        $("#likeInternal").addClass("noEvents");
        $("#unlikeInternal").addClass("noEvents");
        $(event.target).toggleClass('icon-thumbs-up icon-thumbs-up2');
        if (this.objGetPostSettingsById.IsLiked == true) {

            this.objPostService.unlikePost(this.objGetPostSettingsById.Id)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        $("#unlikeInternal").removeClass("noEvents");
                        this.objGetPostSettingsById.IsLiked = false;
                        this.objGetPostSettingsById.LikesCount = this.objGetPostSettingsById.LikesCount - 1;
                        var obj = this.objGetPostSettings.Posts.find(x => x.Id == this.objGetPostSettingsById.Id);
                        if (obj) {
                            obj.IsLiked = false;
                            obj.LikesCount = obj.LikesCount - 1;
                        }

                    }
                })
        }
        else {

            this.objPostService.likePost(this.objGetPostSettingsById.Id)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        $("#likeInternal").removeClass("noEvents");
                        this.objGetPostSettingsById.IsLiked = true;
                        this.objGetPostSettingsById.LikesCount = this.objGetPostSettingsById.LikesCount + 1;

                        var obj = this.objGetPostSettings.Posts.find(x => x.Id == this.objGetPostSettingsById.Id);
                        if (obj) {
                            obj.IsLiked = true;
                            obj.LikesCount = obj.LikesCount + 1;
                        }
                    }
                })
        }
    }

    moreClicked(e) {
        e.stopPropagation();
        $(event.target).parent().next().toggleClass('show');
    }

    // moreClick(obj){
    //     ;

    //     if(!obj.IsToggled){

    //         $('body').delegate('.cart-footer .more', 'click', function(e){
    //             e.stopPropagation();
    //             $(this).find('.more-dropdown').toggle();
    //             $(this).siblings().find('.more-dropdown').hide();
    //          });

    //          obj.IsToggled=true;

    //     }

    //     else{
    //         $('body').delegate('.cart-footer .more', 'click', function(e){
    //             e.stopPropagation();
    //             $(this).find('.more-dropdown').toggle();
    //             $(this).siblings().find('.more-dropdown').hide();
    //          });
    //          $('body').delegate('.cart-footer .more', 'click', function(e){
    //             e.stopPropagation();
    //             $(this).find('.more-dropdown').toggle();
    //             $(this).siblings().find('.more-dropdown').hide();
    //          });
    //          obj.IsToggled=false;
    //     }

    //     $(this).find('.more-dropdown').css("display","none");
    //     // $(this).find('.more-dropdown').toggle();
    //     // $(this).siblings().find('.more-dropdown').hide();
    //          /* Post More option */




    // }
    moreClick(obj) {

        if (!obj.IsToggled) {

            $('body').delegate('.cart-footer .more', 'click', function (e) {
                e.stopPropagation();
                $(this).find('.more-dropdown').show();
                $(this).siblings().find('.more-dropdown').hide();
            });

            obj.IsToggled = true;

        }

        else {

            $(this).find('.more-dropdown').show();
            $(this).find('.more-dropdown').show();
            // $('body').delegate('.cart-footer .more', 'click', function(e){
            //     e.stopPropagation();
            //     $(this).find('.more-dropdown').toggle();
            //     $(this).siblings().find('.more-dropdown').hide();
            //  });
            //  $('body').delegate('.cart-footer .more', 'click', function(e){
            //     e.stopPropagation();
            //     $(this).find('.more-dropdown').toggle();
            //     $(this).siblings().find('.more-dropdown').hide();
            //  });

            obj.IsToggled = false;
        }

        // $(this).find('.more-dropdown').toggle();
        // $(this).siblings().find('.more-dropdown').hide();
        /* Post More option */




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

    repostCliked(e) {
        e.stopPropagation();
        $(event.target).parent().next().toggleClass('show');
    }

    setRiskLevel(riskLevel) {
        if (riskLevel == 1)
            this.RiskLevelText = "High";
        else if (riskLevel == 2)
            this.RiskLevelText = "Medium";
        else if (riskLevel == 3)
            this.RiskLevelText = "Low";
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
                                //    console.log()
                                //  this.objRouter.navigate(["dashboard/cm/"]);

                            }
                        }
                    );
            }
            reader.readAsDataURL(files[files.length - 1]);
        }
    }

    setIndex(i) {
        this.scope = "external";
        this.hideAllPostExternalIndex = i;
        this.reportId = this.objGetPostSettings.Posts[i].Id;
        $("#on1").click();
    }

    setIndexInternal(id, internalPostId) {
        ;
        this.scope = "internal";
        this.hideAllPostInternalIndex = id;
        this.internalPostId = internalPostId;
    }

    deletePost(index) {

        if (this.scope == "external") {

            var postId = this.objGetPostSettings.Posts[index].Id;
            this.objPostService.deletePost(postId)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Id != postId);
                        this.objUserService.getUserById(this.objAccountSetting.Id)
                            .subscribe(res => {
                                this.objAccountSetting.MediaCount = res.Result.MediaCount;
                            })
                    }
                });
        }
        if (this.scope == "internal") {
            this.internalPostId = index;
            this.objPostService.deletePost(this.internalPostId)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        $("#postdetail").attr("data-fancybox-close", "");
                        $("#postdetail").click();
                        $("#postdetail").attr("data-fancybox-close", "");
                        $("body").click();
                        this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Id != this.internalPostId);
                        this.objUserService.getUserById(this.objAccountSetting.Id)
                            .subscribe(res => {
                                this.objAccountSetting.MediaCount = res.Result.MediaCount;
                            })

                    }

                });
        }

    }

    commentClicked(parentPostId, k, e) {

      let postId: number = 0;

      if (parentPostId == undefined) {

        postId = this.objGetPostSettings.Posts.filter(x => x.Id == k)[0].Id;
      }
      else {
        postId = this.objGetPostSettings.Posts.filter(x => x.Id == parentPostId)[0].ExtendedPostList.filter(x => x.Id == k)[0].Id;
      }

        let __this = this;
        this.objPostService.getPostsByPostId(postId)
            .subscribe(res => {
                //$(".postdetail .user-comment textarea").click();
                setTimeout(function () {
                    $('#comnt').css('display', 'inline-block').click();
                    $(".postdetail .user-comment textarea").focus();
                    $(".attach-list").hide();
                }, 200);


                res.Result.Text = Helper.detectAndCreateLinks(res.Result.Text);

                this.objGetPostSettingsById = res.Result;
                this.CommentsPicture = this.objGetPostSettingsById.User.ProfilePictureUrl;
                var newDate = new Date(this.objGetPostSettingsById.CreatedDate + 'Z');
                this.objGetPostSettingsById.CreatedDate = newDate;
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
                setTimeout(() => {
                    $(".fancyImage").click(function () {

                        $(this).parent().children("a.fancyImage").each(function () {
                            $(this).attr("data-fancybox", "image");
                        });
                    });

                    $('[data-fancybox]').fancybox({
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
                }, 299)
                // setTimeout(()=>{

                //     $('[data-fancybox]').fancybox({
                //         arrows : true,
                //         keyboard : true,
                //         infobar : true,
                //         loop    : false,
                //         touch : false,
                //         afterShow: function( instance, current ) {
                //             ;
                //             this.content.find('video').trigger('stop');
                //         },
                //         buttons : [
                //             // 'slideShow',
                //             // 'fullScreen',
                //             // 'thumbs',
                //             'share',
                //             'download',
                //             // 'zoom',
                //             'close'
                //         ]
                //       })
                // },700);
            });
            setTimeout(() => {
                $('.comentvideoautoplaystop').trigger('pause');
            }, 1000);
    }

    onkeyUp($event, text) {
        if ($event.key == "Enter") {
            this.postComment(text.value);
        }
    }

    postComment(text) {
        this.btnloader1 = true;
        this.objPostService.postComment(text, this.objGetPostSettingsById.Id, 0, this.uploadedImageUrls[0], this.uploadedVideoUrls[0])
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    res.Result.User = this.objAccountSetting;
                    this.objGetPostSettingsById.Comments.push(res.Result);
                    this.objGetPostSettingsById.CommentsCount = this.objGetPostSettingsById.CommentsCount + 1;

                    var obj = this.objGetPostSettings.Posts.find(x => x.Id == this.objGetPostSettingsById.Id);
                    if (obj) {
                        obj.CommentsCount = obj.CommentsCount + 1;
                    }
                    this.objCommentText = "";
                    $("#comnt").val("");
                    text = "";

                    this.onRemoveFile(this.mediaTypeEnum.Image, 0);
                    this.onRemoveFile(this.mediaTypeEnum.Video, 0);
                    $('.user-comment .field').removeClass('act');
                }
                this.btnloader1 = false;
            });
    }

    getMyGroups(i) {
        this.PostId = this.objGetPostSettings.Posts[i].Id;
        this.PageSizeMyGroups = 10;
        this.PageNoMyGroups = 0;
        this.objGroupService.getGroups(this.PageSizeMyGroups, this.PageNoMyGroups)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objGetGroups = res.Result;
                }
            });
    }

    getMyGroupsInternal(id) {
        this.PostId = id;
        this.PageSizeMyGroups = 10;
        this.PageNoMyGroups = 0;
        this.objGroupService.getGroups(this.PageSizeMyGroups, this.PageNoMyGroups)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objGetGroups = res.Result;
                }
            });
    }

    selectedGroup(id) {
        this.groupId = id;
        $('.groupPopup ul li').on('click', function () {
            $(this).addClass('selected');
            $(this).siblings().removeClass('selected');
        });
    }

    groupShare() {
        this.objPostService.rePostGroup(this.PostId, this.objPostSettings.Location, 1, this.groupId)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    window.location.reload();
                }
            })
    }

    hideAllPosts(i) {
        this.objPostService.hideAllPosts(this.objGetPostSettings.Posts[i].User.Id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    window.location.reload()
                }
            });
    }

    hideAllPostsInternal(userId) {
        this.objPostService.hideAllPosts(userId)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    window.location.reload()
                }
            });
    }

    hidePostById(i) {
        this.objPostService.hidePostById(this.objGetPostSettings.Posts[i].Id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    window.location.reload()
                }
            });
    }

    hidePostByIdInternal(id) {
        this.objPostService.hidePostById(id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    window.location.reload()
                }
            });
    }

    setId(i) {
        this.reportId = this.objGetPostSettings.Posts[i].Id;
    }
    setIdInternal(id) {
        this.reportId = id;
        $("#on1").click();
    }

    getValue(val) {
        this.reportVal = val;
    }

    reportPost(message) {
        this.objPostService.reportPost(this.reportId, this.reportVal, message.value)
            .subscribe(res => {
                if (res.StatusCode == 200) {

                }
            })

    }

    commentStarClicked(i) {

        $(event.target).toggleClass('icon-thumbs-up icon-thumbs-up2');
        if (this.objGetPostSettingsById.Comments[i].IsLiked == true) {
            this.objPostService.unLikeComment(this.objGetPostSettingsById.Comments[i].Id, this.objGetPostSettingsById.Id)
                .subscribe(res => {
                    this.objGetPostSettingsById.Comments[i].IsLiked = false;
                })
        }
        else {
            this.objPostService.likeComment(this.objGetPostSettingsById.Comments[i].Id, this.objGetPostSettingsById.Id)
                .subscribe(res => {
                    this.objGetPostSettingsById.Comments[i].IsLiked = true;
                })
        }
    }

    // replyComment(id, text) {
    //     ;
    //     if (text.value == null) {
    //         return;
    //     }
    //     this.objPostService.commentReply(text.value, this.objGetPostSettingsById.Id, id)
    //         .subscribe(res => {
    //             if (res.StatusCode == 200) {
    //                 res.Result.User = this.objAccountSetting;
    //                 this.objGetPostSettingsById.Comments.find(x => x.Id == res.Result.ParentComment_Id).ChildComments.push(res.Result);
    //                 this.objGetPostSettingsById.CommentsCount = this.objGetPostSettingsById.CommentsCount + 1;

    //             }
    //             var obj = this.objGetPostSettings.Posts.find(x => x.Id == this.objGetPostSettingsById.Id);
    //                 if (obj) {
    //                     obj.CommentsCount = obj.CommentsCount + 1;
    //                 }
    //             $("#replyText").val("");
    //             text.reset();
    //         })
    // }
    replyComment(id, text) {
        this.btnloader2 = true;
        this.objPostService.commentReply(text, this.objGetPostSettingsById.Id, id, this.commentReplyImageUrls[0], this.commentReplyVideoUrls[0])
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    res.Result.User = this.objAccountSetting;
                    this.objGetPostSettingsById.Comments.find(x => x.Id == res.Result.ParentComment_Id).ChildComments.push(res.Result);
                    this.objGetPostSettingsById.CommentsCount = this.objGetPostSettingsById.CommentsCount + 1;

                }
                var obj = this.objGetPostSettings.Posts.find(x => x.Id == this.objGetPostSettingsById.Id);
                if (obj) {
                    obj.CommentsCount = obj.CommentsCount + 1;
                }
                this.objChildCommentText = "";
                $("#replyText").val("");
                //text.reset();
                text = "";
                this.onRemoveFile(this.mediaTypeEnum.Image, 0);
                this.onRemoveFile(this.mediaTypeEnum.Video, 0);
                $('.sub_comment_btn').find('span').removeClass('act');
                $('.sub_comment_btn').parents('.actBtns').next('.sub_comment_box').hide();
                this.btnloader2 = false;
            })
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
                    .subscribe(res => {
                        if (res) {
                            //    console.log()

                        }
                    }
                    );
            }
            reader.readAsDataURL(files[files.length - 1]);
        }
    }

    // shareButtonState() {
    //     ;
    //     if (this.imageName.length < 1) {
    //         if (this.objPostSettings.Text != undefined && this.objPostSettings.Text.trim() == "") {
    //             $(".custBtn").attr("disabled", true)
    //         }
    //         else
    //             $('.custBtn').removeAttr("disabled");
    //     }
    //     else
    //         $('.custBtn').removeAttr("disabled");


    // }

    // detectLinks() {
    //     //  detect link in image
    //     $('.filter-email-box p').ready(function () {

    //         $('.filter-email-box p').each(function () {
    //             var html = $(this).html();
    //             var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/ig
    //             var text = html.replace(regex, "<a href='$1'>$1</a>");
    //             $(this).html(text);
    //         });
    //     });
    //     //end
    // }

    // @HostListener("window:scroll", [])
    // onScroll(): void {
    //     //var that = this;

    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //        console.log("bottom"); // you're at the bottom of the page
    //         if($(window).scrollTop() + $(window).height() == $(document).height()) {

    //             this.pageNo++;
    //             this.objPostService.getPosts(this.PageSize,this.pageNo)
    //             .subscribe(res => {
    //              {
    //                  res.Result.Posts.forEach(post => {
    //                     var newDate =  new Date(post.CreatedDate +'z'  );
    //                     post.CreatedDate=newDate;
    //                     this.objGetPostSettings.Posts.push(post);

    //                  });

    //                  setTimeout(()=>{ $(".fancyImage").click(function(){
    //                      ;
    //                     $(this).parent().children("a.fancyImage").each(function () {
    //                      $(this).attr("data-fancybox","image");
    //                  });
    //                  });

    //                  $('[data-fancybox]').fancybox({
    //                     touch : false,
    //                      "afterClose": function(){
    //                          ;
    //                         $(".fancyImage").attr("data-fancybox","");
    //                      }
    //                   });
    //                  },799)

    //              }
    //              });
    //          }
    //     }
    // }

    ngOnInit() {
        this.pageSizeFollowings = 10;
        this.pageNoFollowings = 0;

        this.initializeScripts();
        this.fullName = LoggedInUser.getLoggedInUser().FullName;
        this.Id = LoggedInUser.getLoggedInUser().Id;
        this.ProfilePictureUrl = LoggedInUser.getLoggedInUser().ProfilePictureUrl;
        this.PageSize = 10;
        this.pageNo = 0;
        //custom title
        this.title.setTitle('Profile | Risco');
        Helper.setBodyClass("profilePage");

        this.today = new Date();
        //this.getLocation();

        this.objPostService.getPostsDetailByUserId(this.Id, this.PageSize, this.pageNo)
            .subscribe(res => {
                {
                    this.postLoaded=true;
                    this.objGetPostSettings = res.Result;

                    for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
                        var newDate = new Date(this.objGetPostSettings.Posts[i].CreatedDate + 'Z');
                        this.objGetPostSettings.Posts[i].CreatedDate = newDate;
                        if (this.objGetPostSettings.Posts[i].Text != null) {
                            this.objGetPostSettings.Posts[i].Text = Helper.detectAndCreateLinks(this.objGetPostSettings.Posts[i].Text);
                        }
                        this.objGetPostSettings.Posts[i].IsToggled = false;
                    }

                    setTimeout(() => {
                        $(".fancyImage").click(function () {

                            $(this).parent().children("a.fancyImage").each(function () {
                                $(this).attr("data-fancybox", "image");
                            });
                        });

                        $('[data-fancybox]').fancybox({
                            "afterClose": function () {
                                $(".fancyImage").attr("data-fancybox", "");
                            }
                        });

                    }, 299)
                }
                this.loader = false;
            });

        this.objUserService.getUserData()
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objAccountSetting = res.Result;
                    if (this.objAccountSetting.ProfilePictureUrl != null)
                        this.objAccountSetting.ProfilePictureUrl += ("?v=" + new Date().getTime());
                    if (this.objAccountSetting.CoverPictureUrl != null)
                        this.objAccountSetting.CoverPictureUrl += ("?v=" + new Date().getTime());
                }
            });
        this.objPostService.getTrending()
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objTrends = res.Result.Trends;
                }
            });

        this.objFollowService.getFollowings("", this.pageNoFollowings, this.pageSizeFollowings)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objFollowings = res.Result;
                }
            });

        this.objFollowService.getFollowers("", this.pageNoFollowings, this.pageSizeFollowings)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.objFollowers = res.Result;
                }
            });

        var that = this;

        $(window).scroll(function () {
            if (that.objRouter.url == "/profile") {
                if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {

                    that.scrollLoader = true;
                    that.pageNo++;
                    that.objPostService.getPostsDetailByUserIdV1(that.Id, that.PageSize, that.pageNo)
                        .subscribe(res => {
                            {
                                res.Result.Posts.forEach(post => {
                                    var newDate = new Date(post.CreatedDate + 'Z');
                                    post.CreatedDate = newDate;
                                    that.objGetPostSettings.Posts.push(post);
                                    post.Text = Helper.detectAndCreateLinks(post.Text);
                                });
                                setTimeout(() => {
                                    $(".fancyImage").click(function () {

                                        $(this).parent().children("a.fancyImage").each(function () {
                                            $(this).attr("data-fancybox", "image");
                                        });
                                    });

                                    $('[data-fancybox]').fancybox({
                                        "afterClose": function () {

                                            $(".fancyImage").attr("data-fancybox", "");
                                        }
                                    });
                                }, 799)
                                that.scrollLoader = false;
                            }
                        }, this);
                }
            }
        });


    }


    //#region ----CREATE POST POPUP----
    onPostCreated(postObj: PostModel) {

        this.objGetPostSettings.Posts.unshift(postObj);


        this.objUserService.getUserData()
        .subscribe(res => {
            if (res.StatusCode == 200) {
                this.objAccountSetting = res.Result;
                // if (this.objAccountSetting.ProfilePictureUrl != null)
                //     this.objAccountSetting.ProfilePictureUrl += ("?v=" + new Date().getTime());
                // if (this.objAccountSetting.CoverPictureUrl != null)
                //     this.objAccountSetting.CoverPictureUrl += ("?v=" + new Date().getTime());
            }
        });

        //this.isotopeGrid.isotope('reloadItems').isotope();
    }

    onCreatePostPopupOpen() {
        $('html, body').animate({
            scrollTop: 350
        }, 500);

        $('body').css("overflow", "hidden");
        $('body').css("width", "100%");
    }

    onCreatePostPopupClose() {
        $('body').css("overflow","auto");
    }
    //#endregion

    //#region ----DISPLAY POLL----
    votePollOptionClick(pollOption: PollOption) {
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

        if(_checkVoted){
            $('.alert-danger').remove();
            $.notify(
                { message: 'You can vote only once.' },
                { type: 'danger' }
            );

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

    //#region EmojiArea
    addEmoji($event: EmojiEvent, isParent: number){

        if(isParent == 1) this.objCommentText += $event.emoji["native"];
        else this.objChildCommentText += $event.emoji["native"];

    }
    showEmojee(isParent:number){
        if(isParent == 1){
            // let elements: NodeListOf<Element> = document.getElementsByClassName("parent-comment-area");
            let elements = document.getElementsByClassName("parent-comment-area");

            $(elements).next().next().find(".emoji-mart").fadeToggle("200");
            $(elements).toggleClass("act");
        }
        else {
            // let elements: NodeListOf<Element> = document.getElementsByClassName("child-comment-area");
            let elements = document.getElementsByClassName("child-comment-area");

            $(elements).next().next().find(".emoji-mart").fadeToggle("200");
            $(elements).toggleClass("act");
        }

    }
    //#endregion


    /*******************************
     *  display tabs functionality
     * ****************************/

    displayTab(tab){

        if(tab == 'media') this.getMediaPost();

        for(let key in this.tabsOpen){
            if(key == tab){
                this.tabsOpen[key] = true;
            }else this.tabsOpen[key] = false;
        }
    }



    displayProfileTab(profileTab) {

      if(profileTab == 'media') {

        this.tabsOpen.post =  false;
        this.tabsOpen.media = true;
        this.tabsOpen.following = false;
        this.tabsOpen.followers = false;

        this.getMediaPost();
      }

      else if(profileTab == 'posts') {

        this.tabsOpen.post =  true;
        this.objPostService.getPostsDetailByUserId(this.objAccountSetting.Id, this.PageSize, this.pageNo)
        .subscribe(res=>{
            if(res.StatusCode==200) this.objGetPostSettings = res.Result;
        });
      }

      else if(profileTab == 'incidents') {

        this.tabsOpen.post =  true;
        this.objPostService.getIncidentsDetailByUserId(this.objAccountSetting.Id, this.PageSize, this.pageNo)
        .subscribe(res=>{
            if(res.StatusCode==200) this.objGetPostSettings = res.Result;
        });
      }

      else if(profileTab == 'replies') {

        this.tabsOpen.post =  true;
        this.objPostService.getRepliesPostDetailByUserId(this.objAccountSetting.Id, this.PageSize, this.pageNo)
        .subscribe(res=>{
            if(res.StatusCode==200) this.objGetPostSettings=res.Result;
        });
      }

      else if(profileTab == 'likes') {

        this.tabsOpen.post =  true;
        this.objPostService.getLikesPostDetailByUserId(this.objAccountSetting.Id, this.PageSize, this.pageNo)
        .subscribe(res=>{
            if(res.StatusCode==200) this.objGetPostSettings=res.Result;
        });
      }

      for(let key in this.profileTabs){
          if(key == profileTab){
              this.profileTabs[key] = true;
          }else this.profileTabs[key] = false;
      }
  }


    /*********************************
     * get media post functionality
     *********************************/

    getIncidentPosts(){
      this.objPostService.getIncidentsDetailByUserId(this.objAccountSetting.Id, this.PageSize, this.pageNo)
          .subscribe(res=>{
              if(res.StatusCode==200) this.objGetPostSettings = res.Result;
          });
    }

    getMediaPost(){
      this.objUserService.getMediaUserById(this.objAccountSetting.Id)
          .subscribe(res=>{
              if(res.StatusCode==200) this.mediaDetail=res.Result;
          });
    }

    getReplyPosts(){
    }

    getLikePosts(){
    }

}
