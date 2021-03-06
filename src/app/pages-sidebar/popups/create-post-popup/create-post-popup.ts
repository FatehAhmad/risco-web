import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { PostModel, PollOption } from "../../../shared/models/post";
import { ThreadedPostBindingModel } from "../../../shared/models/threaded-posts";
import { GroupsModel } from "../../../shared/models/groups";
import { GroupService } from "../../../shared/services/group.service";
import { PostVisibilityEnum } from "../../../shared/enum/post-visibility-enum";
import { PostService } from "../../../shared/services/post.service";
import { TrendsModel } from "../../../shared/models/tends";
import { environment } from "./../../../../environments/environment";
import { AppComponent } from "../../../app.component";
import { InterestsModel } from "../../../shared/models/interests";
import { Helper, Constants } from "../../../shared/helpers/utilities";
import { MediaTypeEnum } from "../../../shared/enum/media-type-enum";
import { PollTypeEnum } from "../../../shared/enum/poll-type-enum";
import { debug } from "util";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji";
import { Router } from '@angular/router';

declare var $: any;
declare var google: any;

@Component({
  selector: "create-post-popup",
  templateUrl: "./create-post-popup.html",
  styleUrls: ["./create-post-popup.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostPopupComponent implements OnInit {
  @Output() onPostCreated = new EventEmitter<PostModel>();
  @Output() onPopupOpen = new EventEmitter<void>();
  @Output() onPopupClose = new EventEmitter<void>();

  @Input() postPanelClass = "";
  @Input() groupId;
  btnloader: boolean;
  isIncident = false;
  status: boolean = false;

  public threadedPosts = new ThreadedPostBindingModel();

  public postObj = new PostModel();
  public PostService = PostService;
  public MediaTypeEnum = MediaTypeEnum;
  public PollTypeEnum = PollTypeEnum;
  @ViewChild("closeBtn") closeBtn: ElementRef;

  public uploadedImageUrls = [];
  public uploadedVideoUrls = [];
  public postLocationProvided = false;
  public userInterestList: InterestsModel[] = [];
  public allTrendsList: TrendsModel[] = [];
  public isPopupShown = false;
  public postLength = 0;
  public allTextLength = false;

  constructor(
    public appComponent: AppComponent,
    public postService: PostService,
    private router: Router
  ) {
    this.btnloader = false;
  }

  clickEvent() {
    this.status = !this.status;
  }

  toggleDisplay() {
    this.isIncident = !this.isIncident;
    $('div.plusbutton').toggleClass('Responsive-plus');
  }

  //#region ----INITIALIZE----
  ngOnInit(): void {
    // this.setInterests();
    // this.threadedPosts.Posts.push(new PostModel());
    this.getTrends();
    this.initEmojiScript();

    setTimeout(() => {
      this.initMaps();
    }, 3000);
  }

  setInterests() {
    // this.postService.getInterests().subscribe(res => {
    //     if (res.StatusCode == 200) {
    //         this.allInterestList = res.Result;
    //     }
    // });
    this.userInterestList = this.appComponent.loggedInUser.BasketSettings.Interests.filter(
      (x) => x.Checked
    );
  }

  getTrends() {
    this.postService.getTrending().subscribe((res) => {
      if (res.StatusCode == 200) {
        this.allTrendsList = res.Result.Trends;
      }
    });
  }

  setGroupIdOfPost() {
    if (this.groupId) {
      this.postObj.Group_Id = this.groupId;
    }
  }
  //#endregion

  //#region ----POLL----
  pollLengthWeekHours: number = 0;
  pollLengthDayHours: number = 0;
  pollLengthHours: number = 1;
  togglePoll() {
    this.postObj.IsPoll = !this.postObj.IsPoll;
    if (this.postObj.IsPoll) {
      this.postObj.PollOptions.push(new PollOption());
      this.postObj.PollOptions.push(new PollOption());

      this.uploadedImageUrls = [];
      this.uploadedVideoUrls = [];
    } else {
      this.postObj.PollOptions = [];
    }

    this.setPollType();
  }

  onPollImageChange(pollOptionIndex) {
    var target = <HTMLInputElement>event.target;
    if (target.files.length === 1) {
      var file = target.files[0];
      if (file.type.indexOf("image") === -1) {
        $(".alert-danger").remove();
        $.notify({ message: "Please select images only." }, { type: "danger" });
      } else if (file.size > 20971520) {
        $(".alert-danger").remove();
        $.notify(
          { message: "Image size should not exceed 20MB." },
          { type: "danger" }
        );
      } else {
        this.postService.uploadPostMedia(file).subscribe((res) => {
          if (res.StatusCode == 200) {
            this.postObj.PollOptions[pollOptionIndex].MediaUrl = res.Result;
            this.setPollType();
          }
        });
      }
    }
  }

  addPollOption() {
    this.postObj.PollOptions.push(new PollOption());
  }

  removePollOptionOnIndex(index: number) {
    this.postObj.PollOptions = this.postObj.PollOptions.filter(function (
      value,
      indexParam,
      array
    ) {
      return index != indexParam;
    });
    this.setPollType();
  }

  setPollType() {
    if (this.postObj.IsPoll) {
      let doesAnyPollContainMedia =
        this.postObj.PollOptions.findIndex((x) => <any>x.MediaUrl) > -1;
      this.postObj.PollType = doesAnyPollContainMedia
        ? PollTypeEnum.Media
        : PollTypeEnum.Text;
    } else {
      this.postObj.PollType = PollTypeEnum.None;
    }
  }

  removeMediaFromOption(option: PollOption) {
    option.MediaUrl = "";
    this.setPollType();
  }

  pollExpiryTimeChanged() {
    if (!(this.pollLengthWeekHours + this.pollLengthDayHours)) {
      this.pollLengthHours = this.pollLengthHours ? this.pollLengthHours : 1;
    }
  }

  setExpiryHoursOfPoll() {
    if (this.pollLengthDayHours) {
      this.pollLengthHours = this.pollLengthHours + 1;
    }
    if (this.postObj.IsPoll) {
      this.postObj.ExpireAfterHours =
        this.pollLengthHours +
        this.pollLengthDayHours +
        this.pollLengthWeekHours;
    } else {
      this.postObj.ExpireAfterHours = 0;
    }
  }
  //#endregion

  //#region ----LOCATION----
  initMaps() {
    var input = document.getElementById("locationSearchInput");
    var autocomplete = new google.maps.places.Autocomplete(input);
    var that = this;
    autocomplete.addListener("place_changed", function () {
      var place = autocomplete.getPlace();
      that.setLocationValue(place);

      //marker.setVisible(false);
      // if (!place.geometry) {
      //     // User entered the name of a Place that was not suggested and
      //     // pressed the Enter key, or the Place Details request failed.
      //     window.alert("No details available for input: '" + place.name + "'");
      //     return;
      // }

      // var address = '';
      // if (place.address_components) {
      //     address = [
      //         (place.address_components[0] && place.address_components[0].short_name || ''),
      //         (place.address_components[1] && place.address_components[1].short_name || ''),
      //         (place.address_components[2] && place.address_components[2].short_name || '')
      //     ].join(' ');
      // }
      // console.log(address);
    });
  }

  setLocationValue(place = undefined) {
    this.postLocationProvided = place != undefined;
    this.postObj.Location = place ? place.name : undefined; // + ", " + place.formatted_address;
    this.postObj.Latitude = place ? place.geometry.location.lat() : undefined;
    this.postObj.Longitude = place ? place.geometry.location.lng() : undefined;

    this.threadedPosts.Posts.forEach((post) => {
      this.postLocationProvided = place != undefined;
      post.Location = place ? place.name : undefined; // + ", " + place.formatted_address;
      post.Latitude = place ? place.geometry.location.lat() : undefined;
      post.Longitude = place ? place.geometry.location.lng() : undefined;
    });
  }

  getlocation() {
    let that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (suc) => {
          this.postObj.Latitude = suc.coords.latitude;
          this.postObj.Longitude = suc.coords.longitude;
          var latlng;

          latlng = new google.maps.LatLng(
            suc.coords.latitude,
            suc.coords.longitude
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

                      if (
                        component.types[0] === "administrative_area_level_1"
                      ) {
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

                // that.postObj.Location = city;
              }
            }
          });
        },
        (err) => {
          $(".alert-danger").remove();
          $.notify({ message: err.message }, { type: "danger" });
          setTimeout(() => {
            $(".alert-danger").remove();
          }, 1500);
        }
      );
    } else {
      $(".alert-danger").remove();
      $.notify(
        { message: "Geolocation is not supported by this browser." },
        { type: "danger" }
      );
    }
  }
  //#endregion

  //#region ----EMOJI----
  initEmojiScript() {
    var that = this;
    $("#postTextarea").emojioneArea({
      pickerPosition: "bottom",
      autocomplete: true,
      placeholder: "What's new?",
      events: {
        keyup: function (editor, event) {
          that.postObj.Text = this.getText();
        },
        emojibtn_click: function (button, event) {
          that.postObj.Text = this.getText();
        },
        keypress: function (editor, event) {
          var length = this.getText().length;
          if (length >= Constants.PostContentMaxlength) {
            event.preventDefault();
          }
        },
      },
    });
  }

  //#endregion

  //#region ----MEDIA----

  onSelectFile(mediaType: MediaTypeEnum, index: number) {
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
      $.notify({ message: "Please select videos only." }, { type: "danger" });
    } else if (
      mediaType == MediaTypeEnum.Image &&
      files.findIndex((x) => x.size > 3000000) > -1
    ) {
      $(".alert-danger").remove();
      $.notify(
        { message: "Image file should be less than 3MB." },
        { type: "danger" }
      );
    } else if (files.findIndex((x) => x.size > 20971520) > -1) {
      $(".alert-danger").remove();
      $.notify({ message: "No file can exceed 20MB." }, { type: "danger" });
    } else if (files.length + this.threadedPosts.Posts[index].ImageUrlList.length + this.threadedPosts.Posts[index].VideoUrlList.length > 35) {
      $(".alert-danger").remove();
      $.notify(
        { message: "Total file count cannot exceed from 35." },
        { type: "danger" }
      );
    } else {
      for (let file of files) {
        this.postService.uploadPostMedia(file, mediaType).subscribe((res) => {
          if (res.StatusCode == 200) {
            if (mediaType == MediaTypeEnum.Image) {
              this.threadedPosts.Posts[index].ImageUrlList.push(res.Result);
            } else {
              this.threadedPosts.Posts[index].VideoUrlList.push(res.Result);
            }
          }
        });
      }
    }

    $("#uploadpic-create-popup-" + index).val("");
    $("#uploadvdo-create-popup-" + index).val("");
  }

  onRemoveFile(mediaType: MediaTypeEnum, index: number) {
    if (mediaType == MediaTypeEnum.Image) {
      this.threadedPosts.Posts[index].ImageUrlList.splice(index, 1);
    } else {
      this.threadedPosts.Posts[index].VideoUrlList.splice(index, 1);
    }
  }

  triggerClick(elemId) {
    $("#" + elemId).click();
  }
  //#endregion

  //#region ----POPUP ACTIONS----
  openPopup() {
    this.resetPopupData();
    this.setGroupIdOfPost();
    this.onPopupOpen.emit();
    this.isPopupShown = true;
    this.getlocation();
  }

  closePopup() {
    this.isPopupShown = false;
    this.onPopupClose.emit();
  }

  addThreadedPost() {
    this.threadedPosts.Posts.push(new PostModel());
    this.allTextLength = false; //setting this property to false because whenever a new post is added
    //textarea is empty and share button should be disabled

    if (this.postObj.Texts[this.postObj.Texts.length - 1].length != 0) {
      this.postObj.Texts.push("");
      this.toggleShareButton();
    }
  }

  removeThreadedPost(index) {
    this.threadedPosts.Posts.splice(index, 1);
    this.toggleShareButton();
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  postTextChanged(text: string) {
    this.toggleShareButton();
  }

  toggleShareButton() {
    if (
      this.threadedPosts.Posts.every((post) => post.Text.length > 0) &&
      this.threadedPosts.Posts.every((post) => post.Text.length < 280)
    ) {
      this.allTextLength = true;
    } else {
      this.allTextLength = false;
    }
  }

  onTrendSelected() {
    var hashtag = (<HTMLInputElement>event.target).value;
    if (hashtag) {
      hashtag += " ";
      // $("#postTextarea").data("emojioneArea").setText(text);

      this.postObj.Texts.forEach((postText) => {
        postText += " " + hashtag;
      });

      //this.postObj.Text += " " + hashtag;
    }
  }

  createPost() {

    let group_Id = null;

    if (this.router.url.split('/')[1].charAt(0) == 'g') {

      group_Id = this.router.url.split('/')[2];
    }
    let isValid: Boolean = false;

    this.threadedPosts.Posts.forEach((post, index) => {
      //setting risk level to 0 if post is not incident
      if (!this.isIncident) {
        post.RiskLevel = 0;
        post.PostType = 1
      }
      else {
        post.PostType = 2;
      }

      post.Group_Id = group_Id;

      //setting risk level to 0 if post is not incident
      if (this.postObj.IsPoll) {
        post.IsPoll = true;
      }

      post.PollOptions = this.postObj.PollOptions;

      //will probably not be required because I will use the post in threadedPosts array itself for storing the media urls
      post.ImageUrls = post.ImageUrlList.join(",");
      post.VideoUrls = post.VideoUrlList.join(",");

      let iCounter = 0;

      post.PollOptions.forEach(function (currentObject) {
        currentObject.Title = currentObject.Title.trim();
        if (currentObject.Title != "" && currentObject.Title != null) {
          iCounter = iCounter + 1;
        }
      });

      let doesAnyPollContainMedia =
        post.PollOptions.findIndex((x) => <any>x.MediaUrl) > -1;
      let doesAnyPollNotContainMedia =
        post.PollOptions.findIndex((x) => !(<any>x.MediaUrl)) > -1;
      let doesAnyPollNotContainTitle =
        post.PollOptions.findIndex((x) => !(<any>x.Title)) > -1;

      // if (riskLevel == 0 && post.Location == undefined || post.Longitude == undefined || post.Latitude == undefined) {
      //   $('.alert-danger').remove();
      //   $.notify({message: 'Please select a location.' },{type: 'danger' });
      //   setTimeout(()=>{ $('.alert-danger').remove(); },1000)
      //   isValid = false;
      // }

      // if (post.Location == undefined || post.Longitude == undefined || post.Latitude == undefined) {
      // }

      if (
        post.IsPoll &&
        doesAnyPollContainMedia &&
        doesAnyPollNotContainMedia
      ) {
        $(".alert-danger").remove();
        $.notify(
          {
            message: "Please select images for all poll options.",
          },
          {
            type: "danger",
          }
        );
        isValid = false;
      } else if (
        post.IsPoll &&
        doesAnyPollNotContainTitle &&
        (iCounter < 3 || iCounter < 2)
      ) {
        $(".alert-danger").remove();
        $.notify(
          {
            message: "Please provide title for all poll options.",
          },
          {
            type: "danger",
          }
        );
        isValid = false;
      } else {
        isValid = true;
      }
    });

    if (isValid) {
      this.setExpiryHoursOfPoll();
      this.btnloader = true;
      this.postService.createPost(this.threadedPosts).subscribe((response) => {
        if (response.StatusCode == 200) {
          response.Result.Text = Helper.detectAndCreateLinks(
            response.Result.Text
          );
          this.onPostCreated.emit(response.Result);

          //To close post popup after post created successfully - FAR
          this.closeBtn.nativeElement.click();
          $(".alert-danger").remove();
          $.notify(
            { message: "Post created successfully." },
            { type: "success" }
          );
          setTimeout(() => {
            $(".alert-success").remove();
          }, 1000);
          this.btnloader = false;

          //Reset popup modal below
          this.resetPopupData();
        }
      });
    }
  }

  // Commenting this method because it cannot handle multi content
  //new method with multi content functionality written above named createPost
  // onShareClick() {

  //         //will probably not be required because I will use the post in threadedPosts array itself for storing the media urls
  //         this.postObj.ImageUrls = this.postObj.ImageUrlList.join(',');
  //         this.postObj.VideoUrls = this.postObj.VideoUrlList.join(',');

  //         let iCounter = 0;

  //         this.postObj.PollOptions.forEach(function(currentObject){
  //             currentObject.Title = currentObject.Title.trim();
  //             if(currentObject.Title != "" && currentObject.Title != null){
  //                 iCounter = iCounter + 1;
  //             }
  //         });

  //         let doesAnyPollContainMedia = this.postObj.PollOptions.findIndex(x => <any>x.MediaUrl) > -1;
  //         let doesAnyPollNotContainMedia = this.postObj.PollOptions.findIndex(x => !(<any>x.MediaUrl)) > -1;
  //         let doesAnyPollNotContainTitle = this.postObj.PollOptions.findIndex(x => !(<any>x.Title)) > -1;

  //         if (this.postObj.Location == undefined || this.postObj.Longitude == undefined || this.postObj.Latitude == undefined) {
  //             $('.alert-danger').remove();
  //             $.notify({message: 'Please select a location.' },{type: 'danger' });
  //             setTimeout(()=>{ $('.alert-danger').remove(); },1000)
  //         }
  //         else if (this.postObj.IsPoll && doesAnyPollContainMedia && doesAnyPollNotContainMedia) {
  //             $('.alert-danger').remove();
  //             $.notify(
  //                 {
  //                     message: 'Please select images for all poll options.'
  //                 },
  //                 {
  //                     type: 'danger'
  //                 });
  //         }
  //         else if(this.postObj.IsPoll && doesAnyPollNotContainTitle && ( iCounter < 3 || iCounter < 2)){
  //             $('.alert-danger').remove();
  //             $.notify(
  //                 {
  //                     message: 'Please provide title for all poll options.'
  //                 },
  //                 {
  //                     type: 'danger'
  //                 });
  //         }
  //     else {
  //         this.setExpiryHoursOfPoll();

  //         this.postService.updateStatus(this.postObj).subscribe(response => {
  //             if (response.StatusCode == 200) {
  //                 response.Result.Text = Helper.detectAndCreateLinks(response.Result.Text);
  //                 this.onPostCreated.emit(response.Result);

  //                 //To close post popup after post created successfully - FAR
  //                 this.closeBtn.nativeElement.click();
  //                 $('.alert-danger').remove();
  //                 $.notify({message: 'Post created successfully.' },{type: 'success' });
  //                 setTimeout(()=>{ $('.alert-success').remove(); },1000)
  //             }
  //         });
  //     }
  // }
  //#endregion

  resetPopupData() {
    this.postObj.IsPoll = false;
    this.postObj.Visibility == 1;
    this.postObj.RiskLevel == 0;
    this.uploadedImageUrls = [];
    this.uploadedVideoUrls = [];
    this.setLocationValue();

    if (this.threadedPosts.Posts.length > 1) {
      //remove all except the first element in the array
      this.threadedPosts.Posts.splice(1, this.threadedPosts.Posts.length - 1);
    }

    this.threadedPosts.Posts[0].Text = "";

    // this.postObj = new PostModel();
    // this.uploadedImageUrls = [];
    // this.uploadedVideoUrls = [];
    // this.setLocationValue();
    // $("#postTextarea").data("emojioneArea").setText("");
  }

  //#region EmojiArea
  addEmoji($event: EmojiEvent, isParent: number, index: number) {
    if (isParent == 1)
      this.threadedPosts.Posts[index].Text += $event.emoji["native"];
    else this.threadedPosts.Posts[index].Text += $event.emoji["native"];
  }

  showEmojee(isParent: number, index: number) {
    if (isParent == 1) {
      let elements: NodeListOf<Element> = document.getElementsByClassName(
        "parent-comment-area-" + index
      );

      if ($(elements).hasClass("act")) {
        $(elements).next().next().find(".emoji-mart").css("display", "none");
      } else {
        $(elements)
          .next()
          .next()
          .find(".emoji-mart")
          .css("display", "inline-table");
      }

      $(elements).toggleClass("act");
    }
  }
  //#endregion
}
