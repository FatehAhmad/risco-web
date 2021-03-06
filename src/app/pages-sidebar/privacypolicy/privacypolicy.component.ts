import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { StaticPagesModel } from '../../shared/models/staticpagesModel';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { SettingsService } from 'src/app/shared/services/settings';
import { SettingsModel } from 'src/app/shared/models/settings';

declare var $;

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css'],
  providers: [Title]
})
export class PrivacypolicyComponent implements OnInit {

  // privacydata = [];

  objStaticPagesModel : StaticPagesModel = new StaticPagesModel();
  imagePath: any;
  objGetSettings:SettingsModel=new SettingsModel();
 
  constructor(private objSettingsService:SettingsService, private title: Title) {
    this.imagePath= environment.imagePath;
  }  

  ngOnInit() {
    
    this.title.setTitle('Privacy Policy | Risco');
    Helper.setBodyClass("home-page");  
    
    this.objSettingsService.getSettings()
    .subscribe(res=>{
      if(res.StatusCode==200){
        this.objGetSettings=res.Result;
        $(".PrivacyPolicy_panel").html(this.objGetSettings.PrivacyPolicy)
      }
    });

  }


}
