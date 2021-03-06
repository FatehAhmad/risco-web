import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  { path: 'thankyou', component: ThankyouComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowRoutingModule { }
