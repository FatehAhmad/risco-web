import { LanguageService } from './../../shared/services/language.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { UserModel } from '../../shared/models/userModel';
import { UserService } from '../../shared/services/user.service';
import { InterestsModel } from '../../shared/models/interests';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { LanguageModel } from '../../shared/models/language';

declare var $: any;
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css'],
  providers: [Title]
})
export class AccountSettingComponent implements OnInit {
  timer: any;
  public countries: any;
  ErrorMessage: boolean = false;
  SuccessVisible: boolean = false;
  ErrorVisible: boolean = false;
  isSaveButtonClick: boolean = false;
  // Interests: InterestsModel[]=[];
  Languages: LanguageModel[] = [];
  objAccountSetting: UserModel = new UserModel();
  @ViewChild('AccountForm') AccountForm;
  imagePath: any;
  btnloader: boolean;

  public selectedInterests: string[] = [];

  public sportsInterests: InterestsModel;
  public technologyInterests: InterestsModel;
  public mediaInterests: InterestsModel;
  public informationSecurityInterests: InterestsModel;
  public medicalInterests: InterestsModel;
  public naturalInterests: InterestsModel;
  public newsInterests: InterestsModel;
  public tourismInterests: InterestsModel;



  constructor(private title: Title, private objUserService: UserService, private languageService: LanguageService, private objRouter: Router,private headerComponent:HeaderComponent) {
    this.imagePath = environment.imagePath;
    this.btnloader = false;
  }

  ngOnInit() {
    $('body').css("position", "inherit");
    this.objUserService.getCountries()
      .subscribe(res => {
        this.countries = res
      },
        error => console.log(error)
      );

    this.objUserService.getUserData()
      .subscribe(res => {
        if (res.StatusCode == 200) {
        this.objAccountSetting = res.Result;

        this.sportsInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Sports")[0];
        this.technologyInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Technology")[0];
        this.mediaInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Media")[0];
        this.informationSecurityInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Information Security")[0];
        this.medicalInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Medical")[0];
        this.naturalInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Natural")[0];
        this.newsInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "News")[0];
        this.tourismInterests = this.objAccountSetting.BasketSettings.Interests.filter((x) => x.Name == "Tourism")[0];


        }
      });

      this.languageService.getAllLanguages()
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.Languages = res.Result;
        }
      });

    this.title.setTitle('Account Settings | Risco');
    Helper.setBodyClass("home-page");
  }

  setInterests(childInterest) {
    childInterest.Selected = !childInterest.Selected;

    if (childInterest.Selected) {

      this.selectedInterests.push(childInterest.Id);

    } else if (!childInterest.Selected) {

      this.selectedInterests.splice(this.selectedInterests.indexOf(childInterest.Id), 1);
    }
  }

  onSaveClick() {




    // if (!this.AccountForm.valid) {
    //   this.isSaveButtonClick = true;
    //   return;
    // }

    this.isSaveButtonClick = false;
    this.objAccountSetting.Interests = this.selectedInterests.toString();

    // this.objAccountSetting.BasketSettings.Interests.forEach(interest => {

    //   if (interest.Checked) {

    //     this.objAccountSetting.Interests += interest.Id + ",";
    //   }

    // });

    this.objAccountSetting.Interests = this.objAccountSetting.Interests.replace(/(^,)|(,$)/g, "");

    this.btnloader = true;

    this.objUserService.updateProfile(this.objAccountSetting)
      .subscribe(res => {

        if (res.StatusCode == 200) {

          this.objAccountSetting = res.Result;
          this.ErrorVisible = false;
          this.SuccessVisible = true;

          this.objUserService.getUserData()
          .subscribe(res => {

            if (res.StatusCode == 200) {

              LoggedInUser.addLoggedInUser(res.Result);

              window.scrollTo(0, 0);

              clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                  this.objRouter.navigate(["/index"]);
                }, 2000);
              }

          });

        }
        else {

          this.SuccessVisible = false;
          this.ErrorVisible = true;
          this.ErrorMessage = res.Result.ErrorMessage;
        }
        this.btnloader = false;
      }
      )
  }

  addRemoveInterests(interest: InterestsModel) {
    ;
    //  let isFound = false;
    //  this.Interests.forEach(int=>{
    //    if(interest==int){
    //     isFound=true;
    //    }
    //  });
    //  if(isFound){
    //    this.Interests.splice(this.Interests.indexOf(interest),1);
    //  }
    //  else{
    //    this.Interests.push(interest);
    //  }
  }

  deactivateAccountBtnClick() {
    $.fancybox.open({
      src: '#deactivateAccount',
      touch: false,
      "afterClose": function () {
        $.fancybox.destroy();
      }
    });
  }

  confirmDeactivateAccountBtnClick(){
    this.objUserService.deactivateAccount().subscribe((result)=> {
      if(result.StatusCode === 200){
        this.headerComponent.logout();
      }
    });
  }

}
