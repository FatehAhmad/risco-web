import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { HomeGroupComponent } from './home-group/home-group.component';
import { HttpModule } from '@angular/http';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { EmojiPickerModule } from 'ng-emoji-picker';
import { FormsModule } from '@angular/forms';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
// import { AngularFireModule } from 'angularfire2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule, TimeAgoPipe } from 'angular2-moment';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { DataService } from '../shared/services/data-service';
import { GroupService } from '../shared/services/group.service';
import { FollowService } from '../shared/services/follow.service';
import { LanguageService } from '../shared/services/language.service';
import { PostService } from '../shared/services/post.service';
import { UserService } from '../shared/services/user.service';
import { SettingsService } from '../shared/services/settings';
import { ContactService } from '../shared/services/contact.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DataProviderService } from '../shared/services/data-provider.service';
import { AppComponent } from '../app.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupShowingComponent } from './group-showing/group-showing.component';
import { GroupsComponent } from './groups/groups.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { LoggedInUser } from '../shared/classes/loggedInUser';
import { MessagingService } from '../shared/services/push-notifications';
import { ActivityLogsService } from '../shared/services/activity-log.service';
import { CreatePostPopupComponent } from './popups/create-post-popup/create-post-popup';
import { SharePostPopupComponent } from './popups/share-post-popup/share-post-popup';
import { PostComponent } from './post/post.component';
import { PasswordMatchDirective } from './Share/Directives/password-match';
import { ConfirmEqualValidatorDirective } from './Share/Directives/confirm-equal-validator.directive';
import { UserProfileSidebarComponent } from './Share/component/user-profile-sidebar/user-profile-sidebar.component';
import { SearchFilter2 } from './Share/filters/SearchFilter';
import { SearchFilterGroups } from './Share/filters/SearchFilterGroups';
import { IsNotificationUnread } from './Share/filters/IsNotificationUnread';
import { DaysCount } from './Share/customPipes/daysCount';
import { RoundOffHtmlNumber } from './Share/customPipes/roundoffhtmlnumber';
import { RemainingTime } from './Share/filters/calculate-time';
import { HttpService } from '../shared/services/http.service';

import { GroupSidebarComponent } from './Share/component/group-sidebar/group-sidebar.component';
import { ProfileSidebarComponent } from './Share/component/profile-sidebar/profile-sidebar.component';
import { GroupComponent } from './group.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
     HomeGroupComponent,
     GroupDetailComponent,
     GroupShowingComponent,
     GroupComponent,
     GroupsComponent,
     ProfileSidebarComponent,
     ActivityLogComponent,
     NotificationListComponent,
     SidebarComponent,
     GroupSidebarComponent,
     CreatePostPopupComponent,
     SharePostPopupComponent,
     PostComponent,
     PasswordMatchDirective,
ConfirmEqualValidatorDirective,
UserProfileSidebarComponent,
SearchFilter2,
SearchFilterGroups,
IsNotificationUnread,
DaysCount,
RoundOffHtmlNumber,
RemainingTime
  ],
  imports: [
    CommonModule,
    GroupRoutingModule,
    EmojiPickerModule,
    FormsModule,
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    Ng2FilterPipeModule,
    // AngularFireModule.initializeApp(
    //   {
    //     // apiKey: 'AIzaSyC3_FaYdpTVPtbmv9nowrWdVakumV12siQ',
    //     // authDomain: 'risco-276fd.firebaseapp.com',
    //     // databaseURL: 'https://risco-276fd.firebaseio.com',
    //     // projectId: 'risco-276fd',
    //     // storageBucket: 'risco-276fd.appspot.com',
    //     // messagingSenderId: '1068880581719'
    //     apiKey: 'AIzaSyDCfFqCFbKNvzVOb9IuU98dSpNbjZSbriI',
    //     authDomain: 'riksco-e56bb.firebaseapp.com',
    //     databaseURL: 'https://riksco-e56bb.firebaseio.com',
    //     projectId: 'riksco-e56bb',
    //     storageBucket: 'riksco-e56bb.appspot.com',
    //     messagingSenderId: '702971571316'
    //   }
    // ),

    MomentModule,
    PickerModule
  ],
  // providers: [
  //   GroupDetailComponent,
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
export class GroupModule { }
