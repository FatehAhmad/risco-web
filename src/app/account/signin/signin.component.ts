import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from '../../shared/services/data-provider.service';
import { AccountSettingsModel } from '../../shared/models/account-settings';
import { UserModel } from '../../shared/models/userModel';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { NotificationsModel } from '../../shared/models/notification';
// import { MessagingService } from '../../shared/services/push-notifications';

declare var $;
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [Title]
})
export class SigninComponent implements OnInit {
  SuccessVisible: boolean = false;
  ErrorVisible: boolean = false;
  public SigninComponent = SigninComponent;
  public UserService = UserService;

  static objNotificationsModel: NotificationsModel = new NotificationsModel();
  ErrorMessage: string = "";
  isSaveButtonClick: boolean = false;
  @ViewChild('UserForm') UserForm;
  imagePath: any;

  constructor(private route: ActivatedRoute, private objUserService: UserService, public objRouter: Router, private title: Title, private objDataProviderService: DataProviderService) {
    this.imagePath = environment.imagePath;

    if(LoggedInUser.getLoggedInUser()){
      objRouter.navigate(["index"]);
    }
  }

  onkeyUp($event, email, password) {
    if ($event.key == "Enter") {
      this.onLogin(email, password);
    }
  }

  onLogin(email, password) {
    if (!this.UserForm.valid) {
      this.isSaveButtonClick = true;
      return;
    }

    this.isSaveButtonClick = false;

    this.objUserService.checkUserAuth(email.value, password.value)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          this.ErrorVisible = false;
          this.SuccessVisible = true;

          LoggedInUser.addLoggedInUser(res.Result);
          HeaderComponent.objAccountSetting = res.Result;
          this.objUserService.objUSerModel = res.Result;
          // this.messageService.initFirebaseAndGetPermission();
          this.objRouter.navigate(["index"]);
        }
        else {
          this.SuccessVisible = false;

          if(res.Result.ErrorMessage == "Invalid email or phone or password."){
            this.ErrorVisible = true;
            this.ErrorMessage = res.Result.ErrorMessage;
          }

          if(res.Result.ErrorMessage == 'Your account is not verified.'){
            $.notify(
                { message: 'Your account is not verified.' },
                { type: 'danger' }
            );
            localStorage.setItem('_u_e_' , email.value);
            this.objRouter.navigate(['/verification'])
          }
        }
      }
      )
  }

  ngOnInit() {
    console.log(this.route.snapshot.url[0].path);
    this.title.setTitle('Sign In | Risco');
    Helper.setBodyClass('loginPage');
  }

}
