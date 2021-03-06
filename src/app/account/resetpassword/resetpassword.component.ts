import { UserService } from '../../shared/services/user.service';
import { ResetPasswordModel } from '../../shared/models/change-password';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { debug } from 'util';


@Component({
  selector: 'app-changepassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  providers: [Title]
})
export class ResetPasswordComponent implements OnInit {
  ErrorMessage: boolean=false;
  ErrorVisible: boolean=false;
  SuccessVisible: boolean=false;
  isSaveButtonClick: boolean=false;
  timer: any;  
  objResetPassword:ResetPasswordModel = new ResetPasswordModel();

  @ViewChild('ResetPasswordForm') ResetPasswordForm;
  imagePath: any;
  userId: number = 0;
  constructor(private title: Title, private objRouter:Router, private objUserService:UserService,private activatedRoute: ActivatedRoute) { 
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {    
    this.title.setTitle('Reset Password | Risco');
    this.activatedRoute.queryParams.subscribe(params => {      
       this.userId = params['userId'];
    });
  }

  onSaveClick(){
    if (!this.ResetPasswordForm.valid) {
      this.isSaveButtonClick = true;
      return;
    }

    this.isSaveButtonClick = false;  
    this.objResetPassword.User_Id = this.userId;
    this.objUserService.resetPassword(this.objResetPassword)
    .subscribe(res => {
      if (res.StatusCode == 200) {
        this.ErrorVisible = false;
        this.SuccessVisible = true; 

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
        this.objRouter.navigate(["/signin"]);           
        }, 2000);
      }
      else {
        this.SuccessVisible = false;
        this.ErrorVisible = true;
        this.ErrorMessage = res.Result.ErrorMessage;
      }
    }
    )
  
  
  }

  onkeyUp() {
    
  }
}
