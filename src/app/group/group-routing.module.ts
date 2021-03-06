import { NotificationListComponent } from './notification-list/notification-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeGroupComponent } from './home-group/home-group.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupShowingComponent } from './group-showing/group-showing.component';
import { GroupsComponent } from './groups/groups.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';

import { GroupSidebarComponent } from './Share/component/group-sidebar/group-sidebar.component';
import { UserProfileSidebarComponent } from './Share/component/user-profile-sidebar/user-profile-sidebar.component';
import { ProfileSidebarComponent } from './Share/component/profile-sidebar/profile-sidebar.component';
import { GroupComponent } from './group.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
    path: "",
    component: GroupComponent,
    children: [
  { path: 'groups', component: GroupsComponent},
  { path: 'group-detail/:Id', component: GroupDetailComponent},
  { path: 'group-showing', component: GroupShowingComponent},
  { path: 'activity-log', component: ActivityLogComponent},
  { path: 'home-group', component: HomeGroupComponent},
  { path: 'notfications', component: NotificationListComponent},


  { path: "sidebar", component: SidebarComponent },
  { path: "profilesidebar", component: ProfileSidebarComponent },
  { path: "group-sidebar", component: GroupSidebarComponent },


  { path: "user-profile-sidebar/:Id", component: UserProfileSidebarComponent }
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
