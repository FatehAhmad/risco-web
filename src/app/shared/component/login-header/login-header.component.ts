import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../services/user.service';
import { LoggedInUser } from '../../classes/loggedInUser';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css']
})
export class LoginHeaderComponent implements OnInit {
  imagePath: any;

  loginData = {
    userEmail: '',
    password: ''
  }

  errorMessage : String = '';

  constructor(private objUserService: UserService, public objRouter: Router) {
    this.imagePath = environment.imagePath;
  }

  ngOnInit() {
  }

  login() {

    if (!this.loginData.userEmail || !this.loginData.password) {
      this.errorMessage = 'enter valid email and password';
    }

    this.objUserService.checkUserAuth(this.loginData.userEmail, this.loginData.password)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          LoggedInUser.addLoggedInUser(res.Result);
          this.objRouter.navigate(["index"]);
        }else {
          if(res.Result.ErrorMessage == 'Your account is not verified.'){
            localStorage.setItem('_u_e_' , this.loginData.userEmail);
          }
          this.errorMessage = res.Result.ErrorMessage; 
        }
      })

  }

}
