import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { MediasComponent } from './medias/medias.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MomentModule, TimeAgoPipe } from 'angular2-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AngularFireModule } from 'angularfire2';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { EmojiPickerModule } from 'ng-emoji-picker';
import { HttpModule } from '@angular/http';


import { RemainingTime } from '../shared/filters/calculate-time';
import { DaysCount } from '../shared/customPipes/daysCount';
import { AppComponent } from '../app.component';
import { HttpService } from '../shared/services/http.service';
import { DataProviderService } from '../shared/services/data-provider.service';
import { ContactService } from '../shared/services/contact.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SettingsService } from '../shared/services/settings';
import { UserService } from '../shared/services/user.service';
import { PostService } from '../shared/services/post.service';
import { LanguageService } from '../shared/services/language.service';
import { FollowService } from '../shared/services/follow.service';
import { GroupService } from '../shared/services/group.service';
import { DataService } from '../shared/services/data-service';
import { SearchFilterGroups } from '../shared/filters/SearchFilterGroups';
import { SearchFilter2 } from '../shared/filters/SearchFilter';
import { ActivityLogsService } from '../shared/services/activity-log.service';
import { MessagingService } from '../shared/services/push-notifications';
import { LoggedInUser } from '../shared/classes/loggedInUser';
import { RoundOffHtmlNumber } from '../shared/customPipes/roundoffhtmlnumber';
import { IsNotificationUnread } from '../shared/filters/IsNotificationUnread';
import { UserProfileSidebarComponent } from '../shared/component/user-profile-sidebar/user-profile-sidebar.component';
import { ConfirmEqualValidatorDirective } from '../shared/Directives/confirm-equal-validator.directive';
import { PasswordMatchDirective } from '../shared/Directives/password-match';
import { LoginHeaderComponent } from '../shared/component/login-header/login-header.component';
import { ProfileSidebarComponent } from '../shared/component/profile-sidebar/profile-sidebar.component';
import { SidebarComponent } from '../shared/component/sidebar/sidebar.component';
import { GroupSidebarComponent } from '../shared/component/group-sidebar/group-sidebar.component';
import { GroupDetailComponent } from '../group/group-detail/group-detail.component';

@NgModule({
  declarations: [MediasComponent, TermsConditionsComponent,
],
  imports: [
    CommonModule,
    SettingRoutingModule,
    HttpModule,
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
export class SettingModule { }
