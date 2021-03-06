import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PostService } from './shared/services/post.service';
import { MessagingService } from './shared/services/push-notifications';
import { LoggedInUser } from './shared/classes/loggedInUser';
import { environment } from '../environments/environment';
import { PostModel } from './shared/models/post';
import { UserModel } from './shared/models/userModel';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  public href: string = "";
  anio: number = new Date().getFullYear();
  public PostService = PostService;
  public url = window.location.href;
  public isVerification: boolean = false;
  static isChatInitialized: boolean = false;
  public imagePath = "";
  isotopeGrid: any;
  constructor(private router: Router, private route: ActivatedRoute, ) {
      router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        if (val.url == "/verification") {
          this.isVerification = true;
        }
        else {
          this.isVerification = false;
        }

        this.checkAndSetLoggedInUser();
      }
    });

    this.imagePath = environment.imagePath;
  }

  // mobiledetection() {

  //   var ua = navigator.userAgent;

  //   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
  //     window.location.href = 'http://riscomobile.ingicweb.com';

  // }

  open() {
    window.open("http://localhost:4200/#/contact", "_blank");
  }

  ngOnInit() {
    // this.mobiledetection();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        var user = LoggedInUser.getLoggedInUser();
        if (val.url.indexOf("/signup") === -1 && val.url.indexOf("/forgetpassword") === -1 && val.url.indexOf("/post") === -1 && val.url.indexOf("/terms-and-conditions") === -1 && val.url.indexOf("/contact") === -1 && val.url.indexOf("/about") === -1 && val.url.indexOf("/reset-password") === -1 && val.url.indexOf("/verification") === -1 && val.url.indexOf("/topics") === -1 && !user) {

          this.router.navigate(["signin"]);
        }
        //this.initChat();
      }
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

    });

    // this.messageService.initFirebaseAndGetPermission();
    // this.initMap();
  }

  public loggedInUser: UserModel;
  checkAndSetLoggedInUser(){
    var user = LoggedInUser.getLoggedInUser();
    if(user){
      this.loggedInUser = user;
    }
  }

  //#region ----CHAT----
  initChat() {
    var user = LoggedInUser.getLoggedInUser();
    if (user && !AppComponent.isChatInitialized) {
      $("#chatContainer").IngicChatInit({
        appIconPath: "favicon.ico",
        defaultUserImage: "assets/images/user-img.png",
        defaultAttachmentImage: "assets/images/attachment-img.png",
        loaderSelector: ".loaderWrapper2",

        appName: "Risco",
        apiUrl: "https://riscochat.stagingic.com/node/api/",
        socketBaseUrl: "https://riscochat.stagingic.com",
        socketPath: "/node/socket.io",

        selectedUsernameClickCallback: (userId) => {
          this.router.navigate(["user-profile", userId]);
        },
        selectedImageClickCallback: (userId) => {
          this.router.navigate(["user-profile", userId]);
        },
        selectedUsernameSelector: ".selectedUsername",
        selectedUserImageSelector: ".selectedUserImage",

        messageListContainerSelector: ".msg_container",
        messageTextSelector: ".messageText",
        messageTimeSelector: ".messageTime",
        messageUsernameSelector: ".messageUsername",
        messageUserImageSelector: ".messageUserImage",
        messageEmojiPopupBtnSelector: ".messageEmojiPopupBtn",

        uploadAttachmentContainerSelector: ".uploadAttachmentContainer",
        uploadAttachmentBtnSelector: ".uploadAttachmentBtn",

        attachmentUrlSelector: ".attachmentUrl",
        attachmentImageSelector: ".attachmentImage",
        attachmentCloseBtnSelector: ".remove_thumb",

        viewAttachmentContainerSelector: ".viewAttachmentContainer",

        messageTextInputSelector: ".messageTextInput",
        userTypingSelector: ".userTyping",
        sendMessageBtnSelector: ".sendMessageBtn",

        friendListContainerSelector: ".friendList",
        friendNameSelector: ".friendName",
        friendImageSelector: ".friendImage",
        friendLastMsgDateTimeSelector: ".friendLastMsgDateTime",
        friendLastMsgTextSelector: ".friendLastMsgText",
        friendOnlineSelector: ".onlineDot",
        friendSelectedClassName: "selected",

        sentMessageHtml: `
          <div class="convo-row clearfix">
            <figure class="user-img messageUserImage backgroundImg"></figure>
            <div class="convo-txt">
              <p class="messageUsername" style="display:none;"></p>
              <p class="messageText"></p>
              <div class="viewAttachmentContainer"></div>
              <span class="time messageTime"></span>
            </div>
          </div>`,
        receivedMessageHtml: `
          <div class="convo-row clearfix recived">
            <figure class="user-img messageUserImage backgroundImg"></figure>
            <div class="convo-txt">
              <p class="messageUsername" style="display:none;"></p>
              <p class="messageText"></p>
              <div class="viewAttachmentContainer"></div>
              <span class="time messageTime"></span>
            </div>
          </div>`,
        friendlistItemHtml: `
          <li class="clearfix">
            <figure class="user-img friendImage backgroundImg">
              <img src="/assets/images/greenDot.png" class="onlineDot" style="height: 18px;position: relative;bottom: -28px;right: -31px;filter: drop-shadow(0px 0px 19px #000);display: none;"/>
            </figure>
            <div class="content">
              <h3 class="friendName"></h3>
              <span class="friendLastMsgDateTime"></span>
              <p class="multiline-tancate friendLastMsgText"></p>
            </div>
          </li>`,

        uploadAttachmentHtml: `
        <div class="img-wrap">
          <span class="icon-close2 remove_thumb"></span>
          <a class="attachmentUrl">
            <figure class="attachmentImage backgroundImg" ></figure>
          </a>
        </div>
        `,

        viewAttachmentHtml: `<span><a class="thumb attachmentUrl attachmentImage backgroundImg"></a></span>`,

        user: {
          id: user.Id,
          name: user.FullName,
          createdAt: new Date().toISOString(), //datetime
          email: user.Email,
          image: environment.imagePath + user.ProfilePictureUrl,
          password: "**********",
          token: user.Token.access_token,
          updateAt: new Date().toISOString(),
        }
      });

      AppComponent.isChatInitialized = true;
    }

  }

  static destroyChat() {
    AppComponent.isChatInitialized = false;
    $("#chatContainer").IngicChatDestroy();
  }
  //#endregion
  //#region ----POST SHARE(REPOST)----
  sharePostObject: PostModel;
  eventWhenShareComplete = new EventEmitter<PostModel>();
  sharePostClick(postObject) {
    this.sharePostObject = postObject;
    setInterval(() => {
      this.isotopeGrid.isotope('reloadItems').isotope();
    }, 300);
  }
  resetSharePostObj(postedObj: PostModel) {
    this.sharePostObject = undefined;
    this.eventWhenShareComplete.emit(postedObj);
    setInterval(() => {
      this.isotopeGrid.isotope('reloadItems').isotope();
    }, 300);
  }

  //#endregion
}


