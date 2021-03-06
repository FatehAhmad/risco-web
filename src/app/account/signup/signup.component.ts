import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { SignUpModel } from '../../shared/models/signup';
import { Http } from '@angular/http';
import { UserService } from '../../shared/services/user.service';
import { PasswordMatchDirective} from '../../shared/Directives/password-match';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { debug } from 'util';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [Title]
})
export class SignupComponent implements OnInit {
  btnloader: boolean;
  ErrorVisible:boolean=false;
  ErrorMessage:string="";
  SuccessVisible:boolean=false;
  SuccessMessage:string="Congratulaions! Your account has been created successfully";
  objSignUp:SignUpModel = new SignUpModel();
  isSaveButtonClick:boolean = false;
  phoneNoOriginal:string;
  public countries:any;
  serviceCalling:boolean;
  @ViewChild('SignUpForm') SignUpForm;
  imagePath: any;
  IsAgreeToTerms: boolean = false;
  _countrySelected : any ;

  constructor(private objRouter:Router,private objHttp:Http, private objSignUpService:UserService, private title:Title) {
    this.imagePath= environment.imagePath;
    if(LoggedInUser.getLoggedInUser()){
      objRouter.navigate(["index"]);
    }
    this.btnloader = false;
   }

  selectedCountry(){
    let country = this.countries.filter(item=> item.name == this._countrySelected );
    this.objSignUp.CountryCode = (country && country.length)?country[0]['callingCode']:'';
    this.objSignUp.CountryName = this._countrySelected;
  }
  register(){

    if(!this.SignUpForm.valid || this.serviceCalling){
      this.isSaveButtonClick = true;
      return;
    }
    this.isSaveButtonClick = false;
    this.objSignUp.Gender -= 1;
    this.phoneNoOriginal = this.objSignUp.PhoneNumber;
    this.objSignUp.PhoneNumber = this.objSignUp.CountryCode + this.objSignUp.PhoneNumber;
    this.serviceCalling = true;
    this.btnloader = true;
    this.objSignUpService.register(this.objSignUp)
    .subscribe(res=>{

      this.serviceCalling = false;
      if(res.StatusCode == 200){
        this.ErrorVisible = false;

        localStorage.setItem('_u_e_' , res.Result.Email);
        LoggedInUser.addLoggedInUser(res.Result);
        this.objRouter.navigate(["/verification"]);
      }
      else{
        this.SuccessVisible=false;
        this.ErrorVisible = true;
        this.ErrorMessage = res.Result.ErrorMessage;
        this.objSignUp.PhoneNumber = this.phoneNoOriginal;
      }
      this.btnloader = false;
    })
  }


  ngOnInit() {
    this.title.setTitle('Sign up | Risco');
    Helper.setBodyClass('signupPage');

    this.objSignUpService.getCountries()

    .subscribe(
       res=>{ this.countries = res},
       error => console.log(error)
      );
  }

  agreeToTerms(){
    if(this.IsAgreeToTerms){
      this.IsAgreeToTerms = false;
    } else {
      this.IsAgreeToTerms = true;
    }

  }
}
