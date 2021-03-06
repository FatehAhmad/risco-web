import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/ctrl-ngx-emoji-mart-ngx-emoji';
declare var IngicChat: any;
declare var $: any;


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [Title]
})
export class MessagesComponent implements OnInit {
  imagePath: any;
  objChatText: any = "";
  objCommentText: string = "";
  hideshowemojiees: boolean = false;
  constructor(private title: Title, private route: ActivatedRoute) {
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {
    this.title.setTitle('Messages | Risco');
    Helper.setBodyClass("messagesPage");
    this.route.params.subscribe((params) => {
      if (params && params["userid"] && params["username"]) {
        IngicChat.LoadChatPage(() => {
          IngicChat.InitChatWithFriend(params["userid"], params["username"]);
        });
      } else {
        IngicChat.LoadChatPage();
      }
    });
  }

  fileInputClick() {
    debugger
    $(".uploadAttachmentBtn").click();
  }

  //#region EmojiArea
  addEmoji($event: EmojiEvent, isParent: number) {

    if (isParent == 1) this.objChatText += $event.emoji["native"];
    else this.objChatText += $event.emoji["native"];

  }
  showEmojee(isParent: number) {

    if (isParent == 1) {
      // let elements : NodeListOf<Element> = document.getElementsByClassName("chat-area");
      let elements = document.getElementsByClassName("chat-area");
      $(elements).next().next().find(".emoji-mart").fadeToggle("200");
      $(elements).toggleClass("act");
    }

  }
  //#endregion 


  addEmojis($event: EmojiEvent, isParent: number) {

    if (isParent == 1) this.objChatText += $event.emoji["native"];
    else this.objChatText += $event.emoji["native"];

  }
  showEmojees(isParent: number) {

    if (this.hideshowemojiees) {
      $(".msg-emoji > .emoji-mart").css("display", "none");
      this.hideshowemojiees = false;
    } else {
      $(".msg-emoji > .emoji-mart").css("display", "block");
      this.hideshowemojiees = true;
    }

    if (isParent == 1) {
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

  sendMessage(){
    $(".msg-emoji > .emoji-mart").css("display", "none");
    this.hideshowemojiees = false;
    setTimeout(()=>{
      this.objChatText = '';
    },200)
  }

}
