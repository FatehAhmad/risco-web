import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowComponent } from './follow/follow.component';
import { UnFollowComponent } from './unfollow/unfollow.component';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsettingComponent } from './notificationsetting/notificationsetting.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PrivacysettingComponent } from './privacysetting/privacysetting.component';
import { FaqComponent } from './faq/faq.component';
import { PostComponent } from './post/post.component';
import { PagesSidebarComponent } from './pages-sidebar.component';
import { UserProfileSidebarComponent } from './Share/component/user-profile-sidebar/user-profile-sidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GroupSidebarComponent } from './Share/component/group-sidebar/group-sidebar.component';
import { ProfileSidebarComponent } from './Share/component/profile-sidebar/profile-sidebar.component';
import { SideFollowGroupComponent } from './side-follow-group/side-follow-group.component';
import { PostDetailComponent } from './post-detail/post-detail.component';


const routes: Routes = [
  {
    path: "",
    component: PagesSidebarComponent,
    children: [


  { path: 'follow', component: FollowComponent},
  { path: 'unfollow', component: UnFollowComponent},
  { path: 'privacysetting', component: PrivacysettingComponent},
{ path: 'privacypolicy', component: PrivacypolicyComponent},
{ path: 'notificationsetting', component: NotificationsettingComponent},
{ path: 'messages/:userid/:username', component: MessagesComponent},
{ path: 'messages', component: MessagesComponent},
 { path: "post/:postId", component: PostComponent },
{ path: 'faq', component: FaqComponent},
{ path: 'index', component: IndexComponent},
{ path: 'profile', component: ProfileComponent},
{ path: 'user-profile/:Id', component: UserProfileComponent},
{ path: 'post-detail/:Id', component: PostDetailComponent},

{ path: "sidebar", component: SidebarComponent },
{ path: "profilesidebar", component: ProfileSidebarComponent },
{ path: "group-sidebar", component: GroupSidebarComponent },

{ path: 'SideFollowGroupComponent', component: SideFollowGroupComponent},
{ path: "user-profile-sidebar/:Id", component: UserProfileSidebarComponent }
]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesSidebarRoutingModule { }
