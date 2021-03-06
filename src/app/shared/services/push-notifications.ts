import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { debug } from 'util';
import { UserService } from './user.service';
import { RegisterPushNotification } from '../models/register-push-notification';
import { LoggedInUser } from '../classes/loggedInUser';

@Injectable()
export class MessagingService {
  ;

  messaging;
  currentMessage = new BehaviorSubject(null);
  objNotificationModel: RegisterPushNotification = new RegisterPushNotification();
  firebaseInitialized: boolean= false;
  static notificationUnread: boolean= false;

  constructor(private objUserService: UserService, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    try {
      if (firebase) {
        this.messaging = firebase.messaging();
      }
      else {
        console.log("Firebase not available");
      }
    }
    catch (ex) {
      console.log("Firebase not available");
    }
  }


  updateToken(token) {
    ;
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  initFirebaseAndGetPermission() {
    var user = LoggedInUser.getLoggedInUser();
    if (user && !this.firebaseInitialized) {

      try {
        this.messaging.requestPermission()
          .then(() => {
            return this.messaging.getToken()
          })
          .then(token => {

            this.objNotificationModel.AuthToken = token;
            this.objNotificationModel.IsAndroidPlatform = 2;
            this.objNotificationModel.IsPlayStore = false;
            this.objNotificationModel.IsProduction = false;
            this.objNotificationModel.DeviceName = "";
            this.objNotificationModel.UDID = token;
            this.objNotificationModel.User_Id = user.Id;
            this.objNotificationModel.Platform = 2;
            this.objUserService.registerPushNotification(this.objNotificationModel)
              .subscribe(res => {

              });
            console.log("Firebase Push Device Token: " + token)
            this.updateToken(token)
          })
          .catch((err) => {
            console.log('Unable to get permission to notify.', err);
          });


        this.messaging.onMessage((payload) => {        
          this.currentMessage.next(payload)
          var data = JSON.parse(JSON.stringify(payload));
          if (data) {
            var notification = new Notification(data.notification.title, {
              icon: 'favicon.ico',
              body: data.notification.body,
            });

            // notification.onclick = function () {
            //   window.open(data.notification.click_action);
            // };

            MessagingService.notificationUnread = true;
          }
        });

        this.firebaseInitialized = true;
      }
      catch (ex) {
        console.log('Firebase initialization error. ', ex);

      }
    }

  }
}