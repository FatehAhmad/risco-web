import { UserService } from '../../shared/services/user.service';
import { ChangePasswordModel } from '../../shared/models/change-password';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [Title]
})
export class ChangePasswordComponent implements OnInit {

  ErrorMessage: boolean=false;
  ErrorVisible: boolean=false;
  SuccessVisible: boolean=false;
  isSaveButtonClick: boolean=false;
  timer: any;  
  objChangePassword:ChangePasswordModel = new ChangePasswordModel();

  @ViewChild('ChangePasswordForm') ChangePasswordForm;
  imagePath: any;

  constructor(private title: Title, private objRouter:Router, private objUserService:UserService) { 
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {

    this.title.setTitle('Change Password | Risco');
  }

  onSaveClick(){  

    if (!this.ChangePasswordForm.valid) {
      this.isSaveButtonClick = true;
      return;
    }

    this.isSaveButtonClick = false;  

    this.objUserService.changePassword(this.objChangePassword)
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
