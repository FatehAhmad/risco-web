import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./shared/component/header/header.component";
import { SidebarComponent } from "./shared/component/sidebar/sidebar.component";
import { GroupSidebarComponent } from "./shared/component/group-sidebar/group-sidebar.component";
import { LoginHeaderComponent } from "./shared/component/login-header/login-header.component";
import { ProfileSidebarComponent } from "./shared/component/profile-sidebar/profile-sidebar.component";

import { containsTree } from "@angular/router/src/url_tree";
import { UserService } from "./shared/services/user.service";
import { ContactService } from "./shared/services/contact.service";
import { PasswordMatchDirective } from "./shared/Directives/password-match";
import { Ng2FilterPipeModule } from "ng2-filter-pipe";
import { TimeAgoPipe } from "time-ago-pipe";

import { ConfirmEqualValidatorDirective } from "./shared/Directives/confirm-equal-validator.directive";

import { DataProviderService } from "./shared/services/data-provider.service";
import { AuthGuard } from "./shared/guards/auth.guard";
import { HttpService } from "./shared/services/http.service";
import { PostService } from "./shared/services/post.service";
import { FollowService } from "./shared/services/follow.service";
import { EmojiPickerModule } from "ng-emoji-picker";
import { GroupService } from "./shared/services/group.service";
import { UserProfileSidebarComponent } from "./shared/component/user-profile-sidebar/user-profile-sidebar.component";
import { DataService } from "./shared/services/data-service";
import { SearchFilter2 } from "./shared/filters/SearchFilter";
import { ActivityLogsService } from "./shared/services/activity-log.service";
import { MessagingService } from "./shared/services/push-notifications";
// import {
//   AngularFireDatabase,
//   AngularFireDatabaseModule
// } from "../../node_modules/angularfire2/database";
// import {
//   AngularFireAuth,
//   AngularFireAuthModule
// } from "../../node_modules/angularfire2/auth";
// import { AngularFireModule } from "../../node_modules/angularfire2";
import { LoggedInUser } from "./shared/classes/loggedInUser";
import { IsNotificationUnread } from "./shared/filters/IsNotificationUnread";
import { FooterComponent } from "./shared/component/footer/footer.component";
import { SearchFilterGroups } from "./shared/filters/SearchFilterGroups";
import { SettingsService } from "./shared/services/settings";
import { DaysCount } from "./shared/customPipes/daysCount";
import { RoundOffHtmlNumber } from "./shared/customPipes/roundoffhtmlnumber";
import { MomentModule } from "angular2-moment";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { RemainingTime } from "./shared/filters/calculate-time";
import { LanguageService } from "./shared/services/language.service";
import { GroupDetailComponent } from "./group/group-detail/group-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  {
    path: "",
    loadChildren: "./setup/setup.module#SetupModule"
  },
  {
    path: "",
    loadChildren: "./setting/setting.module#SettingModule"
  },
  {
    path: "",
    loadChildren: "./account/account.module#AccountModule"
  },
  {
    path: "",
    loadChildren: "./setup/setup.module#SetupModule"
  },
  {
    path: "",
    loadChildren:
      "./pages-sidebar/pages-sidebar.module#PagesSidebarModule"
  },
  {
    path: "",
    loadChildren: "./group/group.module#GroupModule"
  },
  {
    path: "",
    loadChildren: "./follow/follow.module#FollowModule"
  },
  { path: "", redirectTo: "index", pathMatch: "full" },
  //  children: [
  { path: "header", component: HeaderComponent },
  { path: "login-header", component: LoginHeaderComponent },

  { path: "sidebar", component: SidebarComponent },
  { path: "profilesidebar", component: ProfileSidebarComponent },
  { path: "group-sidebar", component: GroupSidebarComponent },


  { path: "user-profile-sidebar/:Id", component: UserProfileSidebarComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginHeaderComponent,
    PasswordMatchDirective,
    ConfirmEqualValidatorDirective,
    UserProfileSidebarComponent,
    ProfileSidebarComponent,
    SearchFilter2,
    FooterComponent,
    SidebarComponent,
    GroupSidebarComponent,
    SearchFilterGroups,
    IsNotificationUnread,
    FooterComponent,
    DaysCount,
    TimeAgoPipe,
    RoundOffHtmlNumber,
    RemainingTime
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpModule,
    EmojiPickerModule,
    FormsModule,
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    Ng2FilterPipeModule,
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

    RouterModule.forRoot(routes, { useHash: false }),
    MomentModule,
    PickerModule
  ],
  providers: [
    GroupDetailComponent,
    HeaderComponent,
    LoggedInUser,
    // AngularFireAuth,
    // AngularFireDatabase,
    MessagingService,
    ActivityLogsService,
    SearchFilter2,
    SearchFilterGroups,
    DataService,
    GroupService,
    FollowService,
    LanguageService,
    PostService,
    UserService,
    SettingsService,
    AuthGuard,
    ContactService,
    DataProviderService,
    HttpService,
    AppComponent,
    DaysCount,
    TimeAgoPipe,
    RemainingTime,
    MomentModule,
    PickerModule,
    RoundOffHtmlNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
