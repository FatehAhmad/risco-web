import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesSidebarRoutingModule } from './pages-sidebar-routing.module';
import { FollowComponent } from './follow/follow.component';
import { UnFollowComponent } from './unfollow/unfollow.component';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsettingComponent } from './notificationsetting/notificationsetting.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PrivacysettingComponent } from './privacysetting/privacysetting.component';
import { FaqComponent } from './faq/faq.component';
import { HttpModule } from '@angular/http';
import { EmojiPickerModule } from 'ng-emoji-picker';
import { FormsModule } from '@angular/forms';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
// import { AngularFireModule } from 'angularfire2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MomentModule, TimeAgoPipe } from 'angular2-moment';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { HeaderComponent } from '../shared/component/header/header.component';
import { LoggedInUser } from '../shared/classes/loggedInUser';
import { MessagingService } from '../shared/services/push-notifications';
import { ActivityLogsService } from '../shared/services/activity-log.service';
import { DataService } from '../shared/services/data-service';
import { GroupService } from '../shared/services/group.service';
import { FollowService } from '../shared/services/follow.service';
import { LanguageService } from '../shared/services/language.service';
import { PostService } from '../shared/services/post.service';
import { UserService } from '../shared/services/user.service';
import { SettingsService } from '../shared/services/settings';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ContactService } from '../shared/services/contact.service';
import { DataProviderService } from '../shared/services/data-provider.service';
import { HttpService } from '../shared/services/http.service';
import { AppComponent } from '../app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PostComponent } from './post/post.component';
import { CreatePostPopupComponent } from './popups/create-post-popup/create-post-popup';
import { SharePostPopupComponent } from './popups/share-post-popup/share-post-popup';
import { RemainingTime } from './Share/filters/calculate-time';
import { RoundOffHtmlNumber } from './Share/customPipes/roundoffhtmlnumber';
import { DaysCount } from './Share/customPipes/daysCount';
import { IsNotificationUnread } from './Share/filters/IsNotificationUnread';
import { SearchFilterGroups } from './Share/filters/SearchFilterGroups';
import { SearchFilter2 } from './Share/filters/SearchFilter';
import { UserProfileSidebarComponent } from './Share/component/user-profile-sidebar/user-profile-sidebar.component';
import { ConfirmEqualValidatorDirective } from './Share/Directives/confirm-equal-validator.directive';
import { PasswordMatchDirective } from './Share/Directives/password-match';
import { GroupDetailComponent } from '../group/group-detail/group-detail.component';
import { PagesSidebarComponent } from './pages-sidebar.component';
import { GroupSidebarComponent } from './Share/component/group-sidebar/group-sidebar.component';
import { ProfileSidebarComponent } from './Share/component/profile-sidebar/profile-sidebar.component';
import { SideFollowGroupComponent } from './side-follow-group/side-follow-group.component';

@NgModule({
  declarations: [FollowComponent,
     UnFollowComponent,
         IndexComponent,
          ProfileComponent, UserProfileComponent,
           MessagesComponent, NotificationsettingComponent,
            PrivacypolicyComponent,
            PostDetailComponent,
             PrivacysettingComponent, FaqComponent,
            SidebarComponent,
            CreatePostPopupComponent,
            GroupSidebarComponent,
            SharePostPopupComponent,
            PostComponent,
            ProfileSidebarComponent,
            PasswordMatchDirective,
    ConfirmEqualValidatorDirective,
    UserProfileSidebarComponent,
    SearchFilter2,
    SearchFilterGroups,
    IsNotificationUnread,
    DaysCount,
    RoundOffHtmlNumber,
    RemainingTime,
    PagesSidebarComponent,
    SideFollowGroupComponent
  ],

           imports: [
      CommonModule,
      PagesSidebarRoutingModule,
             EmojiPickerModule,
             FormsModule,
            //  AngularFireDatabaseModule,
            //  AngularFireAuthModule,
             Ng2FilterPipeModule,
            //  AngularFireModule.initializeApp(
            //    {
            //      // apiKey: 'AIzaSyC3_FaYdpTVPtbmv9nowrWdVakumV12siQ',
            //      // authDomain: 'risco-276fd.firebaseapp.com',
            //      // databaseURL: 'https://risco-276fd.firebaseio.com',
            //      // projectId: 'risco-276fd',
            //      // storageBucket: 'risco-276fd.appspot.com',
            //      // messagingSenderId: '1068880581719'
            //      apiKey: 'AIzaSyDCfFqCFbKNvzVOb9IuU98dSpNbjZSbriI',
            //      authDomain: 'riksco-e56bb.firebaseapp.com',
            //      databaseURL: 'https://riksco-e56bb.firebaseio.com',
            //      projectId: 'riksco-e56bb',
            //      storageBucket: 'riksco-e56bb.appspot.com',
            //      messagingSenderId: '702971571316'
            //    }
            //  ),

             MomentModule,
             PickerModule
           ],

  // providers: [
  //   GroupDetailComponent,
  //   HeaderComponent,
  //   LoggedInUser,
  //   AngularFireAuth,
  //   AngularFireDatabase,
  //   MessagingService,
  //   ActivityLogsService,
  //   SearchFilter2,
  //   SearchFilterGroups,
  //   DataService,
  //   GroupService,
  //   FollowService,
  //   LanguageService,
  //   PostService,
  //   UserService,
  //   SettingsService,
  //   AuthGuard,
  //   ContactService,
  //   DataProviderService,
  //   HttpService,
  //   AppComponent,
  //   DaysCount,
  //   TimeAgoPipe,
  //   RemainingTime,
  //   MomentModule,
  //   PickerModule,
  //   RoundOffHtmlNumber
  // ],
})
export class PagesSidebarModule { }
