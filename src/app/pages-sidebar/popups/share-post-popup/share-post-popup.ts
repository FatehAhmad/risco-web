import { Component, OnInit, ViewEncapsulation, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PostModel } from '../../../shared/models/post';
import { GroupsModel } from '../../../shared/models/groups';
import { GroupService } from '../../../shared/services/group.service';
import { PostVisibilityEnum } from '../../../shared/enum/post-visibility-enum';
import { PostService } from '../../../shared/services/post.service';
import { TrendsModel } from '../../../shared/models/tends';
import { environment } from './../../../../environments/environment';
import { LoggedInUser } from 'src/app/shared/classes/loggedInUser';
import { AppComponent } from '../../../app.component';
import { MediaTypeEnum } from '../../../shared/enum/media-type-enum';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji';
import { Helper } from 'src/app/shared/helpers/utilities';
import { GetPostModel } from 'src/app/shared/models/get-post';
import { getHeapStatistics } from 'v8';
import { debug } from 'util';

declare var $: any;
declare var google: any;

@Component({
    selector: 'share-post-popup',
    templateUrl: './share-post-popup.html',
    styleUrls: ['./share-post-popup.css'],
    encapsulation: ViewEncapsulation.None,

})
export class SharePostPopupComponent implements OnInit, OnChanges {
    @Input() postInput: PostModel;
    @Output() onComplete = new EventEmitter<PostModel>();

    public PostVisibilityEnum = PostVisibilityEnum;
    public sharePostObj: PostModel;
    public searchedGroups: GroupsModel[] = [];
    public groupSearchText = "";
    public sharePostInGroup = false;
    public trendList: TrendsModel[] = [];
    public imagePath="";

    @ViewChild('closeBtn') closeBtn: ElementRef;
    btnloader: boolean;
    public uploadedImageUrls = [];
    public uploadedVideoUrls = [];
    public mediaTypeEnum = MediaTypeEnum;
    public PostService = PostService;
    _selectedGroup = {
        id : 0
    }
    openPopup: Function;
    openPopupComment: Function;
    openPopupChildComment: Function;
    objChildCommentText: string = "";
    objGetPostSettings: GetPostModel = new GetPostModel();
    isotopeGrid;
    showposition:any;

    constructor(private groupService: GroupService, private postService: PostService,
        public appComponent: AppComponent) {
        this.sharePostObj = new PostModel();
        this.sharePostObj.SharedParent = new PostModel();
        this.imagePath = environment.imagePath;
        this.btnloader = false;
    }

     //#region 
     onFileSelection(mediaType: MediaTypeEnum) {
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
                            this.onRemoveFile(this.mediaTypeEnum.Image,0); 
                            this.uploadedImageUrls.push(res.Result);
                        }
                        else {
                            this.onRemoveFile(this.mediaTypeEnum.Video, 0);
                            this.uploadedVideoUrls.push(res.Result);
                        }

                    }
                });
            }
        }

        $("#uploadpicCmnt-sp").val('');
        $("#uploadvdoCmnt-sp").val('');
    }

    onRemoveFile(mediaType: MediaTypeEnum, index: number) {
        if (mediaType == MediaTypeEnum.Image) {
            this.uploadedImageUrls.splice(index, 1);
        } else {
            this.uploadedVideoUrls.splice(index, 1);
        }
    }

    triggerClick(elemId) {
        $("#" + elemId).click();
    }
    //#endregion


    ngOnInit(): void {
        
        if (LoggedInUser.getLoggedInUser() != null && LoggedInUser.getLoggedInUser() != undefined) {
            this.getTrends();
            this.searchGroupInputChanged();
        }

        $('#parent-img-sp').click(function (e) {
            $('#uploadpicCmnt-sp').click();
        });

        $('#parent-vdo-sp').click(function (e) {
            $('#uploadvdoCmnt-sp').click();
        });
        
        this.isotopeGrid = $('.grid').isotope({
            layoutMode: 'packery',
            itemSelector: '.grid-item',
            packery: {
                gutter: 0
            }
        });

    }

    ngOnChanges(changes: SimpleChanges): void {
        var post = changes.postInput.currentValue;
        if (post) {
            this.openSharePopup(post);
        }
    }

    getTrends() {

        this.postService.getTrending()
            .subscribe(res => {
                if (res.StatusCode == 200) {
                    this.trendList = res.Result.Trends;
                }
            });
    }

    openSharePopup(objPost: PostModel) {
        this.sharePostObj = new PostModel();
        this.sharePostObj.SharedParent = objPost;
        
        this.sharePostObj.SharePost_Id = objPost.Id;
        // this.sharePostObj.Latitude = objPost.Latitude;
        // this.sharePostObj.Longitude = objPost.Longitude;
        // this.sharePostObj.Location = objPost.Location;
        this.getlocation();

        var that = this;
        $.fancybox.open({
            src: '#share_popup',
            touch: false,
            "afterClose": function () {
               // $.fancybox.destroy();
                that.destroy();
            }
        });
    }

    hideGroupSearchAutocomplete() {
        $('.autocomplete_pnl_overlay').hide();
        $('.autocomplete_pnl_share_group').fadeOut();
    }

    showGroupSearchAutocomplete() {
        $('.autocomplete_pnl_overlay').show();
        $('.autocomplete_pnl_share_group').fadeIn();
    }

    searchGroupInputChanged() {
        if (!this.groupSearchText) {
            this.groupService.getGroups(6,0).subscribe((response) => {
                if (response.StatusCode === 200) {
                    //this.searchedGroups = response.Result.SuggestedGroups;
                    this.searchedGroups = response.Result.MyGroups;
                    //this.showGroupSearchAutocomplete();
                }
            });
        }
    }

    groupSelectedFromDropdown(group: GroupsModel) {
        this.hideGroupSearchAutocomplete();
        if (group) {
            this.sharePostObj.Group_Id = group.Id;
            this.groupSearchText = group.Name;
        }
    }
    
    onGroupSelect(){
        if(this._selectedGroup.id > 0){
            this.sharePostObj.Group_Id = this._selectedGroup.id;
        }
    }

    copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        (<any>el).style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }

    copyPostUrlToClipboard(postId) {
        var postUrl = location.origin + "/%23/post/" + postId;
        this.copyStringToClipboard(postUrl);
    }

    shareDestinationChanged(sharePostInGroup) {
        this.sharePostInGroup = sharePostInGroup;
        if (sharePostInGroup) {
            this.sharePostObj.Visibility = PostVisibilityEnum.Public;
        }
        else {
            this.groupSearchText = "";
            this.sharePostObj.Group_Id = undefined;
        }
    }


    getlocation() {
        let that = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( suc =>{
                this.sharePostObj.Latitude = suc.coords.latitude;
                this.sharePostObj.Longitude = suc.coords.longitude;
                var latlng;

                latlng = new google.maps.LatLng(suc.coords.latitude, suc.coords.longitude);

                new google.maps.Geocoder().geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var country = null, countryCode = null, city = null, cityAlt = null;
                            var c, lc, component;
                            for (var r = 0, rl = results.length; r < rl; r += 1) {
                                var result = results[r];

                                if (!city && result.types[0] === 'locality') {
                                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                        component = result.address_components[c];

                                        if (component.types[0] === 'locality') {
                                            city = component.long_name;
                                            break;
                                        }
                                    }
                                }
                                else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                        component = result.address_components[c];

                                        if (component.types[0] === 'administrative_area_level_1') {
                                            cityAlt = component.long_name;
                                            break;
                                        }
                                    }
                                } else if (!country && result.types[0] === 'country') {
                                    country = result.address_components[0].long_name;
                                    countryCode = result.address_components[0].short_name;
                                }

                                if (city && country) {
                                    break;
                                }
                            }

                            that.sharePostObj.Location = city;
                        }
                    }
                });

            }, err=>{
                $('.alert-danger').remove();
                $.notify(
                    { message: err.message },
                    { type: 'danger' }
                );
            });
        } else {
            $('.alert-danger').remove();
            $.notify(
                { message: 'Geolocation is not supported by this browser.' },
                { type: 'danger' }
            );
        } 
    }

    sharePostClick() {
        this.btnloader =  true;
        this.postService.rePost(this.sharePostObj).subscribe((response)=> {
            if(response.StatusCode === 200){

                //To close post popup after post created successfully - FAR
                this.closeBtn.nativeElement.click();
                $('.alert-danger').remove();
                $.notify({message: 'Post shared successfully.' },{type: 'success' });
                setTimeout(()=>{ $('.alert-success').remove(); },1000)
                
                this.destroy(response.Result);
            }
            this.btnloader =  false;
        });
    }

    closePopupClick() {
        this.sharePostObj.Text = "";
        $(".emoji-mart").fadeOut("200"); 
        $(".parent-comment-area").removeClass('act')
        $(".child-comment-area").removeClass('act')
        this.destroy();

    }

    destroy(postedModel: PostModel = undefined) {
        $.fancybox.close();
        this.onComplete.emit(postedModel);
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
        this.sharePostObj.Text = "";
        //console.log('setPopupAction');
        this.openPopup = fn;
    }

    setPopupActionComment(fn: any) {
        this.sharePostObj.Text = "";
        //console.log('setPopupAction');
        this.openPopupComment = fn;
    }

    //#region EmojiArea
    addEmoji($event: EmojiEvent, isParent: number){
        
        if(isParent == 1) this.sharePostObj.Text += $event.emoji["native"];

    }
    showEmojee(isParent:number){
        if(isParent == 1){
            let elements: NodeListOf<Element> = document.getElementsByClassName("parent-comment-area");
            
            if($(elements).hasClass('act')){
                $(elements).next().next().find(".emoji-mart").css("display", "none");
            } else { $(elements).next().next().find(".emoji-mart").css("display", "inline-table"); }
            
            $(elements).toggleClass("act");
        }
    }
    //#endregion 

    onTrendState(value){
        this.sharePostObj.Text += " " + value;
    }

}
