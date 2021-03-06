import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule, TimeAgoPipe } from 'angular2-moment';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiPickerModule } from 'ng-emoji-picker';
import { FormsModule } from '@angular/forms';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
// import { AngularFireModule } from 'angularfire2';
import { LoggedInUser } from '../shared/classes/loggedInUser';
import { MessagingService } from '../shared/services/push-notifications';
import { ActivityLogsService } from '../shared/services/activity-log.service';
import { SearchFilter2 } from '../shared/filters/SearchFilter';
import { SearchFilterGroups } from '../shared/filters/SearchFilterGroups';
import { GroupService } from '../shared/services/group.service';
import { DataService } from '../shared/services/data-service';
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
import { DaysCount } from '../shared/customPipes/daysCount';
import { RemainingTime } from '../shared/filters/calculate-time';
import { RoundOffHtmlNumber } from '../shared/customPipes/roundoffhtmlnumber';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HeatMapComponent } from './heat-map/heat-map.component';

import { IsNotificationUnread } from '../shared/filters/IsNotificationUnread';
import { UserProfileSidebarComponent } from '../shared/component/user-profile-sidebar/user-profile-sidebar.component';
import { ConfirmEqualValidatorDirective } from '../shared/Directives/confirm-equal-validator.directive';
import { PasswordMatchDirective } from '../shared/Directives/password-match';
import { ProfileSidebarComponent } from '../shared/component/profile-sidebar/profile-sidebar.component';
import { LoginHeaderComponent } from '../shared/component/login-header/login-header.component';
import { GroupSidebarComponent } from '../shared/component/group-sidebar/group-sidebar.component';
import { SidebarComponent } from '../shared/component/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/component/header/header.component';
import { GroupDetailComponent } from '../group/group-detail/group-detail.component';

@NgModule({
  declarations: [ AboutComponent,
    ContactComponent,
         HeatMapComponent,
     ],
  imports: [
    CommonModule,
    SetupRoutingModule,
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
export class SetupModule { }
