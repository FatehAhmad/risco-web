import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, ElementRef, NgZone, Input } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { UserModel } from '../../shared/models/userModel';
import { PostService } from '../../shared/services/post.service';
import { PostModel, PollOption } from '../../shared/models/post';
import { GetPostModel } from '../../shared/models/get-post';
import { CommentPostModel } from '../../shared/models/comment-post';
import { UserService } from '../../shared/services/user.service';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { TrendsModel } from '../../shared/models/tends';
import { FollowService } from '../../shared/services/follow.service';
import { ReportModel } from '../../shared/models/report-model';
import { chkModel } from '../../shared/models/chk';
import { GroupDataModel } from '../../shared/models/group-data';
import { GroupService } from '../../shared/services/group.service';
// import { environment } from 'src/environments/environment';
import { environment } from '../../../environments/environment';
import { CreateGroupModel } from '../../shared/models/create-group';
import { FollowingModel } from '../../shared/models/followings';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from '../../shared/services/data-service';
import { MessagingService } from '../../shared/services/push-notifications';
import { debug } from 'util';
import { GeneralSearchModel } from '../../shared/models/general-search';
import { InterestsModel } from '../../shared/models/interests';
import { GroupsModel } from '../../shared/models/groups';
import { PostVisibilityEnum } from '../../shared/enum/post-visibility-enum';
import { AppComponent } from '../../app.component';
import { SidebarTypeEnum } from '../../../app/shared/enum/sidebar-type';
import { MediaTypeEnum } from '../../../app/shared/enum/media-type-enum';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji';
import { PagesSidebarComponent } from '../pages-sidebar.component';
// import { ChildCommentsModel } from '../../shared/models/child-comment';

declare var $: any;
declare var google: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css'],
    providers: [Title],
    encapsulation: ViewEncapsulation.None,

})
export class IndexComponent implements OnInit {

    @ViewChild('inPictureGroup') inPictureGroup;
    @ViewChild('CreateGroupForm') CreateGroupForm;

    public PostVisibilityEnum = PostVisibilityEnum;
    static city: string = "";
    imagesUrls: string = "";
    RiskLevel: string = "";
    fullName: string = "";
    btnloader: boolean;
    Id: number;
    public PostService = PostService;
    PageSize: number;
    pageNo: number;
    loader: boolean;
    PageSizeAllUsers: number;
    pageNoAllUsers: number;
    imageName = [];
    videoName = [];
    urls = [];
    ProfilePictureUrl: string = "";
    text: string = '';
    searchTextCreateGroup: string = "";
    scope: string = "";
    internalPostId: number;
    latitude: number;
    longitude: number;
    city: string;
    facebookLink: string;

    openPopup: Function;
    openPopupComment: Function;
    openPopupChildComment: Function;
    objChildCommentText: string = "";
    public UserService = UserService;
    reportId: any;
    reportVal: any;
    dbImageUrls: any;
    RiskLevelText: string;
    CommentsPicture: string;
    bool: boolean;
    Message: any;
    chk: any;
    imagePath: any;
    groupMembersIdsArray = [];
    groupMembersImageUrlsArray = [];
    checkGroupMembers : boolean = false;
    groupMemberIdsString: string;
    public uploadedImageUrls = [];
    public uploadedVideoUrls = [];
    public commentReplyImageUrls = [];
    public commentReplyVideoUrls = [];

    objUserSettings: UserModel = new UserModel();
    objPostSettings: PostModel = new PostModel();
    objReportModel: ReportModel = new ReportModel();
    objGetPostSettingsById: CommentPostModel = new CommentPostModel();
    objGetPostSettings: GetPostModel = new GetPostModel();
    objCreateGroup: CreateGroupModel = new CreateGroupModel();
    objFollowings: FollowingModel[] = [];
    objFollowers: FollowingModel[] = [];
    isSaveButtonClick: boolean = false;
    hasValue: boolean = false;
    hideAllPostExternalIndex: any;
    hideAllPostInternalIndex: any;
    message;
    objCommentText: string = "";
    objFollowersSearch: FollowingModel[] = [];
    notificationsLength: number;
    objGetGroups: GroupDataModel = new GroupDataModel();
    pageNoFollowings: number;
    PageSizeFollowings: number;
    PageSizeMyGroups: number;
    PageNoMyGroups: number;
    groupId: number;
    PostId: any;
    objSearchModel: GeneralSearchModel = new GeneralSearchModel();
    searchTextGroup: string = "";
    postLocationProvided: boolean = false;
    isotopeGrid;
    public SidebarTypeEnum = SidebarTypeEnum;
    public mediaTypeEnum = MediaTypeEnum;
    public commentTextCheck : boolean = false ;
    public commentChildTextCheck : boolean = false ;
    btnloader1: boolean;
    btnloader2: boolean;
    scrollLoader: boolean;
    @ViewChild("search") public searchElementRef: ElementRef;
    currentDate = new Date();
    postLoaded:boolean;
    constructor( public postService: PostService,public objDataService: DataService, private objRouter: Router, private route: ActivatedRoute, private title: Title,
        private objPostService: PostService, private objUserService: UserService, private objGroupService: GroupService,
        private objFollowService: FollowService, public appComponent: AppComponent, public pagesSidebarComponent: PagesSidebarComponent) {
        this.imagePath = environment.imagePath;
        this.loader = true;
        this.postLoaded = false;
        this.btnloader =  false;
        this.btnloader1 = false;
        this.btnloader2 = false;
    }

    redirect() {

        if (this.objUserService.objUSerModel == null) {
            this.objRouter.navigate(['/signin']);
        }
    }

    popuu() {
        this.shareButtonState();
        this.openPopup(false);
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


    setPopupAction(fn: any) {
        this.objPostSettings.Text = "";
        //console.log('setPopupAction');
        this.openPopup = fn;
    }

    setPopupActionComment(fn: any) {
        this.objCommentText = "";
        //console.log('setPopupAction');
        this.openPopupComment = fn;
    }

    optionsClick() {
        $("#trend").click();
    }

    setTrends(trends) {
        this.objPostSettings.Text += " " + trends.value + " ";
        this.shareButtonState();
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

    createGroup() {

        if(this.groupMembersImageUrlsArray.length == 0){
            this.checkGroupMembers = true ;
        }else this.checkGroupMembers = false;

        if (!this.CreateGroupForm.valid || this.groupMembersImageUrlsArray.length == 0) {
            this.isSaveButtonClick = true;
            this.hasValue = true;
            return;
        }

        this.isSaveButtonClick = false;
        this.hasValue = false;
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

    search() {
        if (this.searchTextCreateGroup == "") {
            $('.autocomplete_pnl').fadeOut();
            return;
        }
        ;
        this.objGroupService.searchFollowersCreeateGroup(this.searchTextCreateGroup)
            .subscribe(res => {
                //   $('.field .autocomplete_pnl').fadeIn();
                let loggedInUser = LoggedInUser.getLoggedInUser();
                if(res.Result && res.Result.length){
                    for(let i = 0; i < res.Result.length ; i++ ){
                        if(loggedInUser['Id'] == res.Result[i]['FirstUser_Id']){
                            res.Result.splice(i , 1);
                            break;
                        }
                    }
                }
                this.objFollowersSearch = res.Result;
            })
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

    groupInterestClick() {
        $("#int1").click();
        // $('.add_people_pnl .list li').on('click', function () {
        //     $(this).toggleClass('selected');
        // });
    }

    remainingImages(id) {
        var className = ".galleryImages" + id + ":first";
        $(className).click();
    }

    // removeImage(i) {
    //     this.imageName.splice(i, 1);
    //     this.shareButtonState();
    // }

    // removeVideo(v) {
    //     this.videoName.splice(v, 1);
    //     this.shareButtonState();
    // }

    userProfileRedirect(Id) {
        $("#postdetail").attr("data-fancybox-close", "");
        $("#postdetail").click();

        if (Id == this.objUserSettings.Id)
            this.objRouter.navigate(["/profile"]);
        else
            this.objRouter.navigate(["/user-profile/" + Id]);
    }


    // onSelectVideo(event) {

    //     // let files = event.target.files;

    //     //   var ext = files[files.length-1].name.split('.').pop();
    //     //   if (ext != "mp4" && ext != "3gp" && ext != "flv" && ext !="mpeg" && ext !="ogg") {
    //     //     alert("please upload video")
    //     //     return;
    //     //   }

    //     if (event.target.files.length > 0) {
    //         $('.custBtn').removeAttr("disabled");
    //     }
    //     let fileBrowser = this.inVideo.nativeElement;
    //     let file;

    //     for (let i = 0; i < fileBrowser.files.length; i++) {
    //         file = fileBrowser.files[i];


    //         this.objPostService.updatePostVideo(file)
    //             .subscribe(

    //                 res => {
    //                     if (res.StatusCode == 200) {

    //                         var encodedVideo = escape(res.Result);
    //                         encodedVideo += ("?v=" + new Date().getTime());;
    //                         this.videoName.push(encodedVideo);
    //                         $("#uploadvdo").val('');
    //                         $(".fancyImage").click(function () {
    //                             $(this).parent().children("a.fancyImage").each(function () {
    //                                 $(this).attr("data-fancybox", "image");
    //                             });
    //                         });

    //                         $('[data-fancybox]').fancybox({
    //                             touch: false,
    //                             "afterClose": function () {
    //                                 $(".fancyImage").attr("data-fancybox", "");
    //                             }
    //                         });

    //                     }
    //                 }
    //             );
    //     }

    // }


    // getLocation() {
    //     var that = this;
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             var latlng;
    //             that.latitude = position.coords.latitude;
    //             that.longitude = position.coords.longitude;

    //             latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    //             new google.maps.Geocoder().geocode({ 'latLng': latlng }, function (results, status) {
    //                 if (status == google.maps.GeocoderStatus.OK) {
    //                     if (results[1]) {
    //                         var country = null, countryCode = null, city = null, cityAlt = null;
    //                         var c, lc, component;
    //                         for (var r = 0, rl = results.length; r < rl; r += 1) {
    //                             var result = results[r];

    //                             if (!city && result.types[0] === 'locality') {
    //                                 for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
    //                                     component = result.address_components[c];

    //                                     if (component.types[0] === 'locality') {
    //                                         city = component.long_name;
    //                                         break;
    //                                     }
    //                                 }
    //                             }
    //                             else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
    //                                 for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
    //                                     component = result.address_components[c];

    //                                     if (component.types[0] === 'administrative_area_level_1') {
    //                                         cityAlt = component.long_name;
    //                                         break;
    //                                     }
    //                                 }
    //                             } else if (!country && result.types[0] === 'country') {
    //                                 country = result.address_components[0].long_name;
    //                                 countryCode = result.address_components[0].short_name;
    //                             }

    //                             if (city && country) {
    //                                 break;
    //                             }
    //                         }

    //                         //console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
    //                         // that.objPostSettings.Location = city;
    //                         that.city = city;
    //                         that.latitude = position.coords.latitude;
    //                         that.longitude = position.coords.longitude;
    //                         // that.objPostSettings.Latitude=position.coords.latitude;
    //                         // that.objPostSettings.Longitude=position.coords.longitude;
    //                         // IndexComponent.city = city;
    //                         //  document.getElementById('cityAlt').innerHTML = cityAlt;
    //                         //  document.getElementById('country').innerHTML = country;
    //                         //  document.getElementById('countryCode').innerHTML = countryCode;
    //                     }
    //                 }
    //             });
    //         });
    //     }
    // }

    setRiskLevel(riskLevel) {

        if (riskLevel == 1)
            this.RiskLevelText = "High";
        else if (riskLevel == 2)
            this.RiskLevelText = "Medium";
        else if (riskLevel == 3)
            this.RiskLevelText = "Low";
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

    // onFileChangee(event) {

    //     let files = event.target.files;

    //     var ext = files[files.length - 1].name.split('.').pop();
    //     if (ext == "jpg" || ext == "png" || ext == "jpeg") {

    //         var reader = new FileReader();
    //         var that = this;
    //         reader.onload = function (e) {
    //             $('.postImage').attr('src', (<any>e.target).result);

    //             let fileBrowser = that.inPicturee.nativeElement;
    //             let file = fileBrowser.files[0];

    //         }
    //         reader.readAsDataURL(files[files.length - 1]);
    //     }
    // }

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

    deletePost(index) {
        if (this.scope == "external") {
            var postId = this.objGetPostSettings.Posts[index].Id;
            this.objPostService.deletePost(postId)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Id != postId);
                        this.isotopeGrid.isotope('reloadItems').isotope();
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
                        this.isotopeGrid.isotope('reloadItems').isotope();
                    }
                });
        }
    }

    commentClicked(parentPostId, id, e) {

      debugger

      //if undefined then this post is itself a parent
      if (parentPostId == undefined) {

        this.commentTextCheck = false;
        var post = this.objGetPostSettings.Posts.filter(x => x.Id == id)[0];
        if (!post.IsPoll)
            this.getPostById(post.Id);
      }
      else {

        this.commentTextCheck = false;
        var post = this.objGetPostSettings.Posts.filter(x => x.Id == parentPostId)[0].ExtendedPostList.filter(x => x.Id == id)[0];
        if (!post.IsPoll)
            this.getPostById(post.Id);
      }

    }


    closeEmojiPopup() {

      // if (isParent == 1) {
      //   let elements: NodeListOf<Element> = document.getElementsByClassName(
      //     "parent-comment-area-" + index
      //   );

      //   if ($(elements).hasClass("act")) {
      //     $(elements).next().next().find(".emoji-mart").css("display", "none");
      //   } else {
      //     $(elements)
      //       .next()
      //       .next()
      //       .find(".emoji-mart")
      //       .css("display", "inline-table");
      //   }

      //   $(elements).toggleClass("act");
      // }


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

    openPostPopup(postId) {
        let _this = this;
        let __this = this;
        this.getPostById(postId, () => {

            //$('#postdetail').fancybox().trigger('click');
            $.fancybox.open({
                src: '#postdetail',
                touch: false,
                "afterClose": function () {
                    $.fancybox.destroy();
                    //$(".fancyImage").attr("data-fancybox", "");
                    $('.postdetail .field').removeClass('act');
                    _this.onRemoveFile(__this.mediaTypeEnum.Image, 0);
                    __this.onRemoveFile(__this.mediaTypeEnum.Video, 0);
                    __this.objCommentText = "";
                    __this.objChildCommentText = "";
                    $(".emoji-mart").fadeOut("200");
                    $(".parent-comment-area").removeClass('act')
                    $(".child-comment-area").removeClass('act')
                }
            });

        });
    }

    redirectToPostDetail(postId) {

      this.objRouter.navigate(["/post-detail/" + postId]);
    }

    postComment(text) {
        this.commentTextCheck =false;
        if(!text){
            this.commentTextCheck = true
            return false;
        }else{
            this.commentTextCheck = false;
            this.btnloader1 = true;
            this.objPostService.postComment(text, this.objGetPostSettingsById.Id, 0, this.uploadedImageUrls[0], this.uploadedVideoUrls[0])
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    res.Result.User = this.objUserSettings;
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


    }

    onkeyUp($event, text) {
        if ($event.key == "Enter") {
            this.postComment(text.value);
        }
    }

    replyComment(id, text) {
        this.commentChildTextCheck = false;
        if(!text){
            this.commentChildTextCheck = true
            return false;
        }else{
            this.commentChildTextCheck = false;
            this.btnloader2 = true;
            this.objPostService.commentReply(text, this.objGetPostSettingsById.Id, id, this.commentReplyImageUrls[0], this.commentReplyVideoUrls[0])
            .subscribe(res => {
                if (res.StatusCode == 200) {

                    res.Result.User = this.objUserSettings;
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
            });
        }


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

    refresh() {
        window.location.reload();
    }


    hidePostById(i) {
        this.objPostService.hidePostById(this.objGetPostSettings.Posts[i].Id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    // $("#hide_single_post").css("display", "block");

                    // window.location.reload()
                }
            });
    }

    hidePostByIdInternal(id) {
        this.objPostService.hidePostById(id)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    // window.location.reload()
                }
            });
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
            obj.IsToggled = false;
        }
    }

    repostClicked(e) {

        e.stopPropagation();
        $(event.target).parent().next().toggleClass('show');
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

    follow(i) {
        var userId = this.objGetPostSettings.Posts[i].User.Id;
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

    reportPost() {
        this.objPostService.reportPost(this.reportId, this.reportVal, this.objReportModel.Text)
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    $("#reportText").val("");
                    this.objReportModel.Text = "";
                }
            })

    }

    shareButtonState() {
        if (this.imageName.length < 1) {
            if (this.objPostSettings.Text != undefined && this.objPostSettings.Text.trim() == "") {
                $(".custBtn").attr("disabled", true)
            }
            else
                $('.custBtn').removeAttr("disabled");
        }
        else
            $('.custBtn').removeAttr("disabled");


    }

    selectGroupMembers(groupMemberIds, imageUrls , index) {

        for(let i = 0 ; i < this.objFollowers.length;i++){
            if(this.objFollowers[i]['FirstUser_Id'] == groupMemberIds){
                this.objFollowers[i]['isChecked'] =  !this.objFollowers[i]['isChecked'];
                break;
            }
        }

        //
        // this.groupMembersImageUrlsArray.length=this.groupMembersImageUrlsArray.length+1;
        let isFound = false;
        // console.log(this.groupMembersImageUrlsArray.length);

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



        // /* Status Update */
        // $('.post-panel').on('click', function () {
        //     $(this).find('.update_status').fadeIn();
        //     $('.overlay-bg').addClass('show');
        //     $('body').css("position", "fixed");
        //     $('body').css("width", "100%");
        // });

        // /* Post Detail Comment */
        // $('.user-comment .field').on('click', function (e) {
        //     e.stopPropagation();
        //     $(this).addClass('act');
        //     $('.user-comment small').show();
        //     $('.attach-list').show();
        //     $('.user-comment .field span').addClass('showIcon');
        //     $('.user-comment .field .sent_btn').addClass('showIcon');
        // });

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



        // $('body').delegate('.shareBtn', 'click', function () {
        //     $('.update_status').fadeOut();
        //     $('body').css("position", "static");
        //     $('.overlay-bg').removeClass('show');
        // });


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




    ngOnInit() {
        this.pageNoFollowings = 0;
        this.PageSizeFollowings = 1000;
        var user = LoggedInUser.getLoggedInUser();
        this.currentDate = new Date();
        if (user) {
            this.redirect();
            this.PageSize = 10;
            this.pageNo = 0;
            this.PageSizeAllUsers = 10;
            this.pageNoAllUsers = 0;
            this.initializeScripts();
            this.fullName = user.FullName;
            this.Id = user.Id;
            this.ProfilePictureUrl = user.ProfilePictureUrl;
            //custom title
            this.title.setTitle('Risco');
            Helper.setBodyClass("home-page");

            //this.getLocation();

            this.objUserService.getUserData()
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        this.objUserSettings = res.Result;
                    }
                });

            this.objPostService.getPosts(this.PageSize, this.pageNo)
                .subscribe(res => {
                    {
                        if (res.StatusCode == 200) {
                            this.postLoaded=true;
                            this.objGetPostSettings = res.Result;


                            for (var i = 0; i < this.objGetPostSettings.Posts.length; i++) {
                                var newDate = new Date(this.objGetPostSettings.Posts[i].CreatedDate + 'Z');
                                if(this.objGetPostSettings.Posts[i]['PollExpiryTime']){
                                    this.objGetPostSettings.Posts[i]['PollExpiryTime'] = new Date(this.objGetPostSettings.Posts[i]['PollExpiryTime']+'Z');
                                }
                                this.objGetPostSettings.Posts[i].CreatedDate = newDate;
                                this.objGetPostSettings.Posts[i].Text = Helper.detectAndCreateLinks(this.objGetPostSettings.Posts[i].Text);
                                this.objGetPostSettings.Posts[i].IsToggled = false;
                            }
                            // this.objGetPostSettings.Posts = this.objGetPostSettings.Posts.filter(x => x.Latitude && x.Longitude);
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
                    }
                });

            this.objFollowService.getFollowings("", this.pageNoFollowings, this.PageSizeFollowings)
                .subscribe(res => {
                    if (res.StatusCode == 200) {
                        this.objFollowings = res.Result;
                    }
                });


            this.objUserService.getAllUsers(this.PageSizeAllUsers, this.pageNoAllUsers)
            .subscribe(res => {
                    if (res.StatusCode == 200) {

                        let userDetail = LoggedInUser.getLoggedInUser();
                        console.log(userDetail)
                        this.objFollowers = res.Result;
                        if(this.objFollowers && this.objFollowers.length){
                            for(let i = 0 ; i < this.objFollowers.length ; i++){
                                if(this.objFollowers[i]['FirstUser']['Id'] == userDetail['id']){
                                    this.objFollowers.splice(i,1);
                                    break;
                                }
                            }
                            for(let i = 0 ; i < this.objFollowers.length ; i++){
                                this.objFollowers[i]['isChecked'] = false;
                            }
                            console.log(this.objFollowers);
                        }

                    }
                    $('.lds-roller').addClass('showIcon');
                    this.loader = false;
                });


            this.appComponent.eventWhenShareComplete.subscribe((postedObj) => {
                postedObj.CreatedDate = new Date(postedObj.CreatedDate + 'Z');
                postedObj.Text = Helper.detectAndCreateLinks(postedObj.Text);


                this.objGetPostSettings.Posts.push(postedObj);
            });

            var that = this;
            $(
                function ($) {
                    $('.add_people_pnl .list').bind('scroll', function () {
                        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                            that.pageNoAllUsers++;
                            that.objUserService.getAllUsers(that.PageSizeAllUsers, that.pageNoAllUsers)
                                .subscribe(res => {

                                    if (res.StatusCode == 200) {
                                        res.Result.forEach(flowr => {
                                            that.objFollowers.push(flowr);
                                        });
                                        that.findLoggedInUser()
                                    }
                                });
                                this.loader = false;

                        }
                    })
                }
            );




            var that = this;
            $(window).scroll(function () {

                if (that.objRouter.url == "/index") {
                    if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {

                        that.pageNo++;
                        that.scrollLoader = true;
                        that.objPostService.getPostsV1(that.PageSize, that.pageNo)
                            .subscribe(res => {
                                {
                                    that.scrollLoader = false;

                                    if (res.StatusCode == 200) {

                                        res.Result.Posts.forEach(post => {
                                            if (post.Latitude && post.Longitude) {
                                                var newDate = new Date(post.CreatedDate + 'Z');
                                                post.CreatedDate = newDate;
                                                if(post && post['PollExpiryTime']){
                                                    post['PollExpiryTime'] = new Date(post['PollExpiryTime']+'Z');
                                                }
                                                that.objGetPostSettings.Posts.push(post);
                                                post.Text = Helper.detectAndCreateLinks(post.Text);
                                            }
                                        });


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

                                            that.isotopeGrid.isotope('reloadItems').isotope();
                                        }, 100)
                                    }
                                }
                            });

                    }
                }


            });

            var postIdInStorageStr = localStorage.getItem("postId");
            if (postIdInStorageStr) {
                var postIdInStorage = parseInt(postIdInStorageStr);

                this.openPostPopup(postIdInStorage);
                localStorage.removeItem("postId");
            }

            // this.route.params.subscribe(params => {
            //     var postId = params["postId"];
            //     if (postId) {
            //         this.openPostPopup(postId);
            //     }
            // });

        }
    }

    //#region ----CREATE POST POPUP----
    // onPostCreated(postObj: PostModel) {

    //     if(postObj['PollExpiryTime']){
    //         postObj['PollExpiryTime'] = new Date(postObj['PollExpiryTime']);
    //     }
    //     this.objGetPostSettings.Posts.unshift(postObj);
    //     this.isotopeGrid.isotope('reloadItems').isotope();
    // }

    onPostCreated(postObj: PostModel) {

        this.objGetPostSettings.Posts.unshift(postObj);
        //this.isotopeGrid.isotope('reloadItems').isotope();
    }


    onCreatePostPopupOpen() {
        $('body').css("position", "fixed");
        $('body').css("width", "100%");
    }

    onCreatePostPopupClose() {
        $('body').css("position", "static");
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

    findLoggedInUser(){
        let loggedInUser = LoggedInUser.getLoggedInUser();
        if(this.objFollowers.length){
            for(let i = 0 ; i < this.objFollowers.length ; i++ ){
                if(loggedInUser['Id'] == this.objFollowers[i]['FirstUser_Id']){
                    this.objFollowers.splice(i,1);
                    console.log('deleted user');
                }
            }
        }

    }
}
