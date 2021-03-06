import { Notifications } from './../../shared/models/notifications';
import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { NotificationSettingsModel } from '../../shared/models/notification-settings';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { environment } from '../../../environments/environment';

declare var $:any;
@Component({
  selector: 'app-notificationsetting',
  templateUrl: './notificationsetting.component.html',
  styleUrls: ['./notificationsetting.component.css'],
  providers: [Title]
})
export class NotificationsettingComponent implements OnInit {

  isSaveButtonClick:boolean = false;
  objNotificationSettings:NotificationSettingsModel = new NotificationSettingsModel;
  notificationCategories:NotificationSettingsModel[] = new Array<NotificationSettingsModel>();
  @ViewChild('NotificationSettingForm') NotificationSettingForm;

  ErrorMessage: boolean = false;
  SuccessVisible: boolean = false;
  ErrorVisible: boolean = false;
  timer: any;
  imagePath: any;

  constructor(private title: Title,private objUserService: UserService,private objRouter: Router,private objhttp:Http) {
    this.imagePath= environment.imagePath;
   }

  ngOnInit() {

    //get the user data from the service
    this.objUserService.getUserData()
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objNotificationSettings = res.Result;
        }
      })

      this.navigate();

      this.objUserService.getNotificationTypes(0)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.notificationCategories = res.Result.List;
        }
      })

      //set the title of the page
    this.title.setTitle('Notification Setting | Risco');
    Helper.setBodyClass("home-page");

  }

  //function to navigate to the pervious
  navigate(){
    $('.back_arrow').on('click', function(){
      window.history.back();
  });
  }


  //function called to check if the form is valid or not
  onSaveClick() {
    if (!this.NotificationSettingForm.valid) {
      this.isSaveButtonClick = true;
      return;
    }

    //function called to save the settings using the service
    this.objUserService.notificationsettings(this.objNotificationSettings)
    .subscribe(res => {
      if (res.StatusCode == 200) {
        this.ErrorVisible = false;
        this.SuccessVisible = true;
      }
      else {
        this.SuccessVisible = false;
        this.ErrorVisible = true;
        this.ErrorMessage = res.Result.ErrorMessage;
      }
    })
    clearTimeout(this.timer);
    window.scrollTo(0, 0);
    this.SuccessVisible =true;
    this.timer = setTimeout(() => {
      this.objRouter.navigate(["/index"]);
    }, 2000);
  }

  //function to change the states of MuteUnverifiedEmail and MuteUnverifiedPhone to true and false
  MuteNotification(type){

    if (type == 'Groups')
    {
     this.objNotificationSettings.GroupsNotification= ! this.objNotificationSettings.GroupsNotification
    }
    else{
        this.objNotificationSettings.PostsNotification=  !this.objNotificationSettings.PostsNotification
    }
  //  console.log(this.objNotificationSettings);
  }

  updateUserNotificationSetting(notificationTypeId, status){

    this.objUserService.updateUserNotificationSetting(notificationTypeId, status)
    .subscribe(res => {
      if (res.StatusCode == 200) {
        this.notificationCategories = res.Result.List;
      }
    })

  }

}
