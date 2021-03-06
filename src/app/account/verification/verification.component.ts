import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/services/user.service';
import { LoggedInUser } from '../../shared/classes/loggedInUser';

declare var $;

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  providers: [Title]

})
export class VerificationComponent implements OnInit {
  imagePath: any;

  verificationData = {
    Email: '',
    Code: '',
    Authorization: 'abc'
  }
  errorMessage = '';

  checkCodeAndEmail: boolean = false;

  constructor(private title: Title, private objUserService: UserService, private router: Router) {
    this.imagePath = environment.imagePath;
  }

  verificationSubmit() {
    let email =  localStorage.getItem('_u_e_');

    if(email){
      this.verificationData.Email = email
    }

    if (!this.verificationData.Code) {
      this.checkCodeAndEmail = true;
      this.errorMessage = "code required*";
      return false
    }

    this.objUserService.verifySmsCode(this.verificationData)
      .subscribe(res => {
        if (res.StatusCode == 200) {
          $('.danger').remove();
          $.notify(
            { message: 'Your account has been verified successfully.' },
            { type: 'success' }
          );
          this.router.navigate(['/topics'])
          // this.router.navigate(['/signin'])
        }

        if (res.Result && res.Result.ErrorMessage) {
          this.checkCodeAndEmail = true;
          this.errorMessage = res.Result.ErrorMessage;
        }
      })
  }

  ngOnInit() {
    this.title.setTitle('Verification | Risco');
    Helper.setBodyClass("signupPage");
  }

  /*********************************************
  * only number value are allowed functionality
  *********************************************/
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  /*****************************
   * resend code functionality
   *****************************/
  resendCode() {
    this.objUserService.resendCodeApi({ Email: 'testriscotest@mailinator.com' })
      .subscribe(res => {
        if (res.StatusCode == 200) {
          $('.success').remove();
          $.notify(
            { message: res.Result },
            { type: 'success' }
          );
        }
      })
  }

}
