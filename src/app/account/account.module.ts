import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountRoutingModule } from "./account-routing.module";
import { AccountSettingComponent } from "./account-setting/account-setting.component";
import { ChangePasswordComponent } from "./changepassword/changepassword.component";
import { ForgetpasswordComponent } from "./forgetpassword/forgetpassword.component";
import { ResetPasswordComponent } from "./resetpassword/resetpassword.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { VerificationComponent } from "./verification/verification.component";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { MomentModule, TimeAgoPipe } from "angular2-moment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { AngularFireModule } from "angularfire2";
import { Ng2FilterPipeModule } from "ng2-filter-pipe";
// import { AngularFireAuthModule, AngularFireAuth } from "angularfire2/auth";
import { NgKnifeModule } from "ng-knife";
// import {
//   AngularFireDatabaseModule,
//   AngularFireDatabase
// } from "angularfire2/database";
import { FormsModule } from "@angular/forms";
import { EmojiPickerModule } from "ng-emoji-picker";
import { HttpModule } from "@angular/http";
import { RemainingTime } from "../shared/filters/calculate-time";
import { RoundOffHtmlNumber } from "../shared/customPipes/roundoffhtmlnumber";
import { DaysCount } from "../shared/customPipes/daysCount";
import { FooterComponent } from "../shared/component/footer/footer.component";
import { IsNotificationUnread } from "../shared/filters/IsNotificationUnread";
import { SearchFilterGroups } from "../shared/filters/SearchFilterGroups";
import { SearchFilter2 } from "../shared/filters/SearchFilter";
import { UserProfileSidebarComponent } from "../shared/component/user-profile-sidebar/user-profile-sidebar.component";
import { ConfirmEqualValidatorDirective } from "../shared/Directives/confirm-equal-validator.directive";
import { PasswordMatchDirective } from "../shared/Directives/password-match";
import { ProfileSidebarComponent } from "../shared/component/profile-sidebar/profile-sidebar.component";
import { LoginHeaderComponent } from "../shared/component/login-header/login-header.component";
import { GroupSidebarComponent } from "../shared/component/group-sidebar/group-sidebar.component";
import { HeaderComponent } from "../shared/component/header/header.component";
import { LoggedInUser } from "../shared/classes/loggedInUser";
import { MessagingService } from "../shared/services/push-notifications";
import { ActivityLogsService } from "../shared/services/activity-log.service";
import { DataService } from "../shared/services/data-service";
import { GroupService } from "../shared/services/group.service";
import { FollowService } from "../shared/services/follow.service";
import { LanguageService } from "../shared/services/language.service";
import { PostService } from "../shared/services/post.service";
import { UserService } from "../shared/services/user.service";
import { SettingsService } from "../shared/services/settings";
import { AuthGuard } from "../shared/guards/auth.guard";
import { ContactService } from "../shared/services/contact.service";
import { DataProviderService } from "../shared/services/data-provider.service";
import { HttpService } from "../shared/services/http.service";
import { AppComponent } from "../app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { GroupDetailComponent } from "../group/group-detail/group-detail.component";
import { TopicsComponent } from './topics/topics.component';


@NgModule({
  declarations: [
    AccountSettingComponent,
    ChangePasswordComponent,
    ForgetpasswordComponent,
    ResetPasswordComponent,
    SigninComponent,
    SignupComponent,
    VerificationComponent,
    SidebarComponent,
    TopicsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    HttpModule,
    EmojiPickerModule,
    FormsModule,
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    Ng2FilterPipeModule,NgKnifeModule,
    // AngularFireModule.initializeApp({
    //   // apiKey: 'AIzaSyC3_FaYdpTVPtbmv9nowrWdVakumV12siQ',
    //   // authDomain: 'risco-276fd.firebaseapp.com',
    //   // databaseURL: 'https://risco-276fd.firebaseio.com',
    //   // projectId: 'risco-276fd',
    //   // storageBucket: 'risco-276fd.appspot.com',
    //   // messagingSenderId: '1068880581719'
    //   apiKey: "AIzaSyDCfFqCFbKNvzVOb9IuU98dSpNbjZSbriI",
    //   authDomain: "riksco-e56bb.firebaseapp.com",
    //   databaseURL: "https://riksco-e56bb.firebaseio.com",
    //   projectId: "riksco-e56bb",
    //   storageBucket: "riksco-e56bb.appspot.com",
    //   messagingSenderId: "702971571316"
    // }),

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
  // ]
})
export class AccountModule {}
