import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediasComponent } from './medias/medias.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

const routes: Routes = [
{ path: 'terms-and-conditions', component: TermsConditionsComponent},

{ path: 'medias/:Id', component: MediasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
