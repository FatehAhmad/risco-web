import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { PrivacySettingsModel } from '../../shared/models/privacy-settings';
import { environment } from '../../../environments/environment';



declare var $:any;

@Component({
  selector: 'app-privacysetting',
  templateUrl: './privacysetting.component.html',
  styleUrls: ['./privacysetting.component.css'],
  providers: [Title]
})
export class PrivacysettingComponent implements OnInit {
  SuccessVisible: boolean=false;
  timer:any;
  isSaveButtonClick:boolean = false;
  objPrivacySettings:PrivacySettingsModel = new PrivacySettingsModel;
  @ViewChild('PrivacySettingForm') PrivacySettingForm;
  
  ErrorMessage: boolean = false;
  ErrorVisible: boolean = false;
  imagePath: any;


  constructor(private title: Title,public objRouter: Router,private objUserService: UserService,private objhttp:Http){ 
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {
    this.navigate();
    this.triggerField();

    //service calling to get the user data
    this.objUserService.getUserData()
    .subscribe(res => {
      if (res.StatusCode == 200) { 
        this.objPrivacySettings = res.Result;
      }
    })

    
  //set the title of the page
    this.title.setTitle('Privacy Setting | Risco');
    Helper.setBodyClass("home-page");

    this.mobiledetection();

  }
  
 //navigate to the previous page
  navigate(){
    $('.back_arrow').on('click', function(){
      window.history.back();
  });
  }

  mobiledetection(){
   
      var ua = navigator.userAgent;
  
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
      window.location.href = 'http://www.google.com';
  
      else if(/Chrome/i.test(ua))
     console.log("c")
  
      else
      console.log("d")
      
  }



  //to check if the form is valid or not
  onSaveClick(){

      if (!this.PrivacySettingForm.valid) {
        this.isSaveButtonClick = true;
        return;
      }
      
      //calling the service to get the privacy settings
      this.objUserService.privacysetting(this.objPrivacySettings)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.ErrorVisible = false;
          this.SuccessVisible = true;
        }
        else {
          this.SuccessVisible = false;
          this.ErrorVisible = true;
          this.ErrorMessage = res.Result.ErrorMessage;
        }
      })

    clearTimeout(this.timer);
    window.scrollTo(0, 0);  
    this.SuccessVisible =true; 
    this.timer = setTimeout(() => {
      this.objRouter.navigate(["/index"]);         
    }, 2000);
  
  }


  //function to change the states of FindByEmail and FindByPhone to true or false
  MuteDiscoverability(type){
    if (type == 'FindByEmail')
    {
     this.objPrivacySettings.FindByEmail= ! this.objPrivacySettings.FindByEmail
    }
    else{
        this.objPrivacySettings.FindByPhone=  !this.objPrivacySettings.FindByPhone
    }
    //console.log(this.objPrivacySettings);  
  }

  

  triggerField(){
    $(document).ready(function(){
      $("#on").trigger("click");
  });
  }

}
