import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
const routes: Routes = [
  
  { path: 'about', component: AboutComponent},
  {  path: 'heat-map/:HashTag', component: HeatMapComponent},
  { path: 'contact', component: ContactComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
