import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css'],
  providers: [Title]
})
export class ForgetpasswordComponent implements OnInit {
  SuccessVisible: boolean = false;
  ErrorVisible:boolean=false;
  ErrorMessage:string="";
  isSaveButtonClick:boolean = false;  
  @ViewChild('UserForm') UserForm;
  imagePath: any;
  
  constructor(private objUserService: UserService, public router: Router,private title: Title){
    this.imagePath= environment.imagePath;
  }
 
  onkeyUp($event,email){
    if($event.key=="Enter"){
      this.forgetPassword(email);
    }
  }

  forgetPassword(email){
    if(!this.UserForm.valid){
      this.isSaveButtonClick = true;
      return;
    }

    this.isSaveButtonClick = false;

    this.objUserService.forgetPassword(email.value)
    .subscribe(res => {      
        if(res.StatusCode == 200){ 
          this.ErrorVisible = false;
          this.SuccessVisible =true;  
        }
        else{ 
          this.SuccessVisible =false;          
          this.ErrorVisible = true;          
          this.ErrorMessage = res.Result.ErrorMessage;
        }
      }
    )
  }







  ngOnInit() {

    this.title.setTitle('Forget Password | Risco');

    Helper.setBodyClass('loginPage');
  }

}
