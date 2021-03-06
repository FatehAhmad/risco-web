import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { StaticPagesModel } from '../../shared/models/staticpagesModel';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { UserModel } from '../../shared/models/userModel';
import { SettingsService } from 'src/app/shared/services/settings';
import { SettingsModel } from 'src/app/shared/models/settings';

declare var $;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [Title]
})
export class AboutComponent implements OnInit {

  objStaticPagesModel: StaticPagesModel = new StaticPagesModel();
  imagePath: any;
  LoginStatus: boolean;
  objGetSettings: SettingsModel = new SettingsModel();

  constructor(private objSettingsService: SettingsService , private title: Title) {
        this.imagePath = environment.imagePath;
  }

  ngOnInit() {
    this.title.setTitle('About Us | Risco');
    Helper.setBodyClass('home-page');

    this.objSettingsService.getSettings()
    .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objGetSettings = res.Result;
          // this.objGetSettings.AboutUs=Helper.convertHTMLToText(this.objGetSettings.AboutUs);
          $('.about_panel').html(this.objGetSettings.AboutUs)
        }
    });

    const objUser:UserModel=LoggedInUser.getLoggedInUser()
        if(objUser==null||objUser == undefined){
          this.LoginStatus=false;
        }
        else{
          this.LoginStatus=true;
        }    
    
  }

}
