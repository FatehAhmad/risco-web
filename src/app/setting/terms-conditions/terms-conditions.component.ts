import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';


import { StaticPagesModel } from '../../shared/models/staticpagesModel';
import { environment } from '../../../environments/environment';
import { SettingsService } from 'src/app/shared/services/settings';
import { SettingsModel } from 'src/app/shared/models/settings';

declare var $;
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
  providers: [Title]
})
export class TermsConditionsComponent implements OnInit {


objStaticPagesModel : StaticPagesModel = new StaticPagesModel();
imagePath: any;
objGetSettings:SettingsModel=new SettingsModel();


  constructor(private objSettingsService:SettingsService, private title: Title) {
    this.imagePath= environment.imagePath;  
   }

  ngOnInit() {
    this.title.setTitle('Terms Conditions | Risco');
    Helper.setBodyClass("home-page");

    this.objSettingsService.getSettings()
    .subscribe(res=>{
      if(res.StatusCode==200){
        this.objGetSettings=res.Result;
        // this.objGetSettings.TermsConditions=Helper.convertHTMLToText(this.objGetSettings.TermsConditions);
        $(".tnc_panel").html(this.objGetSettings.TermsConditions)
      }
    });
  }

}
